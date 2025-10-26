import { textContentSafeAPI } from '@llama-fa/core/api';

export function createDebouncedTextContentSafeValidator(debounceMs = 600) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingResolvers: Array<{ resolve: (v?: any) => void; reject: (e: any) => void; value: string }> = [];
  let lastCache: { text: string; result: { pass: boolean; message?: string } } | null = null;

  const validate = (text: string) => {
    const trimmed = String(text || '').trim();

    if (lastCache && lastCache.text === trimmed) {
      const { pass, message } = lastCache.result;
      return pass ? Promise.resolve() : Promise.reject(message || '文本内容不合规');
    }

    return new Promise<void>((resolve, reject) => {
      pendingResolvers.push({ resolve, reject, value: trimmed });

      if (timer) {
        clearTimeout(timer);
        const prev = pendingResolvers.slice(0, -1);
        prev.forEach((p) => p.resolve());
        pendingResolvers = pendingResolvers.slice(-1);
      }

      timer = setTimeout(async () => {
        const current = pendingResolvers[0];
        pendingResolvers = [];
        timer = null;

        try {
          const res = await textContentSafeAPI({ text: trimmed });
          const raw = res?.data || {};
          const code = raw?.code;
          const msgFromServer = raw?.message ?? raw?.msg;
          const payload = raw?.data;
          const pass = payload?.pass ?? payload?.safe ?? payload?.isPass ?? undefined;

          if (code === 1002) {
            const msg = msgFromServer || '文本内容不合规';
            lastCache = { text: trimmed, result: { pass: false, message: msg } };
            current.reject(msg);
            return;
          }
          if (pass === false) {
            const reason = payload?.reason ?? msgFromServer ?? '模型简介不合规，请按提示修改';
            lastCache = { text: trimmed, result: { pass: false, message: reason } };
            current.reject(reason);
            return;
          }
          if (code && code !== 200 && code !== 1001) {
            const msg = msgFromServer || '模型简介不合规，请按提示修改';
            lastCache = { text: trimmed, result: { pass: false, message: msg } };
            current.reject(msg);
            return;
          }

          lastCache = { text: trimmed, result: { pass: true } };
          current.resolve();
        } catch (err: any) {
          const msg = err?.message ?? '内容安全审核失败，请稍后重试';
          current.reject(msg);
        }
      }, debounceMs);
    });
  };

  const destroy = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    pendingResolvers = [];
  };

  return { validate, destroy };
}

import { AuthUtils, TOKEN_KEY } from '../auth/authUtil';
const {
  REACT_APP_ONLINE_DOMAIN,
  REACT_APP_UCENTER_DOMAIN,
  REACT_APP_INFER_DOMAIN,
  REACT_APP_LAB4AI_DOMAIN,
} = process.env;

// 跳转到其它域名并自动登录
// NOTICE：目标项目需要有/proxy/message.html页面

export function toOtherDomain(url: string) {
  const reqId = Math.round(Math.random() * 999999);
  const token = AuthUtils.getToken();
  const targetURL = new URL(url);

  url = targetURL.origin + targetURL.pathname.replace(/\/{2,}/g, '/') + targetURL.search;
  // 当前没有登录时直接跳转
  if (!token || targetURL.origin == location.origin) {
    window.open(url, '_blank');
    return;
  }
  const listenter = (e: any) => {
    const { origin, data } = e || {};
    const { type, reqId: reqIdRes } = data;
    console.log('接收消息', origin, data);
    if (type == 'auth-success' && reqIdRes == reqId) {
      clearInterval(tt);
      newWindow?.postMessage(
        {
          type: 'navigate',
          content: url,
        },
        targetURL.origin
      );
      window.removeEventListener('message', listenter);
    }
  };
  window.addEventListener('message', listenter);
  const urlProxy = targetURL.origin + '/proxy/message.html?20251017&to=' + encodeURIComponent(url);
  const newWindow = window.open(urlProxy, '_blank');

  const msg = {
    type: 'auth',
    content: {
      key: TOKEN_KEY,
      val: token,
    },
    reqId,
  };
  const tt = setInterval(() => {
    console.log('发送消息', msg, targetURL.origin);
    newWindow?.postMessage(msg, targetURL.origin);
  }, 100);
  setTimeout(() => {
    if (tt) {
      clearInterval(tt);
    }
  }, 10000);
}

function getPath(path: string) {
  try {
    const url = new URL(path);
    return url.pathname + url.search;
  } catch (e) {
    return path;
  }
}

export function toUcenter(path: string) {
  toOtherDomain(`${REACT_APP_UCENTER_DOMAIN}/${getPath(path)}`);
}

export function toInfer(path: string) {
  toOtherDomain(`${REACT_APP_INFER_DOMAIN}/${getPath(path)}`);
}
export function toOnline(path: string) {
  toOtherDomain(`${REACT_APP_ONLINE_DOMAIN}/${getPath(path)}`);
}

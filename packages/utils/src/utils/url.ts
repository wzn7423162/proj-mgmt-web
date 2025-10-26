import { isDev } from './env';
/**
 * 获取URL中的查询参数
 * @param url 目标URL，默认为当前页面URL
 * @returns 查询参数对象
 */
export function getQueryParams(url?: string): Record<string, string> {
  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  const params: Record<string, string> = {};

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * 获取URL中指定的查询参数值
 * @param key 参数名
 * @param url 目标URL，默认为当前页面URL
 * @returns 参数值
 */
export function getQueryParam(key: string, url?: string): string | null {
  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  return urlObj.searchParams.get(key);
}

export function parseUrlByQueryParam(
  url: string,
  queryParams: Record<string, string> | URLSearchParams | null
) {
  const searchParams = new URLSearchParams(queryParams || {});
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}


// 格式化目标URL
export function parseAndRebuildUrl (originalUrl: string): string {
  try {
    if (isDev()) {
      return originalUrl;
    };
    // 使用当前域名作为主域名
    let currentHost = window.location.hostname.replace(/^www\./, '');

    const url = new URL(originalUrl);
    const hostname = url.hostname;

    // 提取第一个 key (jup-qssei2wx)
    const firstKey = hostname.split('.')[0];

    const newHostname = `${firstKey}.${currentHost}`;

    // 构建新的 URL，保留路径和查询参数
    const newUrl = `https://${newHostname}${url.pathname}${url.search}`;

    return newUrl;
  } catch (error) {
    console.error('URL 解析失败:', error);
    return originalUrl;
  }
};
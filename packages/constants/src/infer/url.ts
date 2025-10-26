const locationHref = location.hostname;
const isDev = process.env.NODE_ENV === 'development';

export let currentHost = locationHref.replace(/^www\./, '');

if (isDev) {
  currentHost = 'test.baicainfer.com';
}

export const INFER_DOC_DOMAIN = `https://docs.${currentHost}`;
/** API 文档-概览*/
export const INFER_DOC_API_DOC_URL = `${INFER_DOC_DOMAIN}/docs/documents/api/overview`;
/** API 文档-生文 */
export const INFER_DOC_API_TEXT_DOC_URL = `${INFER_DOC_DOMAIN}/docs/documents/api/llm/chat`;
/** API 文档-生图 */
export const INFER_DOC_API_IMAGE_DOC_URL = `${INFER_DOC_DOMAIN}/docs/documents/api/image/image01`;
/** 计费规则 */
export const INFER_DOC_BILL = `${INFER_DOC_DOMAIN}/docs/documents/recharge/billing`;

export const INFER_CHAT_API_URL = isDev
  ? 'https://cloud.test.baicaiinfer.com/v1'
  : `https://cloud.${currentHost}/v1`;

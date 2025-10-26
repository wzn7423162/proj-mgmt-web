import { isMobile } from './env';

export const IMG_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
export const DOCUMENT_EXTS = ['.pdf', '.docx', '.pptx', '.xlsx', '.odt', '.odp', '.ods'];

/**
 * 获取文件扩展名
 * @param fileName 文件名
 * @returns 小写的扩展名（带点），如 .jpg
 */
export const getFileExtension = (fileName: string): string => {
  const ext = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
  return ext ? `.${ext.toLowerCase()}` : '';
};

/**
 * 获取文件扩展名（不带点）
 * @param fileName 文件名
 * @returns 小写的扩展名（不带点），如 jpg
 */
export const getFileExtensionWithoutDot = (fileName: string): string => {
  const ext = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
  return ext ? ext.toLowerCase() : '';
};

/**
 * 获取文件名（不带扩展名）
 * @param fileName 文件名
 * @returns 文件名（不带扩展名）
 */
export const getFileNameWithoutExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex === -1 ? fileName : fileName.slice(0, lastDotIndex);
};

/**
 * 判断是否是image 文件
 * @param fileName
 * @returns
 */
export const isImageFile = (fileName: string): boolean => {
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return IMG_EXTS.includes(ext);
};

/**
 * 判断是否是image 文件
 * @param fileName
 * @returns
 */
export const isImageFileByExt = (ext: string): boolean => {
  return IMG_EXTS.includes(ext);
};

export const getPlatformFileAccept = () => {
  if (isMobile()) {
    return '*';
  }
  return 'image/*,audio/*,video/*,text/*,.json,.js,.ts,.css,.scss,.less,.html,.xml,.yaml,.yml,.md';
};

export const getPlatformImageAccept = () => {
  // 只接受图片格式
  return 'image/*';
};

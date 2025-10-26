export const isDev = () => {
  return process.env.NODE_ENV === 'development';
};

import { DOCUMENT_EXTS } from './file';

/**
 * 是否是 Web 环境
 */
export function isWeb(): boolean {
  return typeof window !== 'undefined' && !isMobile();
}

/**
 * 是否是移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 是否是 iOS 设备
 */
export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * 是否是 Android 设备
 */
export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

/**
 * 是否是 移动端App内
 */
export function isMobileApp(): boolean {
  // @ts-ignore
  return !!window.ReactNativeWebView;
}

/**
 * 是否是 移动端H5
 * 特指： 移动端App外的H5，即：手机其他浏览器打开的H5
 */
export function isH5(): boolean {
  // @ts-ignore
  return !!window.isH5;
}

/*
 * 是否是 MacOS
 */
export function isMacOS(): boolean {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * 是否是文档类型文件
 * @param fileName 文件名
 */
export function isDocumentFile(fileName: string): boolean {
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return DOCUMENT_EXTS.includes(ext);
}

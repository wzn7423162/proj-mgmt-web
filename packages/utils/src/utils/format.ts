import dayjs from 'dayjs';

/**
 * 格式化文件大小
 * @param bytes
 * @returns
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
};

export const formatAmount = (amount: number | string, retainDecimal = 2) => {
  const numberAmount = Number(amount);

  if (isNaN(numberAmount)) return 0;

  // 使用 parseFloat 和 toFixed 来避免浮点数精度问题
  return parseFloat(numberAmount.toFixed(retainDecimal));
};

export const formatTime = (time: string): string => {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

export const maskPhoneMiddle = (phone?: string) => {
  if (!phone) return '';

  return phone.toString().replace(/(\d{3})\d*(\d{4})/, '$1****$2');
};

export const getNumberFromStr = (str: string) => {
  const numberStr = str.replace(/[^\d.]/g, '');
  const number = parseFloat(numberStr);
  return number;
};

export const formatChatStringTime = (time: Date | string | number | undefined) =>
  time ? dayjs(time).format('MM/DD HH:mm') : '';

export const formatDurationFromSeconds = (totalSeconds: number): string => {
  const seconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分`);
  parts.push(`${secs}秒`);
  return parts.join('');
};

/**
 * 保留指定小数位数（返回数字类型）
 * @param num 要处理的数字（支持 number、string、null、undefined）
 * @param decimalPlaces 要保留的小数位数
 * @param round 是否四舍五入，默认为 true
 * @returns 处理后的数字
 */
export function formatDecimalNumber(
  num: number | string | null | undefined,
  decimalPlaces: number,
  round: boolean = true
): number {
  // 处理 null 和 undefined
  if (num === null || num === undefined) {
    return 0;
  }

  // 处理字符串类型
  if (typeof num === 'string') {
    const trimmed = num.trim();
    if (trimmed === '') {
      return 0;
    }
    const parsed = parseFloat(trimmed);
    if (isNaN(parsed)) {
      return 0;
    }
    num = parsed;
  }

  // 处理数字类型
  if (typeof num === 'number') {
    if (isNaN(num) || !isFinite(num)) {
      return 0;
    }
  }

  const numberValue = Number(num);

  if (decimalPlaces <= 0) {
    return round ? Math.round(numberValue) : Math.floor(numberValue);
  }

  const multiplier = Math.pow(10, decimalPlaces);

  if (round) {
    return Math.round(numberValue * multiplier) / multiplier;
  } else {
    return Math.floor(numberValue * multiplier) / multiplier;
  }
}

export const InputPatten = /^[\u4e00-\u9fa5a-zA-Z0-9-_]+$/;

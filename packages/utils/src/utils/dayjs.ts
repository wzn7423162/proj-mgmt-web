import dayjs, { Dayjs } from 'dayjs';

export const getFriendlyTimeText = (data: Dayjs) => {
  const now = dayjs();
  const diff = now.diff(data, 'minute');
  if (diff < 1) {
    return '刚刚';
  } else if (diff < 60) {
    return `${diff}分钟前`;
  } else if (diff < 1440) {
    return `${Math.floor(diff / 60)}小时前`;
  } else if (diff < 2880) {
    return '昨天';
  } else if (diff < 43200) {
    return `${Math.floor(diff / 1440)}天前`;
  } else {
    return data.format('YYYY-MM-DD');
  }
};

export const getTimeDiffText = (
  beforeTime: number | Date | Dayjs | string,
  afterTime: number | Date | Dayjs | string = dayjs(),
  options?: {
    showSecond?: boolean;
  }
) => {
  const afterDayjs = dayjs.isDayjs(afterTime) ? afterTime : dayjs(afterTime);
  const { showSecond = false } = options || {};

  const dayDiff = afterDayjs.diff(beforeTime, 'day');
  const hourDiff = afterDayjs.diff(beforeTime, 'hour');
  const minuteDiff = afterDayjs.diff(beforeTime, 'minute');
  const secondDiff = afterDayjs.diff(beforeTime, 'second');
  const millisecondDiff = afterDayjs.diff(beforeTime, 'millisecond');

  let resultText = '';

  dayDiff && (resultText += dayDiff + '天');
  hourDiff && (resultText += (hourDiff % 24) + '小时');
  minuteDiff && (resultText += (minuteDiff % 60) + '分');
  if (showSecond) {
    if (secondDiff) {
      resultText += (secondDiff % 60) + '秒';
    } else if (millisecondDiff) {
      resultText += `0.${millisecondDiff}` + '毫秒';
    }
  }

  return resultText;
};

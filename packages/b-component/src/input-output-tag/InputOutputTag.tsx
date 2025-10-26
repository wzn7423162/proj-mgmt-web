import s from './InputOutputTag.module.scss';

interface IInputOutputTagProps {
  number: number;
  type: 'input' | 'output' | 'summary';
  extraText?: string;
}

export const InputOutputTag = ({number, type, extraText}: IInputOutputTagProps) => {
  // 保留两位小数，直接去尾（不四舍五入）
  const formatNumber = (num: number) => {
    return Math.floor(num * 10000) / 10000;
  };
  return <div>
    <span className={type === 'input' ? s.incomeTag : type === 'output' ? s.expenseTag : s.summaryTag}>
      {`${type === 'input' ? '￥' : type === 'output' ? '￥' : ''}${formatNumber(number)}${extraText ? ` ${extraText}` : ''}`}
    </span>
  </div>;
};

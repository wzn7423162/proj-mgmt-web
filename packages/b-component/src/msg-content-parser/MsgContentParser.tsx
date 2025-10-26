
import { CSSProperties, FC, useEffect, useState } from 'react';

interface IMsgContentParserProps {
  html: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}
export const MsgContentParser: FC<IMsgContentParserProps> = ({ html, className = '', style = {}, onClick }) => {
  const [parsedText, setParsedText] = useState('');
  const parseHtmlWithRegex = (content: string): string => {
    if (!content) return '';
    // 1. 替换所有<img>标签为[图片]
    let text = content.replace(/<img[^>]*>/gi, '[图片]');

    // 2. 移除所有HTML标签（<p>、<div>等）
    text = text.replace(/<[^>]+>/gi, '');

    // 3. 去除多余的空格和换行
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  };

  useEffect(() => {
    setParsedText(parseHtmlWithRegex(html));
  }, [html]);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    onClick?.(e);
  };
  return <span className={className} style={style} onClick={handleClick}>{parsedText}</span>;
};

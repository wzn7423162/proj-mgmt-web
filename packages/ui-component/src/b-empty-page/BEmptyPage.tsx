import React from 'react';
import styles from './BEmptyPage.module.scss';
import emptyTaskImg from '@llama-fa/constants/assets/images/task/no_task.png';
import emptyDataImg from '@llama-fa/constants/assets/images/empty/empty_data_list.png';

export interface EmptyPageProps {
  /** 空状态图片地址 */
  image?: string;
  /** 图片的 alt 文本 */
  imageAlt?: string;
  /** 空状态文本描述 */
  description?: React.ReactNode;
  /** 自定义容器高度 */
  height?: string | number;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 额外的操作按钮或内容 */
  extra?: React.ReactNode;
  /** 是否显示空状态图片 */
  emptyImgShow?: boolean;
}

export const BEmptyPage: React.FC<EmptyPageProps> = ({
  image = emptyTaskImg,
  imageAlt = '暂无数据',
  description = '暂无数据',
  emptyImgShow = true,
  height,
  className,
  style,
  extra,
}) => {
  const containerStyle: React.CSSProperties = {
    ...style,
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div className={`${styles.emptyContainer} ${className || ''}`} style={containerStyle}>
      <div className={styles.emptyContent}>
        {image && emptyImgShow && (
          <div className={styles.emptyImage}>
            <img src={image} alt={imageAlt} />
          </div>
        )}
        {description && <div className={styles.emptyDescription}>{description}</div>}
        {extra && <div className={styles.emptyExtra}>{extra}</div>}
      </div>
    </div>
  );
};

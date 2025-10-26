// 3DTextEffect.tsx
import React from 'react';
import styles from './3DTextEffect.module.scss';

interface Props {
  title: string;
  descList: string[];
  width?: string | number;
  height?: string | number;
  position: { x: number | string; y: number | string };
}

export const TextEffect: React.FC<Props> = ({
  title,
  descList,
  width = 180,
  height = 120,
  position,
}) => {
  const { x = 0, y = 0 } = position;
  const getDimension = (value: string | number) =>
    typeof value === 'number' ? `${value}px` : value;

  return (
    <div
      className={styles.scene}
      style={{
        width: getDimension(width),
        height: getDimension(height),
        top: y,
        left: x,
      }}
    >
      <div className={styles.textGroup}>
        <p className={styles.standingText}>{title}</p>
        <p className={styles.slantedText}>
          {descList.map((desc, index) => (
            <React.Fragment key={index}>
              {desc}
              {index !== descList.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};

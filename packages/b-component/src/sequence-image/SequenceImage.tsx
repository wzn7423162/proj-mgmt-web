import { useEffect, useRef, useState } from 'react';
import styles from './SequenceImage.module.scss';

interface SequenceImageProps {
  imageSrc: string; // 图片地址
  frameCount?: number; // 序列图总帧数
  width?: number;
  height?: number;
  duration?: number; // 执行时间
  onClick?: () => void;
}

export const SequenceImage: React.FC<SequenceImageProps> = ({
  imageSrc,
  frameCount = 59,
  width = 120,
  height = 120,
  duration = 2,
  onClick,
}) => {
  const [frame, setFrame] = useState(1);
  const [type, setType] = useState<'in' | 'out'>('out');
  const [running, setRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const interval = (duration * 1000) / frameCount;

  // 清理定时器的辅助函数
  const clearAnimationTimer = () => {
    if (timerRef.current) {
      // @ts-ignore
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 动画函数
  const startAnimation = () => {
    clearAnimationTimer();
    setRunning(true);

    const targetFrame = type === 'in' ? frameCount : 1;
    const step = type === 'in' ? 1 : -1;

    timerRef.current = setInterval(() => {
      setFrame((prevFrame) => {
        const nextFrame = prevFrame + step;

        if ((step > 0 && nextFrame >= targetFrame) || (step < 0 && nextFrame <= targetFrame)) {
          clearAnimationTimer();
          setRunning(false);
          return targetFrame;
        }

        return nextFrame;
      });
    }, interval);
  };

  // 鼠标事件处理
  const handleMouseEnter = () => {
    setType('in');
    if (!running) startAnimation();
  };

  const handleMouseLeave = () => {
    setType('out');
    if (!running) startAnimation();
  };

  useEffect(() => () => clearAnimationTimer(), []);

  // 状态检查
  useEffect(() => {
    // 检测是否需要自动执行动画
    if (!running) {
      if (type === 'in' && frame == 1) {
        startAnimation();
      } else if (type === 'out' && frame == frameCount) {
        startAnimation();
      }
    }
  }, [running, type, frame, frameCount]);

  // 图片错误处理
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('图片加载失败:', e);
  };

  console.log('帧数：frame', frame);

  return (
    <div
      className={`${styles.container}`}
      style={{ width, height }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={imageSrc}
        alt="序列图动画"
        className={styles.image}
        style={{ top: `-${(frame - 1) * height}px` }}
        onError={handleError}
      />
    </div>
  );
};

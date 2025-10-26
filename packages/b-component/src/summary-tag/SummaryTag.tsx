import React from 'react';
import s from './SummaryTag.module.scss';
import classNames from 'classnames';
import { LTitle } from '@llama-fa/component';

interface SummaryTagProps {
  /**
   * The label text to display before the value.
   */
  title: string;
  /**
   * The main content or value to display.
   */
  value: React.ReactNode;
  /**
   * Optional custom CSS class for the container.
   */
  className?: string;
  /**
   * Optional custom CSS class for the value part.
   */
  valueClassName?: string;
}

/**
 * A component to display a summary item, consisting of a title and a value.
 * e.g., "Total Users: 100"
 */
export const SummaryTag: React.FC<SummaryTagProps> = ({
  title,
  value,
  className,
  valueClassName,
}) => {
  return (
    <div className={classNames(s.container, className)}>
      <LTitle title={`${title}:`} />
      <span className={s.balanceTag}>{value}</span>
    </div>
  );
};

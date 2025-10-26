import { DataCell } from '@/data-cell/cell';

/**
 * @description 给cell设置部分数据
 * @param cell
 * @param partialData
 */
export function setPartialDataCell<T>(cell: DataCell<T>, partialData: Partial<T>) {
  cell.set({
    ...cell.get(),
    ...partialData,
  });
}

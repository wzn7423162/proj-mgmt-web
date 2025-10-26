import React, { FC, memo, useState } from 'react';
import { Button, Dropdown } from 'antd';
import styles from './BFilter.module.scss';
import { IItem } from '../b-filter/filter-item/ButtonItem';
import { FilterItem } from '../b-filter/filter-item/FilterItem';
import { LIcon } from '@llama-fa/component';
import { cxb } from '@llama-fa/utils';
export interface IIBFilterValue {
  name: string;
  value: Array<string | number>;
}
export interface IBFilterProps {
  data?: {
    name: string;
    title?: string;
    value?: Array<string | number> | null;
    list: Array<IItem>;
  }[];
  // 受控值：按组名记录当前选中项（多选）
  value?: IIBFilterValue[];
  // 值变更回调（受控/非受控都会触发）
  onChange?: (next: IIBFilterValue[]) => void;

  open?: boolean;
  onOpenChange?: (next: boolean) => void;
}

export const BFilter: FC<IBFilterProps> = memo((props) => {
  const { data, value, onChange, open, onOpenChange } = props;

  const [isRefresh, setIsRefresh] = useState(false)
  const cx = cxb.bind(styles);
  const [innerOpen, setInnerOpen] = useState(open ?? false);

  // 由 data 初始化的本地状态（非受控使用），统一为数组
  const [innerMap, setInnerMap] = React.useState<Map<string, Array<string | number>>>(
    new Map<string, Array<string | number>>((data ?? []).map((g) => [g.name, g.value ?? []]))
  );

  // data 变化时，同步非受控初始值
  React.useEffect(() => {
    setInnerMap(
      new Map<string, Array<string | number>>((data ?? []).map((g) => [g.name, g.value ?? []]))
    );
  }, [data]);

  const isControlled = value !== undefined;

  const getValueFor = (name: string): Array<string | number> => {
    if (isControlled) {
      const found = value?.find((v) => v.name === name);
      return found?.value ?? [];
    }
    return innerMap.get(name) ?? [];
  };

  const emitChange = (map: Map<string, Array<string | number>>) => {
    const next = Array.from(map.entries()).map(([name, v]) => ({ name, value: v }));
    onChange?.(next);
  };

  // 清空某一组
  const clearGroup = (groupName: string) => {
    if (isControlled) {
      const snap = new Map<string, Array<string | number>>();
      (data ?? []).forEach((g) => snap.set(g.name, g.value ?? []));
      (value ?? []).forEach((v) => snap.set(v.name, v.value ?? []));
      snap.set(groupName, []);
      emitChange(snap);
    } else {
      const next = new Map(innerMap);
      next.set(groupName, []);
      setInnerMap(next);
      emitChange(next);
    }
  };

  // 清空全部
  const clearAll = () => {
    const names = (data ?? []).map((g) => g.name);
    const snap = new Map<string, Array<string | number>>(names.map((n) => [n, []]));
    if (isControlled) {
      emitChange(snap);
    } else {
      setInnerMap(snap);
      emitChange(snap);
    }
  };

  const handleSelect = (groupName: string) => (item: IItem) => {
    if (isControlled) {
      // 基于受控值构造快照（数组化）并更新当前组
      const snap = new Map<string, Array<string | number>>();
      (data ?? []).forEach((g) => snap.set(g.name, g.value ?? []));
      (value ?? []).forEach((v) => snap.set(v.name, v.value ?? []));
      const current = snap.get(groupName) ?? [];
      const val = item.value as string | number;
      const i = current.indexOf(val);
      const nextArr =
        i >= 0 ? [...current.slice(0, i), ...current.slice(i + 1)] : [...current, val];
      snap.set(groupName, nextArr);
      emitChange(snap);
    } else {
      // 非受控本地更新 + 通知外部
      const next = new Map(innerMap);
      const current = next.get(groupName) ?? [];
      const val = item.value as string | number;
      const i = current.indexOf(val);
      const nextArr =
        i >= 0 ? [...current.slice(0, i), ...current.slice(i + 1)] : [...current, val];
      next.set(groupName, nextArr);
      setInnerMap(next);
      emitChange(next);
    }
  };

  // 是否存在任意组的选中项（数组长度>0）
  const hasActive = isControlled
    ? (value ?? []).some((v) => (v.value ?? []).length > 0)
    : Array.from(innerMap.values()).some((arr) => arr.length > 0);

  const dropContent = () => {
    return (
      <div className={styles.content}>
        <div className={styles.title}>
          筛选
          <div className={styles.clear} onClick={() => {
            setIsRefresh(!isRefresh)
            clearAll()
          }}>
            <LIcon className={cx(`${styles.icon}`, { [`${styles.active}`]: isRefresh })} type={'icon-qingkong-01'} size="small" />
            <span>清空筛选条件</span>
          </div>
        </div>

        <div className={styles.body}>
          {data?.map((item) => (
            <FilterItem
              key={item.name}
              title={item?.title!}
              list={item.list}
              value={getValueFor(item.name)}
              onSelect={handleSelect(item.name)}
              // 单组清空
              showClear
              onClear={() => clearGroup(item.name)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Dropdown
        open={innerOpen}
        onOpenChange={(next) => {
          setInnerOpen(next);
          onOpenChange?.(!next);
        }}
        trigger={['click']}
        popupRender={dropContent}
        placement="topLeft"
      >
        <Button>筛选</Button>
      </Dropdown>
    </div>
  );
});

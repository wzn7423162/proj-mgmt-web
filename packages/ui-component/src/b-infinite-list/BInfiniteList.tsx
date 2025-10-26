import React, { forwardRef, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Row, Col } from 'antd';
import { BEmptyPage } from '../b-empty-page/BEmptyPage';

export type InfiniteListProps<T> = {
  // 数据源
  items: T[];
  // 列表项渲染函数（使用者只需关注这一项）
  renderItem: (item: T, index: number) => React.ReactNode;

  // 加载控制
  hasMore: boolean;
  loadMore: () => void;
  reload: () => void;

  // 状态与布局控制（可选）
  loading?: boolean; // 首次加载中的展示控制
  page?: number; // 当前页码，用于首屏隐藏列表的逻辑
  span?: number; // 每行列数（24 / span）
  itemWidth?: number;
  gutter?: [number, number]; // 栅格间距
  getKey?: (item: T, index: number) => React.Key; // key 提取器

  // 容器与样式
  height?: number; // 指定滚动容器高度（不传则使用 window 作为滚动容器）
  className?: string; // 外层容器样式
  infiniteScrollClassName?: string; // InfiniteScroll 容器样式
  loader?: React.ReactNode; // 加载中占位

  // 空状态渲染（支持默认继承与自定义）
  emptyRender?: React.ReactNode; // 完全自定义的空节点
  emptyComponent?: React.ComponentType<{
    image?: any;
    imageAlt?: string;
    description?: React.ReactNode;
  }>; // 如 EmptyPage
  emptyProps?: { image?: any; imageAlt?: string; description?: React.ReactNode };

  // 下拉刷新控制（默认开启）
  pullDownToRefresh?: boolean;
  pullDownToRefreshThreshold?: number;
};

function BaseInfiniteList<T>(
  {
    items,
    renderItem,
    hasMore,
    loadMore,
    reload,
    loading = false,
    page = 1,
    span = 4,
    itemWidth = 260,
    gutter = [14, 14],
    getKey,
    height,
    className,
    infiniteScrollClassName,
    loader,
    emptyRender,
    emptyComponent,
    emptyProps,
    pullDownToRefresh = true,
    pullDownToRefreshThreshold = 80,
  }: InfiniteListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const keyOf = (item: T, idx: number) =>
    getKey ? getKey(item, idx) : typeof (item as any)?.id !== 'undefined' ? (item as any).id : idx;

  const listVisible = (!loading || page > 1) && items.length > 0;
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    // 未设置 height 时使用窗口滚动，root 设为 null
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 300px 0px', // 提前触发，提升体验
        threshold: 0,
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const renderEmpty = () => {
    if (emptyRender) return emptyRender;
    if (emptyComponent) {
      const Comp = emptyComponent;
      return <Comp {...(emptyProps ?? {})} />;
    }
    return <BEmptyPage />;
  };

  return (
    <>
      <div className={className} ref={ref}>
        {listVisible && (
          <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
            loader={loader ?? <div />}
            pullDownToRefresh={pullDownToRefresh}
            pullDownToRefreshThreshold={pullDownToRefreshThreshold}
            refreshFunction={reload}
            height={height}
            className={infiniteScrollClassName}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
                columnGap: gutter[0],
                rowGap: gutter[1],
              }}
            >
              {items.map((item, idx) => (
                <div key={keyOf(item, idx)}>{renderItem(item, idx)}</div>
              ))}
            </div>
          </InfiniteScroll>
        )}
        {!loading && items.length === 0 && renderEmpty()}
      </div>
      {/* 滚动底部哨兵：进入视口时触发下一页加载 */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </>
  );
}

export const BInfiniteList = forwardRef(BaseInfiniteList) as <T>(
  p: InfiniteListProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

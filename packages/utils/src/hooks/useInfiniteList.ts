import { useMemo, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

export interface UseInfiniteListOptions<TItem, TParams = any> {
  /**
   * 分页请求函数（你自己的数据请求实现）
   * 参数：
   *  - page: 当前页码（从 1 开始）
   *  - pageSize: 每页数量
   *  - params: 查询参数（筛选、搜索、排序等）
   *  - signal: AbortSignal，用于取消过时请求（请把它传递给你的请求库）
   * 返回：
   *  - { list, total }：列表数据与总条数（total 可选；未提供时以“是否达到 pageSize”判断是否还有下一页）
   */
  fetchPage: (args: {
    page: number;
    pageSize: number;
    params: TParams;
    signal?: AbortSignal;
  }) => Promise<{ list: TItem[]; total?: number }>;
  /**
   * 首次加载的查询参数（会参与 queryKey 构造，用于缓存隔离）
   */
  initialParams?: TParams;
  /**
   * 每页数量（默认 24）。影响 hasMore 判定（在没有 total 时）
   */
  pageSize?: number;
  /**
   * TanStack Query 的 key 前缀（用于缓存隔离）
   * 不同前缀会产生不同的缓存空间，避免互相影响
   */
  queryKeyPrefix?: string;
  /**
   * 是否启用查询（默认 true）
   * 常用于初始条件未就绪时禁用，待条件就绪再开启
   */
  enabled?: boolean;
  /**
   * 数据“新鲜”时间窗口（毫秒）
   * - 在 staleTime 时间内，数据被视为“新鲜”，不会因页面聚焦、网络重连而自动重新获取
   * - 超过该时间数据变为“陈旧”，发生上述事件时会自动重抓
   * - 设置较大可减少重复请求，提升切换/聚焦的体验；设置为 0 则更“及时”
   */
  staleTime?: number; // 默认 0
  /**
   * 闲置查询的缓存保留时间（毫秒）
   * - 当没有组件订阅该查询后，缓存仍保留 gcTime，超时后会被清理以释放内存
   * - 值越大：页面来回切换时更可能复用缓存（更快的回退体验）
   * - 值越小：内存占用更低，但更易触发重新请求
   * - 你当前文件注释标注默认 2s；对于列表页通常建议 5~10min 以提升用户返回体验
   */
  gcTime?: number; // 默认 2s
}

export interface UseInfiniteListResult<TItem, TParams> {
  items: TItem[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  error: unknown;
  loadMore: () => Promise<void>;
  reload: () => Promise<void>;
  reset: () => void;
  setParams: (params: TParams) => void;
  params: TParams;
  setPageSize: (size: number) => void;
}

/**
 * 基于 TanStack useInfiniteQuery 的通用无限加载 hooks
 * - 自动处理并发取消、缓存、hasMore 判定
 * - 分页: page 从 1 开始，pageSize 默认 24
 * - 当 total 存在时，用已加载总数与 total 比较计算 hasMore；否则用“是否达到 pageSize”判断
 */
export function useInfiniteList<TItem, TParams = any>(
  options: UseInfiniteListOptions<TItem, TParams>
): UseInfiniteListResult<TItem, TParams> {
  const {
    fetchPage,
    initialParams,
    pageSize: initialPageSize = 24,
    queryKeyPrefix = 'infinite-list',
    enabled = true,
    staleTime = 0,
    gcTime = 2 * 1000,
  } = options;

  const [params, setParams] = useState<TParams>(initialParams as TParams);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const queryKey = useMemo(
    () => [queryKeyPrefix, params, pageSize],
    [queryKeyPrefix, params, pageSize]
  );

  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey,
    enabled,
    staleTime,
    gcTime,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const res = await fetchPage({ page: pageParam as number, pageSize, params, signal });
      return res; // { list, total }
    },
    getNextPageParam: (lastPage, pages) => {
      const lastListLen = lastPage?.list?.length ?? 0;
      const total = lastPage?.total;

      if (typeof total === 'number') {
        const loaded = pages.reduce((sum, p) => sum + (p?.list?.length ?? 0), 0);
        return loaded < total ? pages.length + 1 : undefined;
      }

      // 无 total 时，若当前页达到 pageSize，认为还有下一页
      return lastListLen >= pageSize ? pages.length + 1 : undefined;
    },
  });

  const items = useMemo(
    () => (query.data?.pages ?? []).flatMap((p) => p?.list ?? []),
    [query.data]
  );
  const loading = query.isFetching || query.isLoading;

  const loadMore = async () => {
    if (!query.hasNextPage || loading) return;
    await query.fetchNextPage();
  };

  const reload = async () => {
    // 清除此 queryKey 的缓存，然后 refetch 第一页
    await queryClient.removeQueries({ queryKey });
    await query.refetch();
  };

  const reset = () => {
    queryClient.removeQueries({ queryKey });
  };

  return {
    items,
    loading,
    hasMore: !!query.hasNextPage,
    page: (query.data?.pages?.length ?? 0) + 1,
    error: query.error,
    loadMore,
    reload,
    reset,
    setParams,
    params,
    setPageSize,
  };
}

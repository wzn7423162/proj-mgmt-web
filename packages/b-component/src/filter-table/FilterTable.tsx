import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { ProTable } from '@ant-design/pro-components';
import type {
  ProColumns,
  ActionType,
  ListToolBarProps,
  ProTableProps,
} from '@ant-design/pro-components';
import classNames from 'classnames';
import styles from './FilterTable.module.scss';
import { Grid } from 'antd';

/**
 * Custom hook to check for media query match.
 * This is used to create custom breakpoints not supported by Ant Design's useBreakpoint.
 * @param query The media query string (e.g., '(min-width: 2200px)')
 * @returns boolean indicating if the query matches
 */
const useMediaQuery = (query: string): boolean => {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen for changes
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export interface FilterTableProps<T = any> extends ProTableProps<T, any> {
  /**
   * 表格列配置
   */
  columns: ProColumns<T>[];
  /**
   * 数据请求函数
   */
  request?: (params: any) => Promise<{
    list: T[];
    total: number;
  }>;
  /**
   * 额外的请求参数
   */
  extraParams?: Record<string, any>;
  /**
   * 筛选项变更回调
   */
  onFilterChange?: (filters: Record<string, any>) => void;
  /**
   * 表格排序变更回调
   */
  onSortChange?: (sorter: Record<string, any>) => void;
  /**
   * 是否显示搜索表单
   * @default false
   */
  showSearch?: boolean;
  /**
   * 是否显示工具栏
   * @default true
   */
  showToolbar?: boolean;
  /**
   * 是否显示表格设置
   * @default false
   */
  showSetting?: boolean;
  /**
   * 额外的表格属性
   */
  tableProps?: Record<string, any>;
  /**
   * 自定义样式类
   */
  className?: string;
  /**
   * 表格行唯一标识字段
   * @default 'id'
   */
  rowKey?: string;
  /**
   * 搜索配置
   */
  searchConfig?: Record<string, any>;

  borderlessTable?: boolean;
}

export interface FilterTableRef {
  /**
   * 重新加载表格数据
   */
  reload: () => void;
  /**
   * 重置表格筛选条件和排序并刷新
   */
  reset: () => void;
  /**
   * 获取表格实例
   */
  getTable: () => ActionType | undefined;

  getParams: () => Record<string, any>;
}

/**
 * 带筛选功能的表格组件
 */
export const FilterTable = forwardRef<FilterTableRef, FilterTableProps>((props, ref) => {
  const {
    columns = [],
    request,
    extraParams = {},
    onFilterChange,
    onSortChange,
    showSearch = false,
    showToolbar = true,
    showSetting = false,
    tableProps = {},
    className,
    rowKey = 'id',
    searchConfig,
    borderlessTable = true,
    ...otherProps
  } = props;

  const actionRef = useRef<ActionType>();
  const apiParamsRef = useRef<Record<string, any>>({});
  const isXXXL = useMediaQuery('(min-width: 2000px)');
  const screens = Grid.useBreakpoint();
  const span = useMemo(() => {
    // For screens wider than 2200px, show 6 items per row (span=4)
    if (isXXXL) {
      return 4;
    }
    // 在超大屏上（>=1600px），span 为 6，一行恰好放下4项
    if (screens.xxl) {
      return 6;
    }
    // 在大屏上（>=992px），span 为 6，一行恰好放下4项
    if (screens.lg) {
      return 8;
    }
    if (screens.md) {
      return 12;
    }
    if (screens.sm) {
      return 12;
    }
    return 24;
  }, [isXXXL, screens]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    reload: () => {
      if (actionRef.current) {
        actionRef.current.reload?.();
      }
    },
    reset: () => {
      if (actionRef.current) {
        actionRef.current.reset?.();
      }
    },
    getTable: () => actionRef.current,

    getParams: () => {
      return apiParamsRef.current;
    },
  }));

  // 处理请求参数
  const handleRequest = async (params: any, sorter: any, filter: any) => {
    // 构建API请求参数
    const { current, pageSize, ...rest } = params;

    console.log('params', params);
    console.log('sorter', sorter);
    console.log('filter', filter);

    const sorterParams: any = {};

    if (sorter && Object.keys(sorter).length > 0) {
      sorterParams.orderByColumn = Object.keys(sorter)[0];
      sorterParams.isAsc = Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc';
    }

    const apiParams = {
      pageNum: current,
      pageSize,
      ...rest,
      ...extraParams,
      ...sorterParams,
      ...filter,
    };

    apiParamsRef.current = apiParams;

    try {
      const result = await request?.(apiParams)!;
      console.log('result', result, result.list);
      return {
        data: result.list || [],
        success: true,
        total: result.total || 0,
      };
    } catch (error) {
      console.error('Table data fetch error:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 当extraParams变化时重新加载数据
  // useEffect(() => {
  //   actionRef.current?.reload?.();
  // }, [extraParams]);

  return (
    <div className={classNames(styles.filterTable, className)}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={request ? handleRequest : undefined}
        rowKey={rowKey}
        tableLayout="fixed"
        search={{
          layout: 'inline',
          labelWidth: 'auto',
          optionRender: (_, { form, collapsed }, __) => [],
          defaultCollapsed: true,
          span: span,
        }}
        options={showSetting ? { setting: true } : false}
        toolbar={showToolbar ? ({} as ListToolBarProps) : undefined}
        params={extraParams}
        // toolBarRender={() => {
        //   return [(
        //     <div style={{ height: '4px' }}>
        //     </div>
        //   )];
        // }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        className={classNames({
          [styles.borderlessTable]: borderlessTable,
        })}
        bordered={false}
        {...otherProps}
      />
    </div>
  );
});

// 导出时添加显示名称，方便调试
FilterTable.displayName = 'FilterTable';

export default FilterTable;

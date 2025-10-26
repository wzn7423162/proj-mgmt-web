import { reqClient } from '@llama-fa/utils';
import { saveAs } from 'file-saver';
import { RefObject } from 'react';

interface ExportOptions {
  url: string;
  filenamePrefix: string;
  source?: string;
  extraParams?: Record<string, any>;
  tableRef?: RefObject<any>;
}

export const useExport = () => {
  const handleExport = async ({
    url,
    filenamePrefix,
    source,
    extraParams = {},
    tableRef,
  }: ExportOptions) => {
    try {
      // 获取表格参数（如果提供了tableRef）
      let tableParams = {};
      if (tableRef?.current?.getParams) {
        tableParams = tableRef.current.getParams();
      }

      // 构建导出参数
      const exportParams: Record<string, any> = {
        ...extraParams,
        ...tableParams,
      };

      // 如果有source参数则添加
      if (source !== undefined) {
        exportParams.source = source;
      }

      // 过滤掉undefined值
      const filteredParams = Object.fromEntries(
        Object.entries(exportParams).filter(([_, v]) => v !== undefined)
      );

      // 发起导出请求
      const response = await reqClient.get(url, {
        params: filteredParams,
        responseType: 'blob',
        headers: {
          'x-response-intact': true,
        },
      });

      // 生成文件名
      const now = new Date();
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
      const filename = `${filenamePrefix}_${timestamp}.xlsx`;

      // 下载文件
      saveAs(response.data, filename);

      return { success: true };
    } catch (error) {
      console.error('导出失败:', error);
      return { success: false, error };
    }
  };

  return { handleExport };
};

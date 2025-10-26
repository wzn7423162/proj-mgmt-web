import { AuthUtils, generateHashId } from '@llama-fa/utils';
import { Button, Upload, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { CustomUploadFile } from './types';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
// Build upload URL relative to current origin; adjust if proxy/base path differs
const getInferURL = (path: string) => path;
import { useGetState } from 'ahooks';

export interface IUploadImageProps<ValueType> extends Omit<UploadProps, 'onChange' | 'value'> {
  id?: string;
  value?: ValueType;
  onChange?: (value: CustomUploadFile[]) => void;
}

export const UploadImage = React.memo(
  <ValueType,>({
    className,
    id,
    value,
    onChange,
    fileList: fileListInit,
    children,
    maxCount,
    accept = ".png,.jpg,.jpeg,.bmp,.gif,.webp",
    ...otherProps
  }: IUploadImageProps<ValueType>) => {
    const token = AuthUtils.getToken();

    const uploadApiUrl = getInferURL('/front/upload/img');
    const [fileList, setFileList, getFileList] = useGetState<CustomUploadFile[]>([]);

    useEffect(() => {
      if (!fileListInit?.length && !getFileList()?.length) return;

      setFileList(fileListInit || []);
    }, [fileListInit]);

    useEffect(() => {
      if (typeof value == 'string') {
        setFileList([
          {
            url: value,
            uid: generateHashId(),
            name: value,
          },
        ]);
      }
    }, [value]);

    useEffect(() => {
      onChange?.(fileList);
    }, [fileList]);

    const handleChangeUpload: UploadProps['onChange'] = useCallback((info: any) => {
      const { file, fileList: newFileList } = info;
      const { status, response } = file;

      // 基于Ant Design Upload组件的fileList进行更新，保留已有文件
      const updatedFileList = [...newFileList].map((item) => {
        if (item.uid === file.uid) {
          // 处理当前文件
          if (status === 'done' && response?.data?.id) {
            // 上传完成，更新文件信息
            return {
              ...item,
              uid: response.data.id || item.uid,
              url: response.data.fullPath || item.url,
              fileId: response.data.id || item.fileId,
            };
          }
        }
        return item;
      });

      // 根据不同状态进行处理
      switch (status) {
        case 'uploading':
          // 上传中，使用antd提供的fileList
          setFileList(updatedFileList);
          break;

        case 'done':
          if (response?.code === 1001) {
            // 上传成功，更新文件列表
            setFileList(updatedFileList);
          } else {
            // 上传成功但返回错误
            message.error(`${file.name} 上传失败: ${response?.message || '服务器错误'}`);
            // 移除失败的文件
            setFileList(updatedFileList.filter((item) => item.uid !== file.uid));
          }
          break;
        case 'error':
          // 上传错误
          message.error(`${file.name} 上传失败`);
          // 移除失败的文件
          setFileList(updatedFileList.filter((item) => item.uid !== file.uid));
          break;

        case 'removed':
          // 文件被移除
          setFileList(updatedFileList);

          break;

        default:
          // 其他状态，直接使用antd提供的fileList
          setFileList(updatedFileList);
          break;
      }
    }, []);

    return (
      <Upload
        {...otherProps}
        fileList={fileList}
        action={uploadApiUrl}
        maxCount={maxCount}
        name="file"
        headers={{
          FrontToken: `Bearer ${token}`,
        }}
        onChange={handleChangeUpload}
      >
        {maxCount && fileList.length >= maxCount
          ? null
          : children || <Button icon={<PlusOutlined />}>点击上传</Button>}
      </Upload>
    );
  }
);

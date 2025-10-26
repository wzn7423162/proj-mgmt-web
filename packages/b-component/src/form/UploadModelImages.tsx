import { Button, Checkbox, Flex, Form, Image, Input, InputNumber, Upload } from 'antd';
import { CustomUploadFile, UploadImage } from '@llama-fa/component';
import { IUploadModelImagesItemConf, IUploadModelImagesProps } from './def';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { UploadModelImagesItem } from './UploadModelImagesItem';

// 上传多张图片并设置图片模型参数
export const UploadModelImages = React.memo<IUploadModelImagesProps>(
  ({ id, value, onChange, maxCount = 4 }) => {
    const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
    const [initFileList, setInitFileList] = useState<CustomUploadFile[]>([]);
    // 当外部value变化时更新文件列表
    useEffect(() => {
      if (value) {
        const newFileList = value.map((item) => ({
          uid: item.fileId,
          name: `image_${item.fileId}`, // 添加必需的name属性
          url: item.imageUrl || '',
          status: 'done' as const,
          isConfig: item.isConfig || 0,
          prompt: item.prompt,
          guidanceScale: item.guidanceScale,
          step: item.step,
          seed: item.seed,
          fileId: item.fileId,
          type: 'image',
        }));
        setFileList(newFileList);
        setInitFileList(newFileList);
      }
    }, []);

    // 处理文件移除
    const handleRemove = useCallback(
      (removedFile: IUploadModelImagesItemConf) => {
        // 更新外部value
        const newValue = value?.filter((item) => item.fileId !== removedFile.fileId) || [];
        onChange?.(newValue);

        // 同时更新内部fileList以确保UI立即更新
        setFileList((prevList) => prevList.filter((item) => item.fileId !== removedFile.fileId));
        setInitFileList(fileList.filter((item) => item.fileId !== removedFile.fileId));
      },
      [value]
    );

    return (
      <Form.Item
        name={id}
        valuePropName="value"
        getValueFromEvent={(e) => e}
        rules={[
          {
            validator: (_, value) => {
              // 确保value是数组
              const items = Array.isArray(value) ? value : [];

              // 只检查启用配置的项
              const configItems = items.filter((item) => item && item.isConfig);

              // 检查每个配置项的必填字段
              for (const item of configItems) {
                if (!item.prompt || !item.prompt.trim()) {
                  return Promise.reject('请为所有选中的图片填写提示词');
                }
              }

              // 验证通过
              return Promise.resolve();
            },
          },
        ]}
      >
        <UploadImage
          fileList={initFileList}
          onChange={(info) => {
            // 更新文件列表
            setFileList(info);
            onChange?.(
              info.map((item) => ({
                isConfig: 0,
                prompt: '',
                guidanceScale: 0,
                step: 0,
                seed: 0,
                imageSize: '',
                type: item.type || 'image',
                fileId: item.fileId || '',
                imageUrl: item.url || '',
              }))
            );
          }}
          maxCount={maxCount}
          multiple
          itemRender={(_, file) => (
            <UploadModelImagesItem
              file={file}
              onRemove={handleRemove}
              onChange={(conf: IUploadModelImagesItemConf) => {
                if (value) {
                  const newValue = [...value]; // 创建副本以避免直接修改
                  const index = newValue.findIndex((v) => v.fileId === conf.fileId);
                  if (index > -1) {
                    newValue[index] = {
                      ...newValue[index],
                      ...conf,
                    };
                  } else {
                    newValue.push({
                      ...conf,
                    });
                  }
                  onChange?.(newValue);
                } else {
                  onChange?.([conf]);
                }
              }}
            />
          )}
        >
          <Button icon={<PlusOutlined />}>点击上传</Button>
        </UploadImage>
      </Form.Item>
    );
  }
);

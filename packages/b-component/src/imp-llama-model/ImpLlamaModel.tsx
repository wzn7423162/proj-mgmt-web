import {
  ProForm,
  ProFormCheckbox,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message, Tooltip, Flex } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';
import React, { useMemo, useState, useEffect } from 'react';

import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './ImpLlamaModel.module.scss';
import { reqClient } from '@llama-fa/utils';
import { useMemoizedFn } from 'ahooks';
import { fileManageFilesTree } from '@llama-fa/core/api/files';
import { getLoraBaseModelList, modelBaseTuneListAPI, getModelFinetuneDetail, getModelEvaluateDetail, saveLoraMappingByOnline } from '@llama-fa/core/api/finetune';
import { dictTypeListAPI } from '@llama-fa/core/api/publicData';
import { useLocation } from 'react-router';
import { ESceneType } from '@llama-fa/types';
import { LTitle } from '@/title/Title';
import { LLAMA_FAC_ONLINE_TEXT } from '@llama-fa/constants';



const MODEL_TYPE_LIST = [
  { label: 'LoRA', value: 'lora' },
];


const SCENE_OPTIONS = [
  { label: '文本生成', value: ESceneType.text },
  // { label: '文生图', value: 'TEXT_TO_IMAGE' },
];

export interface ImpLlamaModelFormData {
  finetuneTask?: string;
  useCheckpoint?: boolean;
  checkPoint?: string;
  modelName?: string;
  modelType?: string;
  baseModel?: string;
  scene?: string;
  inOnline?: boolean;
  tags?: string[];
  customTag?: string;
  trainEpochs?: number;
}

export interface ImpLlamaModelProps {
  /** 是否在 Modal 中使用 */
  inModal?: boolean;
  /** 表单提交成功回调 */
  onSuccess?: (data: ImpLlamaModelFormData) => void;
  /** 表单取消回调 */
  onCancel?: () => void;
  /** 外部提交表单引用（用于外部触发提交） */
  formRef?: React.MutableRefObject<ProFormInstance | undefined>;
  /** 模型ID（可選）：若不傳則從 URL query 中讀取 modelId */
  modelId?: string;
  type?: 'finetune' | 'evaluate';
  modelName?: string;
  inOnline?: boolean;
  taskId?: string;
  taskName?: string;
}

export const ImpLlamaModel: React.FC<ImpLlamaModelProps> = (props) => {
  const { inModal = false, onSuccess, onCancel, formRef, inOnline = true, modelName, modelId, type = 'finetune', taskId, taskName } = props;

  const handleBack = useMemoizedFn(() => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  });

  const pageTitleText = useMemo(() => `导入${LLAMA_FAC_ONLINE_TEXT}模型`, []);

  const [form] = Form.useForm<ImpLlamaModelFormData>();
  const [useCheckpoint, setUseCheckpoint] = useState(false);
  const [baseModelList, setBaseModelList] = useState<{ label: string; value: string; modelType: string }[]>([]);
  const [checkpointList, setCheckpointList] = useState<{ label: string; value: string }[]>([]);
  const [tagList, setTagList] = useState<{ label: string; value: string }[]>([]);
  const [finetuneTaskList, setFinetuneTaskList] = useState<{ label: string; value: string; modelSourcePath: string }[]>([]);
  const [modelFinetuneDetail, setModelFinetuneDetail] = useState<any>({});
  const baseModel = Form.useWatch('baseModel', form);
  const finetuneTask = Form.useWatch('finetuneTask', form);


  const onLineUniqueModelList = useMemo(() => {
    if (type === 'evaluate') {
      return [
        { label: taskName, value: taskId },
      ]
    }
    return [
      { label: modelName, value: modelId },
    ]
  }, [inOnline])

  console.log('onLineUniqueModelList', inOnline, onLineUniqueModelList, finetuneTaskList);

  // 监听 checkbox 变化
  const handleCheckpointCheckChange = useMemoizedFn((e: any) => {
    const checked = e.target.checked;
    setUseCheckpoint(checked);
    if (!checked) {
      form.setFieldValue('checkPoint', undefined);
    }
  });

  // 处理标签选择逻辑由 ProFormSelect 自行维护


  useEffect(() => {
    dictTypeListAPI('check_point').then((res) => {
      if (res?.length > 0) {
        setCheckpointList(res.map((item: any) => ({ label: item.dictLabel, value: item.dictValue })));
      }
    });
    dictTypeListAPI('model_text_label').then((res) => {
      if (res?.length > 0) {
        setTagList(res.map((item: any) => ({ label: item.dictLabel, value: item.dictValue })));
      }
    });

    if (!inOnline) {
      modelBaseTuneListAPI({ pageNum: 1, pageSize: 1000, tuneType: 'lora', isInfer: 1 }).then((res: any) => {
        if (res?.list?.length > 0) {
          setFinetuneTaskList(
            res.list.map((item: any) => ({ label: item.taskName, value: item.taskId, modelSourcePath: item.modelSourcePath }))
          );
        }
        if (modelId) {
          form.setFieldValue('finetuneTask', res.list.find((item: any) => item.id === modelId)?.id || '');
        }
      });
    }

  }, []);

  // 解析 configJson（兼容字符串/对象/为空）
  const parsedConfig = useMemo(() => {
    const raw = (modelFinetuneDetail as any)?.configJson;
    try {
      if (!raw) return {} as any;
      if (typeof raw === 'string') return JSON.parse(raw);
      if (typeof raw === 'object') return raw as any;
      return {} as any;
    } catch {
      return {} as any;
    }
  }, [modelFinetuneDetail?.configJson]);

  const defaultImg = [
    'https://s1.llamafactory.online/infer/business/files/0da85370143246799721079639078315.png',
    'https://s1.llamafactory.online/infer/business/files/f7c8322d9da840ab84c50360dd575cfb.png',
    'https://s1.llamafactory.online/infer/business/files/dbef81cd77a34bd78c804811a6a88480.png',
  ]
  // 表单提交
  const handleFinish = useMemoizedFn(async (values: ImpLlamaModelFormData) => {
    try {
      // 組裝提交參數
      const payload = {
        modelImage: defaultImg[Math.floor(Math.random()*defaultImg.length)],  // 使用默认图片
        name: values.modelName as string,
        baseModel: modelFinetuneDetail?.baseModelSourcePath,
        baseModelId: modelFinetuneDetail?.inferBaseModelId,
        baseModelSourcePath: modelFinetuneDetail?.baseModelSourcePath,
        modelSourcePath: modelFinetuneDetail?.modelSourcePath,
        modelId: modelFinetuneDetail?.modelId,
        modelName: modelFinetuneDetail?.templateName,
        scene: SCENE_OPTIONS[0].value,
        releasedStatus: 0,  //online都是已发布
        modelType: values.modelType,
        label: Array.isArray(values.tags) && values.tags.length > 0 ? JSON.stringify(values.tags) : undefined,
        trainingCount: inOnline
          ? (parsedConfig?.num_train_epochs ?? parsedConfig?.trainEpochs ?? values.trainEpochs)
          : values.trainEpochs,
        checkPoint: values.checkPoint,
      } as any;
      // 透過微調任務Id查詢詳情以獲取 modelSourcePath
      if (modelId) {
        payload.modelSourcePath = modelFinetuneDetail?.modelSourcePath || '';
      } else {
        payload.modelSourcePath = finetuneTaskList.find((item) => item.value === values.finetuneTask)?.modelSourcePath || '';
      }

      if (!payload.modelSourcePath) {
        message.error('未找到模型文件来源路径');
        return false;
      }

      await saveLoraMappingByOnline(payload);

      message.success('模型导入成功');
      onSuccess?.(payload);
      return true;
    } catch (error: any) {
      return false;
    }
  });

  // 模型名称校验
  const validateModelName = useMemoizedFn(async (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入模型名称'));
    }
    if (value.length > 60) {
      return Promise.reject(new Error('模型名称不能超过60个字符'));
    }
    // TODO: 实际项目中这里应该调用接口检查重复
    // 这里模拟重复检查
    if (value === '已存在的模型名称') {
      return Promise.reject(new Error('模型名称重复，请重新输入'));
    }
    return Promise.resolve();
  });

  useEffect(() => {
    if (type === 'evaluate') {
      if (taskId) {
        form.setFieldValue('finetuneTask', taskId || '');
      }
    }
    if (type === 'finetune') {
      if (modelId) {
        form.setFieldValue('finetuneTask', modelId || '');
      }
    }

  }, [modelId, taskId]);

  useEffect(() => {
    if (finetuneTask) {
      console.log('taskId', taskId);
      getModelFinetuneDetail(type === 'finetune' ? finetuneTask : taskId as string).then((res) => {
        setModelFinetuneDetail(res);
        setBaseModelList([{ label: res.baseModelSourcePath, value: res.baseModelSourcePath, modelType: res.modelType }]);
        form.setFieldValue('baseModel', res.baseModelSourcePath);
      });
    } else {
      form.setFieldValue('checkPoint', undefined);
    }
  }, [finetuneTask]);

  useEffect(() => {
    if (baseModel) {
      const currentBaseModel = baseModelList.find((item) => item.value === baseModel);
      form.setFieldValue('scene', currentBaseModel?.modelType);
    }
  }, [baseModel]);

  const validateFinetuneTask = useMemoizedFn(async (_: any, value: string) => {
      if (!value) {
        return Promise.reject(new Error('请选择微调任务'));
      }
      return Promise.resolve();
    });

    return (
      <div className={styles['imp-llama-model-container']}>
        {!inModal && (
          <div className={styles['header']}>
            <div className={styles['back']} onClick={handleBack}>
              <LeftOutlined className={styles['back-icon']} />
              <span>返回</span>
            </div>
            <LTitle className={styles['title']} bold size="large" title={pageTitleText} colorInherit />
          </div>
        )}
        <div className={styles['imp-llama-model']} onClick={(e) => e.stopPropagation()} style={{ paddingBottom: inModal ? 0 : 20 }}>

      <ProForm<ImpLlamaModelFormData>
        form={form}
        formRef={formRef as any}
        layout="vertical"
        submitter={
          inModal
            ? false
            : {
              searchConfig: {
                submitText: '确定',
              },
              render: (props: any, dom: any[]) => {
                const submit = dom?.[1];
                if (!submit) return [];
                const btn = React.cloneElement(submit, { style: { width: 316, backgroundImage: 'linear-gradient(-64deg, #916BFD 0%, #2A69FF 90%)' } });
                return [
                  <div key="submit-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
                    {btn}
                  </div>,
                ];
              },
            }
        }
        onFinish={handleFinish}
        initialValues={{
          modelType: 'lora',
          scene: ESceneType.text
        }}
      >
        <Flex align="flex-start" justify="center">
          <div className={styles['form-container']}>
            <ProFormSelect
              name="finetuneTask"
              label={
                <span>
                  请选择模型 <span className={styles['required-star']}>*</span>
                </span>
              }
              placeholder="请搜索并选择模型"
              options={inOnline ? onLineUniqueModelList : finetuneTaskList.length ? finetuneTaskList as any : []}
              rules={[{ validator: validateFinetuneTask }]}
              disabled={!!modelId}
              extra={
                <span className={styles['error-tip']}>仅支持Lora模型</span>
              }
            />

            {/* <div className={styles['checkpoint-section']}> */}
            <ProFormCheckbox
              name="useCheckpoint"
              formItemProps={{
                style: { marginBottom: useCheckpoint ? 4 : 24 },
              }}
              fieldProps={{
                onChange: handleCheckpointCheckChange,
              }}
              disabled={!finetuneTask}
            >
              <Tooltip title={!finetuneTask ? '请先选择模型' : ''}>
                <span>选择中间checkpoint</span>
              </Tooltip>
            </ProFormCheckbox>

            {useCheckpoint && (
              <ProFormSelect
                name="checkPoint"
                placeholder="请选择checkpoint"
                rules={[{ required: true, message: '请选择checkpoint' }]}
                fieldProps={{
                  showSearch: true,
                }}
                request={async () => {
                  const curModelSourcePath = inOnline
                    ? modelFinetuneDetail?.modelSourcePath!
                    : finetuneTaskList.find((item) => item.value === finetuneTask)?.modelSourcePath!;
                  const res = await fileManageFilesTree(
                    {
                      directory: curModelSourcePath,
                      page_num: 1,
                      page_size: 100,
                    },
                    {
                      queryOptions: {
                        staleTime: 1000 * 3,
                        gcTime: 1000 * 3,
                      },
                    }
                  );
                  if (res?.items?.length > 0) {
                    const options = res.items.filter(
                      (item: any) => item.is_directory == 'true'
                    );
                    return options.map((item: any) => ({
                      label: item.name,
                      value: item.path,
                    }));
                  }
                  return [];
                }}
              />
            )}
            {/* </div> */}

            <ProFormText
              name="modelName"
              label={
                <span>
                  模型名称 <span className={styles['required-star']}>*</span>
                </span>
              }
              placeholder="请输入"
              rules={[{ validator: validateModelName }]}
              fieldProps={{
                maxLength: 60,
                showCount: true,
              }}
            />

            <ProFormSelect
              name="modelType"
              label={
                <span>
                  类型 <span className={styles['required-star']}>*</span>
                </span>
              }
              options={MODEL_TYPE_LIST}
              disabled
            />

            <ProFormSelect
              name="baseModel"
              label={
                <span>
                  基础模型 <span className={styles['required-star']}>*</span>
                </span>
              }
              options={baseModelList}
              disabled
            />

            <ProFormRadio.Group
              name="scene"
              label={
                <span>
                  场景 <span className={styles['required-star']}>*</span>{' '}
                  <Tooltip title="场景根据基础模型场景自动选择">
                    <QuestionCircleOutlined className={styles['question-icon']} />
                  </Tooltip>
                </span>
              }
              fieldProps={{
                value: SCENE_OPTIONS[0].value,
              }}
              options={SCENE_OPTIONS}
              disabled
            />

            {!inOnline && (
              <ProFormSelect
                name="tags"
                label="标签"
                placeholder="下拉选择或手动输入标签"
                mode="multiple"
                options={tagList}
                fieldProps={{
                  maxTagCount: 'responsive',
                  showSearch: true,
                  optionFilterProp: 'label',
                }}
              />
            )}

            {/* {!inOnline && <ProFormDigit
              name="trainEpochs"
              label="训练轮数"
              min={1}
              max={100}
              fieldProps={{
                precision: 0,
                value: parsedConfig?.num_train_epochs ?? parsedConfig?.trainEpochs ?? undefined,
              }}
            />} */}
          </div>
        </Flex>
      </ProForm>
    </div>
      </div>
  );
};


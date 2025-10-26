import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Form, Input, message, ModalProps, Radio, Modal } from 'antd';
import {
  ModalForm,
  ProFormDependency,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import { cxb, toInfer } from '@llama-fa/utils';
import {
  IModelLoraReasoningItem,
  modelBaseTuneListAPI,
  modelLoraReasoningAddAPI,
  fileManageFilesTree,
  modelLoraReasoningListAPI,
  modelLoraReasoningSelectCheckAPI,
} from '@llama-fa/core/api/finetune';
import Style from './ModelNameForm.module.scss';
import {
  ESceneType,
  ModelSceneOptions,
  ModelSourceOptions,
  ModelTypeOptions,
} from '@llama-fa/types';
import { InferPrice } from '../infer-price/InferPrice';
import { Tooltip } from 'antd';
import { InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
const cx = cxb.bind(Style);

interface ModelNameFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  /** 弹框标题 */
  title?: string;
  /** 透传到 Modal 根节点的 className，用于注入局部 CSS 变量 */
  rootClassName?: string;
  // 新增：根据点击卡片回显的模型信息
  isMyModel?: boolean;
  id?: string;
  inOnline?: boolean;
  modelName?: string;
  modelType?: string; // 如：'LoRA'
  modelId?: string; // 作为 modelLoraMappingId 传给后端
  modelSource?: 'DEV' | 'ONLINE';
  scene?: ESceneType.text | ESceneType.image;
  modelInfo?: IModelLoraReasoningItem | null;
}
const defaultFormValue: IModelLoraReasoningItem = {
  name: '',
  scene: ESceneType.text,
  modelSource: 'DEV',
  modelType: 'LoRA',
  modelParameter: '',
  described: '',
  modelLoraMappingId: '',
};

// ModelNameForm 组件
export const ModelNameForm: React.FC<ModelNameFormProps> = ({
  open,
  onOpenChange,
  onSuccess,
  title = '创建服务',
  rootClassName,
  isMyModel = false,
  inOnline = false,
  modelName,
  id,
  modelType = 'LoRA',
  modelId,
  scene = ESceneType.text,
  modelSource, // 读取来自父组件的模型来源
  modelInfo,
}) => {
  const modelLoraOnlineOptions = useMemo(
    () =>
      inOnline
        ? [
            {
              name: modelInfo?.taskName,
              id: modelInfo?.modelSourcePath,
            },
          ]
        : [],
    [inOnline, modelInfo]
  );
  const [form] = Form.useForm<IModelLoraReasoningItem>();
  const [modelLoraOptions, setModelLoraOptions] = useState<IModelLoraReasoningItem[]>(
    inOnline ? modelLoraOnlineOptions : []
  );
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // const modelLoraOptions = useRef([])
  const modelSourceWatch = Form.useWatch('modelSource', form);
  const modalProps = useMemo(() => {
    const result: ModalProps = {
      width: 635,
      maskClosable: false,
      centered: true,
      destroyOnHidden: true,
      rootClassName: rootClassName,
    };

    return result;
  }, []);
  useEffect(() => {
    if (open) {
      if (isMyModel) {
        // 打开时使用最新的 props 值进行回填
        form.setFieldsValue({
          scene: scene,
          modelSource, // 使用父组件传入的模型来源
          modelType,
          modelLoraMappingId: modelId,
        });
      }
      if (inOnline && modelInfo) {
        form.setFieldsValue({
          modelLoraMappingId: '',
          modelSource: 'ONLINE',
          scene: ESceneType.text,
          inferBaseModelId: modelInfo.inferBaseModelId,
          checkPoint: modelInfo.checkPoint || '',
          unitPrice: 0.009,
          modelSourcePath: modelInfo.modelSourcePath,
          templateName: modelInfo.templateName,
        });
      }
    }
  }, [open, isMyModel, scene, modelSource, modelType, modelId, inOnline, modelInfo]);

  useEffect(() => {
    if (inOnline && modelInfo && open) {
      form.setFieldsValue({
        modelLoraMappingId: modelInfo.modelSourcePath,
      });
    }
  }, [inOnline, modelInfo, open]);

  useEffect(() => {
    if (!modelSourceWatch) return; // 防止未设置时调用
    if (modelSourceWatch && !inOnline) {
      getModelLoraOptions(modelSourceWatch);
    }
  }, [modelSourceWatch, inOnline]);
  const getModelLoraOptions = async (type: string) => {
    let list = [];
    if (type == 'DEV') {
      const res = await modelLoraReasoningListAPI({ pageNum: 1, pageSize: 999 });
      if (res?.length > 0) {
        list = res.map((item: IModelLoraReasoningItem) => {
          const rawStatus = item?.status;
          const hasStatus = rawStatus !== null && rawStatus !== undefined && rawStatus !== '';
          const statusNum = hasStatus ? Number(rawStatus) : undefined;
          const isDisabled =
            item.releasedStatus === 1 || (item.releasedStatus === 0 && statusNum === 0);
          const tooltipTitle =
            item.releasedStatus === 1
              ? '已发布'
              : item.releasedStatus === 0 && statusNum === 0
                ? '已上线'
                : undefined;
          const labelName = tooltipTitle ? (
            <Tooltip title={tooltipTitle}>{item.name}</Tooltip>
          ) : (
            item.name
          );
          return {
            ...item,
            labelName,
            disabled: isDisabled,
          };
        });
      }
    } else {
      const res = await modelBaseTuneListAPI({
        pageNum: 1,
        pageSize: 999,
        tuneType: 'lora',
        isInfer: 1,
      });
      if (res?.list?.length > 0) {
        list = res.list.map((item: any) => ({
          ...item,
          labelName: item?.taskName,
          disabled: false,
        }));
      }
    }
    setModelLoraOptions(list);
  };

  const handleNameBlur = async (type: string, e: React.FocusEvent<HTMLInputElement>) => {
    console.log('🚀 ~ handleNameBlur ~ type:', type);
    const v = String(e?.target?.value).trim();
    if (!v) return;
    try {
      const params = type === 'name' ? { name: v } : { modelParameter: v };
      const res = await modelLoraReasoningSelectCheckAPI(params);
      const errorMsg = res?.checkName || res?.checkParameter || null;
      if (errorMsg) {
        message.error(errorMsg);
        form.setFieldsValue({ name: '' });
      }
    } catch (err) {
      // 吞掉拦截器的 reject（包括取消或非成功码），避免 Uncaught in promise
      console.warn('modelLoraReasoningSelectCheckAPI failed (ignored):', err);
    }
  };
  const onFinish = async (values: IModelLoraReasoningItem) => {
    try {
      // 检查模型参数是否重复
      if (values.modelParameter && values.modelParameter.includes(' ')) {
        message.error('模型参数不能包含空格');
        return false;
      }
      let newValues = { ...values };
      if (values.modelSource == 'ONLINE' || inOnline) {
        if (modelInfo) {
          const onlineVals = {
            modelLoraMappingId: '',
            modelSource: 'ONLINE',
            scene: ESceneType.text,
            inferBaseModelId: modelInfo.inferBaseModelId,
            checkPoint: modelInfo.checkPoint || '',
            unitPrice: 0.009,
            modelSourcePath: modelInfo.modelSourcePath,
            templateName: modelInfo.templateName,
          };
          newValues = { ...values, ...onlineVals };
        } else {
          const curModel = modelLoraOptions.find((item) => item.id === values.modelLoraMappingId);
          if (curModel?.id) {
            newValues.unitPrice = 0.009;
            newValues.inferBaseModelId = curModel.inferBaseModelId;
            newValues.modelSourcePath = curModel?.modelSourcePath || '';
            newValues.templateName = curModel?.templateName || '';
            /** ONLINE模型不传modelLoraMappingId */
            newValues.modelLoraMappingId = '';
          }
        }
      }

      // 调用接口更新任务名称
      await modelLoraReasoningAddAPI(newValues);
      setSuccessModalOpen(true);
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('创建服务失败:', error);
      return false;
    }
  };

  return (
    <>
      <ModalForm
        title={title}
        open={open}
        form={form}
        clearOnDestroy
        modalProps={modalProps}
        onOpenChange={onOpenChange}
        initialValues={defaultFormValue}
        onFinish={onFinish}
        submitter={{
          render: (props, defaultDoms) => {
            return (
              <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <InferPrice />
                <Flex gap={10} className={cx('footer-right')}>
                  {defaultDoms}
                </Flex>
              </Flex>
            );
          },
        }}
      >
        {/* 选择模型来源（非“我的模型”时显示） */}
        {!isMyModel && (
          <>
            <ProForm.Item
              className={cx('p-form-item-horizontal')}
              label="选择模型"
              name="modelSource"
              rules={[{ required: true, message: '请选择模型来源' }]}
              labelCol={{ span: 4 }}
            >
              {!inOnline && (
                <Radio.Group
                  options={ModelSourceOptions}
                  onChange={(e) => {
                    setModelLoraOptions([]);
                    form.setFieldsValue({ modelLoraMappingId: '', scene: ESceneType.text });
                  }}
                />
              )}
            </ProForm.Item>
            {modelSourceWatch == 'ONLINE' && !inOnline && (
              <p className={cx('form-item-tip')}>
                创建服务后模型自动添加至我的模型，仅支持Baicai Infer预置基模型的LoRA模型创建服务
              </p>
            )}
            {/* 非“我的模型”时选择具体模型 */}
            <ProFormSelect
              label=""
              name="modelLoraMappingId"
              placeholder="请搜索并选择模型"
              rules={[{ required: true, message: '请选择模型' }]}
              options={modelLoraOptions}
              onChange={(val) => {
                const mdoelItem = modelLoraOptions.find((item) => item.id === val);
                form.setFieldsValue({
                  scene: mdoelItem?.scene || ESceneType.text,
                  checkPoint: '',
                  useCheckpoint: false,
                });
              }}
              disabled={inOnline}
              fieldProps={{
                fieldNames: {
                  label: 'labelName',
                  value: 'id',
                },
              }}
            />
          </>
        )}

        {!isMyModel && (
          <ProFormDependency name={['modelSource', 'modelLoraMappingId']}>
            {({ modelSource, modelLoraMappingId }) => {
              if (modelSource == 'ONLINE' && modelLoraMappingId) {
                return (
                  <>
                    <ProFormCheckbox label="" name="useCheckpoint">
                      <Tooltip title={modelLoraMappingId ? '' : '请先选择模型'}>
                        <span>选择中间checkpoint</span>
                      </Tooltip>
                    </ProFormCheckbox>
                    <ProFormDependency name={['useCheckpoint']}>
                      {({ useCheckpoint }) => {
                        return useCheckpoint ? (
                          <ProFormSelect
                            label=""
                            name="checkPoint"
                            placeholder="请选择checkpoint"
                            rules={[{ required: !!useCheckpoint, message: '请选择checkpoint' }]}
                            request={async () => {
                              const curModelSourcePath = inOnline
                                ? modelInfo?.modelSourcePath!
                                : modelLoraMappingId
                                  ? modelLoraOptions.find((item) => item.id === modelLoraMappingId)
                                      ?.modelSourcePath!
                                  : '';
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
                                return options.map((item: any) => {
                                  const isDis = item.name === 'GPT-OSS-20B';
                                  return {
                                    label: isDis ? (
                                      <Tooltip title="GPT-OSS-20B微调后的LoRA模型不支持推理">
                                        {item.name}
                                      </Tooltip>
                                    ) : (
                                      item.name
                                    ),
                                    value: item.path,
                                    disabled: isDis,
                                  };
                                });
                              }
                              return [];
                            }}
                          />
                        ) : null;
                      }}
                    </ProFormDependency>
                  </>
                );
              }
              return null;
            }}
          </ProFormDependency>
        )}

        <ProFormSelect
          name="modelType"
          label="模型类型"
          placeholder="请选择模型类型"
          disabled
          options={ModelTypeOptions}
        />
        {!isMyModel && (
          <ProForm.Item
            className={cx('p-form-item-horizontal')}
            label={
              <span>
                场景
                <Tooltip title="此模型的应用场景">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            name="scene"
            rules={[{ required: true, message: '请选择场景' }]}
            labelCol={{ span: 4 }}
          >
            <Radio.Group
              options={modelSourceWatch === 'DEV' ? ModelSceneOptions : ModelSceneOptions.slice(1)}
            />
          </ProForm.Item>
        )}
        {/* 顶部模型信息（“我的模型”回显，不可编辑） */}
        {isMyModel && (
          <ProForm.Item label="模型名称">
            <Input disabled value={modelName || ''} />
          </ProForm.Item>
        )}

        {isMyModel && (
          <>
            {/* 隐藏字段：确保提交时包含最新来源/映射/场景 */}
            <ProFormText name="modelSource" hidden />
            <ProFormText name="modelLoraMappingId" hidden />
            <ProFormText name="scene" hidden />
          </>
        )}

        <ProFormText
          name="modelParameter"
          label="model"
          placeholder="用于服务调用时model参数，请输入英文、数字或“-.”"
          rules={[
            { required: true, message: '请输入model' },
            { max: 30, message: 'model不能超过30个字符' },
            { pattern: /^[a-zA-Z0-9-.]+$/, message: 'model只能包含英文、数字或“-.”' },
          ]}
          fieldProps={{
            maxLength: 30,
            showCount: true,
            onBlur: (e) => handleNameBlur('modelParameter', e),
          }}
        />

        <ProFormText
          name="name"
          label="服务名称"
          placeholder="请输入服务名称"
          rules={[
            { required: true, message: '请输入服务名称' },
            { max: 60, message: '服务名称不能超过60个字符' },
            { pattern: /^[^\/]*$/, message: '不支持“/”' },
          ]}
          fieldProps={{
            maxLength: 60,
            showCount: true,
            onBlur: (e) => handleNameBlur('name', e),
          }}
        />

        <ProFormTextArea
          name="described"
          label="服务描述"
          placeholder="请输入服务描述"
          rules={[{ max: 200, message: '描述不能超过200个字符' }]}
          fieldProps={{
            maxLength: 200,
            showCount: true,
          }}
        />
      </ModalForm>
      <Modal
        title="创建服务"
        open={successModalOpen}
        onCancel={() => setSuccessModalOpen(false)}
        onOk={() => {
          setSuccessModalOpen(false);
          onOpenChange(false);
        }}
        okText="知道了"
        cancelButtonProps={{ style: { display: 'none' } }}
        centered
        width={800}
      >
        <div className={cx('successContent')}>
          <CheckCircleFilled className={cx('successIcon')} />
          <p className={cx('successTitle')}>已在Baicai Infer在线推理创建服务</p>
          <p className={cx('successDescription')}>
            前往
            <a
              onClick={() => {
                setSuccessModalOpen(false);
                toInfer('/onlineInfer');
              }}
            >
              在线推理
            </a>
            查看
          </p>
        </div>
      </Modal>
    </>
  );
};

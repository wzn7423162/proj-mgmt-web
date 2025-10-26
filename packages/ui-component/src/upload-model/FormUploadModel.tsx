// 顶部导入区域
import { Button, Flex, Form, Input, Radio, message } from 'antd';
import MDEditor, { commands } from '@uiw/react-md-editor';
import ProForm, {
  ProFormDependency,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-form';
import React, { useState, useEffect } from 'react';
import { ESceneType } from '@llama-fa/types';
import { FormLicense } from './FormLicense';
import Style from './FormUploadModel.module.scss';
import { UploadImage, UploadModel, UploadModelImages } from '@llama-fa/component';
import { cxb } from '@llama-fa/utils';
import { dictTypeListAPI } from '@llama-fa/core/api';
import { saveLoraMapping, modelLoraMappingCheckNameAPI } from '@llama-fa/core/api/finetune';
import { useLoraBaseModelList } from '@llama-fa/core/hooks';
import { DEFAULT_DESCRIPTION_TEMPLATE } from './templates';
import { createDebouncedTextContentSafeValidator } from './validators/textContentSafe';

const cx = cxb.bind(Style);

interface IFormUploadModelProps {
  sceneInit: string;
  isTypeRlease: boolean;
  initFormValues?: any;

  onSuccess?: () => void;
}
export const FormUploadModel = React.memo<IFormUploadModelProps>(
  ({ sceneInit, isTypeRlease: initIsTypeRelease, initFormValues, onSuccess }) => {
    const [form] = Form.useForm();
    const [scene, setScene] = useState(initFormValues?.scene || sceneInit);
    const { baseModelList, getBaseModelIdByName } = useLoraBaseModelList({ modelType: scene });
    const [baseModel, setBaseModel] = useState(initFormValues?.baseModel || '');
    const [isTypeRlease, setIsTypeRelease] = useState(initIsTypeRelease);
    const [tagList, setTagList] = useState<{ label: string; value: string }[]>([]);
    const [tagListCache, setTagListCache] = useState<Record<string, string>>({});
    const handleSubmit = async () => {
      let values: any;
      try {
        values = await form.validateFields();
      } catch (e) {
        message.error('还有未正确填写的信息');
        return;
      }

      if (scene === ESceneType.text) {
        if (!values.modelImage) {
          return message.error('图片正在上传中，请稍后提交');
        }
      } else {
        const list = values.imageList;
        for (let i = 0, j = list.length; i < j; i++) {
          if (!list[i].imageUrl) {
            return message.error('图片正在上传中，请稍后提交');
          }
        }
      }
      console.log('提交数据', values);
      if (initFormValues?.id) {
        values.id = initFormValues?.id;
        values.modelPath = initFormValues?.modelPath;
      }

      values.isTrigger = values.isTrigger ? 1 : 0; // 转下类型
      values.releasedStatus = isTypeRlease ? 1 : 0; // 如果是发布时传1
      values.baseModelId = getBaseModelIdByName(values.baseModel);
      if (!values.modelImage && values.imageList) {
        values.modelImage = values.imageList[0]?.imageUrl || '';
      }
      if (values.scopeCreative) {
        values.scopeCreative = JSON.stringify(values.scopeCreative);
      }
      if (values.label) {
        values.labelValue = JSON.stringify(values.label.map((v: any) => tagListCache[v]));
        values.label = JSON.stringify(values.label);
      }
      try {
        await saveLoraMapping(values);
      } catch (res) {
        return;
      }
      message.success('操作成功');
      onSuccess?.();
    };
    // 创建并持有内容安全校验器（防抖）
    const textSafeValidatorRef = React.useRef(createDebouncedTextContentSafeValidator());
    useEffect(() => {
      if (initFormValues && Object.keys(initFormValues).length > 0) {
        const normalized = { ...initFormValues };
        // 后端 1/0 转布尔，保证开关显示正确
        if (typeof normalized.isTrigger !== 'undefined') {
          normalized.isTrigger = !!normalized.isTrigger;
        }
        // described 为空或纯空白时，不覆盖默认模板
        if (!normalized.described || !String(normalized.described).trim()) {
          delete normalized.described;
        }
        form.setFieldsValue(normalized);
        if (normalized.releasedStatus == 1) {
          setIsTypeRelease(true);
        }
        normalized.scene && setScene(normalized.scene);
      }
    }, [initFormValues]);

    useEffect(() => {
      if (initFormValues?.baseModel) {
        setBaseModel(initFormValues.baseModel);
        form.setFieldsValue({ baseModel: initFormValues.baseModel });
      }
      if (initFormValues?.scene) {
        setScene(initFormValues.scene);
        form.setFieldsValue({ scene: initFormValues.scene });
      }
    }, [initFormValues?.baseModel, initFormValues?.scene]);

    useEffect(() => {
      const dictType = scene === ESceneType.text ? 'model_text_label' : 'model_image_label';
      dictTypeListAPI(dictType).then((res) => {
        if (res?.length > 0) {
          setTagList(res.map((item: any) => ({ label: item.dictLabel, value: item.dictValue })));
        } else {
          setTagList([]);
        }
      });
    }, [scene]);

    // 组件卸载时销毁校验器，清理定时器等资源
    useEffect(() => {
      return () => {
        textSafeValidatorRef.current.destroy();
      };
    }, []);

    const leftFormRef = React.useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = React.useState<number>(900);

    useEffect(() => {
      const el = leftFormRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect?.width;
        if (w) setLeftWidth(Math.round(w));
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    // 名称失焦后触发校验
const handleNameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  const v = String((e?.target?.value ?? form.getFieldValue('name') ?? '')).trim();
  if (!v) return;
  try {
    const res = await modelLoraMappingCheckNameAPI({ name: v });
    const errorMsg = res?.checkName || res?.checkParameter || null;
    if (errorMsg) {
      message.error(errorMsg);
      form.setFieldsValue({ name: '' });
    }
  } catch (err) {
    // 吞掉拦截器的 reject（包括取消或非成功码），避免 Uncaught in promise
    console.warn('modelLoraMappingCheckNameAPI failed (ignored):', err);
  }
};

    return (
      <ProForm<{}>
        layout="vertical"
        form={form}
        className={Style.formSubmitterCenter}
        initialValues={{
          ...(initFormValues || {}),
          scene: initFormValues?.scene || sceneInit,
          modelType: 'LoRA',
          imageList: initFormValues?.imageList || [],
          // 生图 + 发布 场景下默认开启触发词
          isTrigger:
            typeof initFormValues?.isTrigger !== 'undefined'
              ? !!initFormValues?.isTrigger
              : (initIsTypeRelease && sceneInit === ESceneType.image),
          // 增加默认简介模版（仅在现有值为空或仅空白时启用）
          described: (() => {
            const v = initFormValues?.described;
            return v && String(v).trim() ? v : DEFAULT_DESCRIPTION_TEMPLATE;
          })(),
        }}
        autoFocusFirstInput={false}
        submitter={{
          submitButtonProps: {
            className: 'btn-gradient ' + cx('form_btn'),
            // 覆盖相对定位，使用容器居中，避免抖动
            style: { position: 'static', left: 'auto', transform: 'none', margin: '20px auto' },
          },
          resetButtonProps: { style: { display: 'none' } },
          // 提交区等宽于左侧 form-container，并在其中居中
          render: (props, dom) => (
            <div onClick={handleSubmit} style={{ width: leftWidth, display: 'flex', justifyContent: 'center' }}>
              {dom}
            </div>
          ),
        }}
        // onFinish={handleSubmit}
      >
        <Flex align="flex-start" justify="flex-start">
          <div className={cx('form-container')} ref={leftFormRef}>
            <Form.Item
              label="模型名称"
              name="name"
            >
              <Input maxLength={60} showCount placeholder="请输入模型名称" onBlur={handleNameBlur}/>
            </Form.Item>
            <ProFormSelect
              name="modelType"
              disabled={true}
              label="类型"
              valueEnum={{
                LORA: 'LORA',
              }}
            ></ProFormSelect>
            <Form.Item
              name="scene"
              label="场景"
              rules={[{ required: true, message: '请选择场景' }]}
            >
              <Radio.Group
                onChange={(e) => {
                  const nextScene = e.target.value;
                  const sceneChanged = nextScene !== scene;
                  setScene(nextScene);
                  // 场景变化时清空基础模型和标签
                  if (sceneChanged) {
                    setBaseModel('');
                    form.setFieldsValue({ baseModel: '', label: [] });
                  }
                  // 发布场景：切到生图默认开启触发词；切到文本默认关闭
                  if (initIsTypeRelease) {
                    form.setFieldsValue({ isTrigger: nextScene === ESceneType.image });
                  }
                }}
                value={scene}
              >
                <Radio value={ESceneType.image}>图片生成</Radio>
                <Radio value={ESceneType.text}>文本生成</Radio>
              </Radio.Group>
            </Form.Item>
            <ProFormSelect
              name="baseModel"
              label="基础模型"
              rules={[{ required: true, message: '请选择基础模型' }]}
              onChange={(v: string) => {
                const baseModeItem = baseModelList.find((item) => item.name === v);
                setBaseModel(v);
                if (baseModeItem) {
                  const nextScene = baseModeItem.modelType;
                  const sceneChanged = nextScene !== scene;
                  setScene(nextScene);
                  form.setFieldsValue({ scene: nextScene });
                  // 通过基础模型切换场景时也清空标签
                  if (sceneChanged) {
                    form.setFieldsValue({ label: [] });
                  }
                  // 发布场景下：选到生图模型类型时默认打开触发词
                  if (initIsTypeRelease) {
                    form.setFieldsValue({
                      isTrigger: nextScene === ESceneType.image,
                    });
                  }
                }
              }}
              options={baseModelList.map(({ name }) => ({ label: name, value: name }))}
            ></ProFormSelect>


            {(!isTypeRlease || !initFormValues?.modelPath) && <Form.Item
              name="fileResource"
              label="上传模型"
              rules={
                initFormValues?.modelPath ? [] : [
                  {
                    required: true,
                    validator(rule, value, callback) {
                      if (!baseModel) {
                        callback('请选择基础模型');
                      } else if (!value) {
                        callback('请上传模型文件');
                      } else {
                        callback();
                      }
                    },
                  },
                ]
              }
            >
              <UploadModel
                disabled={!baseModel || !scene}
                baseModel={baseModel}
                scene={scene}
                onError={(e) => {
                  console.log('上传失败', e);
                }}
              />
            </Form.Item>}

            <ProFormSelect
              name="label"
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
            {isTypeRlease && scene == ESceneType.image && (
              <>
                <ProFormSwitch
                  formItemProps={{ layout: 'horizontal' }}
                  label="触发词"
                  name="isTrigger"
                />

                <ProFormDependency name={['isTrigger']}>
                  {(data) => {
                    if (data.isTrigger) {
                      return (
                        <Form.Item
                          label=""
                          name="trigger"
                          // 严格必填校验：空或仅空格均不通过；提交时会红框提示
                          rules={[
                            {
                              validator: (_, value) =>
                                value && String(value).trim()
                                  ? Promise.resolve()
                                  : Promise.reject('请输入触发词'),
                            },
                          ]}
                        >
                          <Input.TextArea rows={4} placeholder="请输入触发词" />
                        </Form.Item>
                      );
                    }
                  }}
                </ProFormDependency>
              </>
            )}

            {/* 训练轮数 */}
            {/* <ProFormDigit
              label="训练轮数"
              name="trainingCount"
              placeholder="请输入训练轮数"
              fieldProps={{
                min: 1,
                max: 100,
              }}
            ></ProFormDigit> */}

            {/* 模型简介：仅发布时显示 */}
            {isTypeRlease && (
              <Form.Item
                label="模型简介"
                name="described"
                className="dark"
                rules={[
                  {
                    required: true,
                    validator: async (_, value) => {
                      const text = String(value || '').trim();
                      if (!text) {
                        return Promise.reject('请输入模型简介');
                      }
                      return textSafeValidatorRef.current.validate(text);
                    },
                  },
                ]}
                extra="按模版填写即可，可修改或删除占位文字；不得包含外链或联系方式。"
              >
                <MDEditor
                  data-color-mode="dark"
                  className={Style.mdEditorFix}
                  // 受控显示：先取表单值，空时回退到默认模板
                  value={form.getFieldValue('described') || DEFAULT_DESCRIPTION_TEMPLATE}
                  onChange={(value) => {
                    form.setFieldValue('described', value || '');
                  }}
                  height={300}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  commands={[
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.hr,
                    commands.title,
                    commands.divider,
                    commands.link,
                    commands.code,
                    commands.codeBlock,
                    commands.comment,
                    commands.divider,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.checkedListCommand,
                  ]}
                />
              </Form.Item>
            )}

            {/* 示例图片：仅发布时显示 */}
            {/* {isTypeRlease && ( */}
              <>
                {scene == ESceneType.image && (
                  <Form.Item
                    label="示例图片"
                    name="imageList"
                    rules={[{ required: true, message: '请上传模型示例图片' }]}
                  >
                    <UploadModelImages
                      id="imageList"
                      onChange={(fileList) => {
                        // console.log('UploadModelImages', fileList)
                      }}
                    />
                  </Form.Item>
                )}
                {scene == ESceneType.text && (
                  <Form.Item
                    label="示例图片"
                    name="modelImage"
                    rules={[{ required: true, message: '请上传模型示例图片' }]}
                  >
                    <UploadImage
                      listType="picture-card"
                      maxCount={1}
                      onChange={(fileList) => {
                        console.log('fileList', fileList);
                        form.setFieldValue('modelImage', fileList[0]?.url);
                      }}
                    >
                      上传图片
                    </UploadImage>
                  </Form.Item>
                )}
              </>
            {/* )} */}
          </div>
          {isTypeRlease && scene == ESceneType.image && (
            <div className={cx('form-container', 'form-container-right')}>
              <FormLicense></FormLicense>
            </div>
          )}
        </Flex>
      </ProForm>
    );
  }
);




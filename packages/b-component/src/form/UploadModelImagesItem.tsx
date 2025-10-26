// UploadModelImagesItem 组件
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Image, Upload, Flex, Checkbox } from 'antd';
import s from './UploadModelImagesItem.module.scss';
import { IUploadModelImagesItemConf } from './def';
import { reqClient } from '@llama-fa/utils';

interface IUploadModelImagesItemProps {
    file: UploadFile;
    initConf?: IUploadModelImagesItemConf;
    onRemove?: (file: IUploadModelImagesItemConf) => void;
    onChange?: (conf: IUploadModelImagesItemConf) => void;
}
export const UploadModelImagesItem = React.memo<IUploadModelImagesItemProps>(({ file, initConf, onRemove, onChange }) => {
    const initFile = file as unknown as IUploadModelImagesItemConf;
    const [conf, setConf] = useState<IUploadModelImagesItemConf>({
        isConfig: initFile.isConfig || 0,
        prompt: initFile.prompt || '',
        guidanceScale: initFile?.guidanceScale || 0.1,
        step: initFile.step || 1,
        seed: initFile.seed || Math.round(Math.random() * 1000000),
        fileId: initFile.fileId || file.uid,
        imageSize: '',
    });

    // 为每个图片项添加独立的错误状态
    const [errors, setErrors] = useState<{ prompt?: string; scale?: string; step?: string; seed?: string }>({});
    // 新增：审核状态
    const [promptUnsafe, setPromptUnsafe] = useState(false);
    const [promptChecking, setPromptChecking] = useState(false);
    const debounceTimerRef = useRef<number | null>(null);

    // 新增：对 prompt 进行内容安全审核（防抖）
    useEffect(() => {
        if (conf.isConfig !== 1) {
            setPromptUnsafe(false);
            return;
        }
        const text = (conf.prompt || '').trim();
        if (!text) {
            // 非必填：空内容不提示错误，也不触发审核
            setPromptUnsafe(false);
            return;
        }

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = window.setTimeout(async () => {
            setPromptChecking(true);
            try {
                // 使用 GET + text 参数；关闭全局错误弹窗，避免覆盖底部提示
                const res = await reqClient.get('/front/textContentSafe', {
                    params: { text },
                    headers: { 'x-response-intact': true },
                    extra: { hideErrorMessage: true },
                });

                const raw = res?.data;
                const payload = raw?.data ?? raw;

                // 优先识别 code=1002 为不合规
                let isSafe = true;
                if (raw?.code === 1002 || payload?.code === 1002) {
                    isSafe = false;
                } else if (typeof payload === 'boolean') {
                    isSafe = payload;
                } else if (typeof payload?.isSafe === 'boolean') {
                    isSafe = payload.isSafe;
                } else if (typeof payload?.safe === 'boolean') {
                    isSafe = payload.safe;
                } else if (typeof payload?.pass === 'boolean') {
                    isSafe = payload.pass;
                }

                setPromptUnsafe(!isSafe);
            } catch (e) {
                // 接口异常不阻塞输入；非必填情况下不显示错误
                setPromptUnsafe(false);
            } finally {
                setPromptChecking(false);
            }
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
        };
    }, [conf.prompt, conf.isConfig]);

    // 验证当前项并更新错误状态
    const validateItem = () => {
        if (!conf.isConfig) {
            setErrors({});
            return true;
        }
        const newErrors: typeof errors = {};
        // if (!conf.prompt || !conf.prompt.trim()) {
        //     newErrors.prompt = '请输入生图提示词';
        // } else
        if (promptUnsafe) {
            newErrors.prompt = 'Prompt存在不合规内容，请重新输入';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        validateItem();
        file && file.status === 'done' && onChange?.(conf);
    }, [conf, file, promptUnsafe]);

    return (
        <div className={s['img-item']}>
            <Button
                icon={<CloseOutlined />}
                type="text"
                className={s['btn_close']}
                onClick={() => onRemove?.(conf)}
            />

            {file.url ? (
                <Image className={s['img']} src={file.url} alt="Uploaded image" />
            ) : (
                <div className={s['img_placeholder']}>{file.percent || 0}%</div>
            )}

            <Flex vertical style={{ flex: 1, marginLeft: 20 }}>
                <Form.Item>
                    <Checkbox
                        checked={conf.isConfig === 1}
                        onChange={(e) => {
                            setConf({
                                ...conf,
                                isConfig: e.target.checked ? 1 : 0,
                            });
                        }}
                    >
                        配置生图信息
                    </Checkbox>
                </Form.Item>

                {conf.isConfig == 1 && (
                    <>
                        <div>
                            <Input.TextArea
                                onChange={(e) => {
                                    setConf({
                                        ...conf,
                                        prompt: e.target.value,
                                    });
                                }}
                                value={conf.prompt}
                                cols={4}
                                placeholder="请输入生图提示词"
                                status={errors.prompt ? 'error' : undefined}
                            />
                            {errors.prompt && (
                                <div className="ant-form-item-explain ant-form-item-explain-error">
                                    {errors.prompt}
                                </div>
                            )}
                        </div>

                        <Flex gap={20} style={{ marginTop: 20 }}>
                            <div style={{ flex: 1 }}>
                                <div>Guidance Scale</div>
                                <InputNumber
                                    onChange={(e) => {
                                        setConf({
                                            ...conf,
                                            guidanceScale: e || 0,
                                        });
                                    }}
                                    value={conf.guidanceScale}
                                    precision={1}
                                    min={0}
                                    max={20}
                                    step={0.1}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div>step</div>
                                <InputNumber
                                    onChange={(e) => {
                                        setConf({
                                            ...conf,
                                            step: e || 0,
                                        });
                                    }}
                                    value={conf.step}
                                    precision={0}
                                    min={0}
                                    max={50}
                                    step={1}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div>seed</div>
                                <InputNumber
                                    onChange={(e) => {
                                        setConf({
                                            ...conf,
                                            seed: e || 0,
                                        });
                                    }}
                                    value={conf.seed}
                                    precision={0}
                                />
                            </div>
                        </Flex>
                    </>
                )}
            </Flex>
        </div>
    );
});
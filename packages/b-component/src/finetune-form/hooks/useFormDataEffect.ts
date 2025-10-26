import { useEffect, useRef } from 'react';

import { EFinetuneMode } from '@llama-fa/types';
import { FormInstance } from 'antd';
import { GPU_COUNT_NAME_KEY } from '@llama-fa/constants';
import { modelTrainCalculato } from '@llama-fa/core/api';

export const useFormDataEffect = (params: {
  baseForm: FormInstance;
  trainingForm: FormInstance;
  extraForm: FormInstance;
  mode: EFinetuneMode;
  selectedModelInfo?: Record<any, any>;
  fullFormData: Record<any, any>;
  setFullFormData: (data: Record<any, any>) => any;
}) => {
  const {
    baseForm,
    trainingForm,
    extraForm,
    mode,
    fullFormData,
    setFullFormData,
    selectedModelInfo,
  } = params;

  const skipComputeGPURef = useRef(false);

  useEffect(() => {
    const { per_device_train_batch_size = 0, gradient_accumulation_steps = 0 } = fullFormData;
    const gpuCount = fullFormData[GPU_COUNT_NAME_KEY];

    const effective_batch_size = per_device_train_batch_size * gradient_accumulation_steps;
    const global_batch_size = effective_batch_size * gpuCount;
    const computeValue = {
      effective_batch_size,
      global_batch_size,
    };

    trainingForm.setFieldsValue(computeValue);
    setFullFormData(computeValue);
  }, [
    fullFormData.per_device_train_batch_size,
    fullFormData.gradient_accumulation_steps,
    fullFormData[GPU_COUNT_NAME_KEY],
    mode,
  ]);

  useEffect(() => {
    if (!selectedModelInfo) return;

    if (skipComputeGPURef.current) {
      skipComputeGPURef.current = false;
      return;
    }

    modelTrainCalculato({
      batch_size: fullFormData.per_device_train_batch_size,
      train_type: fullFormData.finetuning_type,
      model_size_in_billion: selectedModelInfo.modelSizeInBillion,
    }).then((result) => {
      setFullFormData({ [GPU_COUNT_NAME_KEY]: result.gpuNum });
      extraForm.setFieldValue(GPU_COUNT_NAME_KEY, result.gpuNum);
    });
  }, [
    fullFormData.per_device_train_batch_size,
    fullFormData.finetuning_type,
    selectedModelInfo,
    skipComputeGPURef,
  ]);

  return { skipComputeGPURef };
};

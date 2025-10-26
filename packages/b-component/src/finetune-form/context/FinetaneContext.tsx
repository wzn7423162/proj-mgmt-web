import {
  AUTO_CONTINUE_NAME_KEY,
  CMD_AS_VALUE_KEYS,
  FINETUNE_MODEL_NAME_KEY,
  GPU_COUNT_NAME_KEY,
  MAX_CONTINUE_TIMES_NAME_KEY,
  advancedConfigDefaultFormValue,
  advancedConfigMap,
  basicConfigDefaultFormValue,
  basicConfigMap,
  extraFormDefaultValue,
} from '@llama-fa/constants';
import { EFinetuneMode, ETaskMode } from '@llama-fa/types';
import { addModelFinetune, } from '@llama-fa/core/api';
import { getModelFinetuneDetail } from '@llama-fa/core/api/finetune';
import {
  checkFileDataExtendable,
  checkModelAmountEnable,
  validateConfigJson,
} from '../utils/validation';
import { pickValueByLayouts, transStringBoolean } from '../utils/trans';
import { useEffect, useRef, useState } from 'react';

import { ProFormProps } from '@ant-design/pro-components';
import { createPresenter } from '@llama-fa/utils';
import { message } from 'antd';
import { pick } from 'lodash';
import { useBaseModelList } from '@/hooks/useBaseModelList';
import { useEstimatedTime } from '../hooks/useEstimatedTime';
import { useFilesData } from '../hooks/useFilesData';
import { useForm } from 'antd/es/form/Form';
import { useFormDataEffect } from '../hooks/useFormDataEffect';
import { useFormLayout } from '@/hooks/useFormLayout';
import { useFullFormData } from '../hooks/useFullFormData';
import { useMemoizedFn } from 'ahooks';
import { useSyncChatTemplate } from '../hooks/useSyncChatTemplate';

export interface IFinetuneContextProps {
  onStartSuccess?: () => any;
}

const FinetuneContext = (props: IFinetuneContextProps) => {
  const { onStartSuccess } = props;
  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number }>();
  const [baseForm] = useForm();
  const [trainingForm] = useForm();
  const [extraForm] = useForm();

  const [finetuneMode, _setFinetuneMode] = useState(EFinetuneMode.quick);
  const { fullFormData, setFullFormData, buffereSetFullFormData } = useFullFormData();

  const tempModeInfoRef = useRef<{
    trainingFormData: any;
  }>({ trainingFormData: undefined });

  const { selectedModelInfo, restQuery: baseModelQuery } = useBaseModelList({
    selectedModelId: fullFormData[FINETUNE_MODEL_NAME_KEY],
  });
  const { restQuery: filesQuery } = useFilesData();

  const { basicFormLayout, trainingFormLayout } = useFormLayout({
    fullFormData,
    mode: finetuneMode,
    selectedModel: selectedModelInfo,
  });

  useSyncChatTemplate({
    chatTemplate: selectedModelInfo?.chatTemplate,
    trainingForm,
    setFullFormData,
  });

  const { estimatedTime, selectedPrice, taskPriceInfos, setSelectedPrice } = useEstimatedTime({
    selectedModelInfo,
    fullFormData,
    mode: finetuneMode,
    basicFormLayout,
    trainingFormLayout,
  });

  const { skipComputeGPURef } = useFormDataEffect({
    baseForm,
    trainingForm,
    extraForm,
    mode: finetuneMode,
    fullFormData,
    setFullFormData,
    selectedModelInfo,
  });

  const handleBasicFormChange = useMemoizedFn<Required<ProFormProps>['onValuesChange']>(
    (values, allFields) => {
      buffereSetFullFormData(values, allFields);

      Object.entries(values).forEach(([fieldKey, value]) => {});
    }
  );

  const handleTrainingFormChange = useMemoizedFn<Required<ProFormProps>['onValuesChange']>(
    (values, allFields) => {
      buffereSetFullFormData(values, allFields);

      Object.entries(values).forEach(([fieldKey, value]) => {});
    }
  );

  const handleExtraFormChange = useMemoizedFn<Required<ProFormProps>['onValuesChange']>(
    (values, allFields) => {
      buffereSetFullFormData(values, allFields);
    }
  );

  const startTraining = useMemoizedFn(async () => {
    try {
      const extraFormConfig = extraForm.getFieldsValue();
      const basicFormConfig = baseForm.getFieldsValue();
      const { publicData = [], fileData = [] } = basicFormConfig;

      if (!publicData.length && !fileData.length) {
        message.warning('请先选择数据集或文件');
        return;
      }

      if (!selectedModelInfo) {
        message.warning('请选择基础模型');
        return;
      }

      if (!estimatedTime) {
        message.warning('未获取到任务预估时间');
        return;
      }

      if (!selectedPrice) {
        message.warning('请先选择任务模式');
        return;
      }

      if (!selectedPrice.available) {
        message.warning('当前任务模式不可以用，请选择其他模式');
        return;
      }

      const pickBasicFormData = pickValueByLayouts(basicFormLayout, fullFormData);
      const pickTrainingFormData = pickValueByLayouts(trainingFormLayout, fullFormData);
      const formDataByLayout: Record<any, any> = {
        ...pickBasicFormData,
        ...pickTrainingFormData,
      };

      const configJson = {
        ...formDataByLayout,
        [FINETUNE_MODEL_NAME_KEY]: selectedModelInfo.modelName,
        publicData,
        fileData,
      };

      const validResult = validateConfigJson({ configJson, selectedModelInfo });

      if (!validResult.valid) {
        message.error(validResult.errorMessage);
        return;
      }

      await checkModelAmountEnable({
        estimatedPrice: estimatedPrice?.max || 0,
      });

      let maxScheduleCount = 0;
      if (selectedPrice.appMode === ETaskMode.dynamic && extraFormConfig[AUTO_CONTINUE_NAME_KEY]) {
        maxScheduleCount = extraFormConfig[MAX_CONTINUE_TIMES_NAME_KEY];
      }

      const submitParam = {
        templateId: fullFormData[FINETUNE_MODEL_NAME_KEY],
        estimatedTime: estimatedTime.predict_total_time_sec,
        maxWaitTime: selectedPrice.maxWaitTime,
        minWaitTime: selectedPrice.minWaitTime,
        gpuCount: extraFormConfig[GPU_COUNT_NAME_KEY],
        paramModel: finetuneMode === EFinetuneMode.quick ? 0 : 1,
        predTotalTimeSec: estimatedTime.predict_total_time_sec,
        taskPrice: selectedPrice.discount || 1,
        realUnitPrice: selectedPrice.realUnitPrice,
        appMode: selectedPrice.appMode,
        maxScheduleCount,
        estimatedPrice: estimatedPrice?.max || 0,
        optTarget: selectedPrice?.optTarget,
        // configJson: transBooleanString(configJson),
        configJson,
        configValueAsCmdKeys: CMD_AS_VALUE_KEYS,
      };

      await addModelFinetune(submitParam);
      message.success('添加微调任务成功!');

      onStartSuccess?.();
    } catch (error: any) {
      error?.message && message.error(error?.message);
      console.error(error);
    }
  });

  const setFinetuneMode = useMemoizedFn((modeValue: EFinetuneMode) => {
    const tempTrainingFormData = tempModeInfoRef.current.trainingFormData;

    _setFinetuneMode(modeValue);

    tempModeInfoRef.current.trainingFormData = {
      ...tempModeInfoRef.current.trainingFormData,
      ...pick(trainingForm.getFieldsValue(), Array.from(advancedConfigMap.keys())),
    };

    trainingForm.setFieldsValue(tempTrainingFormData);
    setFullFormData(tempTrainingFormData);
  });

  const resetFormData = useMemoizedFn(async (coverData?: Record<any, any>) => {
    try {
      const mergedData = transStringBoolean({
        ...basicConfigDefaultFormValue,
        ...advancedConfigDefaultFormValue,
        ...extraFormDefaultValue,
        ...coverData,
      });

      // 表单里存储的是id值，但是接口返回的是modelName值，我们需要自己手动match下后赋值
      if (coverData?.[FINETUNE_MODEL_NAME_KEY]) {
        // 等待第一次接口获取模型列表数据
        const modelListData = await baseModelQuery.promise;

        mergedData[FINETUNE_MODEL_NAME_KEY] = modelListData?.list.find(
          (item) => item.modelName === coverData.model_name
        )?.id;

        skipComputeGPURef.current = true;
      }

      const initialBasicFormData = {
        ...pick(mergedData, Array.from(basicConfigMap.keys())),
      };
      const initialTrainingFormData = {
        ...pick(mergedData, Array.from(advancedConfigMap.keys())),
      };
      const initialExtraFormData = {
        ...extraFormDefaultValue,
        ...pick(mergedData, Object.keys(extraFormDefaultValue)),
      };

      baseForm.setFieldsValue(initialBasicFormData);
      trainingForm.setFieldsValue(initialTrainingFormData);
      extraForm.setFieldsValue(initialExtraFormData);

      setFullFormData(mergedData as any);

      return {
        initialBasicFormData,
        initialTrainingFormData,
        initialExtraFormData,
      };
    } catch (error) {
      console.error(error);
    }
  });

  const extendTargetTask = useMemoizedFn(
    async (
      extendFinetuneId: string,
      params: { clearFileData?: boolean } = { clearFileData: false }
    ) => {
      if (!extendFinetuneId) return;

      const { clearFileData } = params;

      try {
        const finetuneData = await getModelFinetuneDetail(extendFinetuneId);
        const configJson = finetuneData.configJson;

        setFinetuneMode(finetuneData.paramModel ?? EFinetuneMode.quick);

        configJson[GPU_COUNT_NAME_KEY] = finetuneData[GPU_COUNT_NAME_KEY];

        if (clearFileData) {
          configJson.fileData = [];
        }

        resetFormData(configJson);
      } catch (error) {
        console.error(error);
      }
    }
  );

  useEffect(() => {
    // 初始化先备份一次全量的数据
    resetFormData().then((result) => {
      if (result) {
        const { initialTrainingFormData } = result;
        tempModeInfoRef.current.trainingFormData = initialTrainingFormData;
      }
    });
  }, []);

  return {
    baseForm,
    trainingForm,
    extraForm,
    handleBasicFormChange,
    handleTrainingFormChange,
    handleExtraFormChange,
    startTraining,
    finetuneMode,
    setFinetuneMode,
    taskPriceInfos,
    selectedPrice,
    setSelectedPrice,
    basicFormLayout,
    trainingFormLayout,
    resetFormData,
    estimatedTime,
    fullFormData,
    selectedModelInfo,
    estimatedPrice,
    setEstimatedPrice,
    extendTargetTask,
  };
};

export const [useFinetunePresenter, FinetuneProvider] = createPresenter<
  ReturnType<typeof FinetuneContext>,
  IFinetuneContextProps
>(FinetuneContext);

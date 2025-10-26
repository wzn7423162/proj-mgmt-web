import {
  AUTO_CONTINUE_NAME_KEY,
  GPU_COUNT_NAME_KEY,
  MAX_CONTINUE_TIMES_NAME_KEY,
  PREDICT_TASK_ID_SCHEMA,
  evaluateConfigDefaultFormValue,
  evaluateConfigMap,
  extraFormDefaultValue,
} from '@llama-fa/constants';
import { ETaskMode, ITuneItem } from '@llama-fa/types';
import {
  checkFileDataExtendable,
  checkModelAmountEnable,
  validateConfigJson,
} from '../utils/validation';
import {
  modelEvaluateAdd,
  modelReasoningCalculator,
} from '@llama-fa/core/api';
import { getModelFinetuneDetail } from '@llama-fa/core/api/finetune';

import { isEmpty, pick } from 'lodash';
import { pickValueByLayouts, transStringBoolean } from '../utils/trans';
import { useEffect, useState } from 'react';

import { ProFormProps } from '@ant-design/pro-components';
import { createPresenter } from '@llama-fa/utils';
import { isBuiltLora } from '../../utils/common';
import { message } from 'antd';
import { useEvaluateLayout } from '../hooks/useEvaluateLayout';
import { useFinetuneList } from '@/hooks/useFinetuneList';
import { useForm } from 'antd/es/form/Form';
import { useFullFormData } from '../hooks/useFullFormData';
import { useMemoizedFn } from 'ahooks';
import { useModelEstimatedInferenceTime } from '../hooks/useModelEstimatedInferenceTime';
import { useSyncChatTemplate } from '../hooks/useSyncChatTemplate';

export interface IEvaluateContextProps {
  onStartSuccess?: () => any;
}

const EvaluateContext = (props: IEvaluateContextProps) => {
  const { onStartSuccess } = props;

  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number }>();

  const [baseForm] = useForm();
  const [trainingForm] = useForm();
  const [extraForm] = useForm();

  const { fullFormData, setFullFormData, buffereSetFullFormData } = useFullFormData();

  const { selectedFinetuneTask, restQuery: finetuneListQuery } = useFinetuneList({ fullFormData });

  const { estimatedTime, selectedPrice, taskPriceInfos, setSelectedPrice } =
    useModelEstimatedInferenceTime({
      selectedFinetuneTask,
      fullFormData,
      tuneItem: selectedFinetuneTask,
    });

  const { evaluateLayout } = useEvaluateLayout({ fullFormData, selectedFinetuneTask });

  useSyncChatTemplate({
    chatTemplate: selectedFinetuneTask?.chatTemplate,
    trainingForm,
    setFullFormData,
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

  const startEvaluate = useMemoizedFn(async () => {
    try {
      const extraFormConfig = extraForm.getFieldsValue();
      const basicFormConfig = baseForm.getFieldsValue();
      const { publicData = [], fileData = [] } = basicFormConfig;

      if (!publicData.length && !fileData.length) {
        message.warning('请先选择数据集或文件');
        return;
      }

      if (!selectedFinetuneTask) {
        message.warning('请先选择微调模型');
        return;
      }

      if (!selectedPrice) {
        message.warning('请先选择任务模式');
        return;
      }

      if (!estimatedTime) {
        message.warning('未获取到任务预估时间');
        return;
      }

      const formDataByLayout = pickValueByLayouts(evaluateLayout, fullFormData);

      const configJson = {
        ...formDataByLayout,
        publicData,
        fileData,
      };

      const validResult = validateConfigJson({ configJson });

      if (!validResult.valid) {
        message.error(validResult.errorMessage);
        return;
      }

      await checkModelAmountEnable({
        estimatedPrice: estimatedPrice?.max || 0,
        tuneType: selectedFinetuneTask.tuneType,
        taskId: selectedFinetuneTask?.taskId,
        mergeModel: selectedFinetuneTask?.mergeModel,
        isBaseModel: selectedFinetuneTask?.isBaseModel,
      });

      let maxScheduleCount = 0;
      if (selectedPrice.appMode === ETaskMode.dynamic && extraFormConfig[AUTO_CONTINUE_NAME_KEY]) {
        maxScheduleCount = extraFormConfig[MAX_CONTINUE_TIMES_NAME_KEY];
      }

      const submitParam = {
        taskId: selectedFinetuneTask?.taskId,
        gpuCount: extraFormConfig[GPU_COUNT_NAME_KEY],
        estimatedTime: estimatedTime.predict_total_time_sec,
        maxWaitTime: selectedPrice.maxWaitTime,
        minWaitTime: selectedPrice.minWaitTime,
        taskPrice: selectedPrice.discount || '1',
        realUnitPrice: selectedPrice.realUnitPrice,
        appMode: selectedPrice.appMode,
        predTotalTimeSec: estimatedTime.predict_total_time_sec,
        estimatedPrice: estimatedPrice?.max || 0,
        optTarget: selectedPrice?.optTarget,
        // configJson: transBooleanString(configJson),
        configJson,
        maxScheduleCount,
        mergeModel: selectedFinetuneTask?.mergeModel,
      };

      await modelEvaluateAdd(submitParam);
      message.success('添加评估任务成功!');

      onStartSuccess?.();
    } catch (error: any) {
      error?.message && message.error(error?.message);
      console.error(error);
    }
  });

  const resetFormData = useMemoizedFn(async (coverData?: Record<any, any>) => {
    const mergedData = transStringBoolean({
      ...evaluateConfigDefaultFormValue,
      ...extraFormDefaultValue,
      ...coverData,
    });
    const taskIdKey = PREDICT_TASK_ID_SCHEMA.param_key;
    const coverTaskId = coverData?.[taskIdKey];

    // 表单里存储的是id值，但是接口返回的是modelName值，我们需要自己手动match下后赋值
    if (coverTaskId) {
      // 等待第一次接口获取模型列表数据
      const finetuneListData = await finetuneListQuery.promise;

      const matchFinetuneItem = finetuneListData?.list.find((item) => item.taskId === coverTaskId);
      mergedData[taskIdKey] = matchFinetuneItem?.id;
    }

    const initialBasicFormData = {
      [PREDICT_TASK_ID_SCHEMA.param_key]: mergedData[PREDICT_TASK_ID_SCHEMA.param_key],
    };
    const initialTrainingFormData = {
      ...pick(mergedData, Array.from(evaluateConfigMap.keys())),
    };
    const initialExtraFormData = { ...extraFormDefaultValue };

    baseForm.setFieldsValue(initialBasicFormData);
    trainingForm.setFieldsValue(initialTrainingFormData);
    extraForm.setFieldsValue(initialExtraFormData);

    setFullFormData(mergedData as any);

    return {
      initialBasicFormData,
      initialTrainingFormData,
      initialExtraFormData,
    };
  });

  useEffect(() => {
    resetFormData();
  }, []);

  useEffect(() => {
    if (!selectedFinetuneTask) return;

    modelReasoningCalculator({
      model_size_in_billion: selectedFinetuneTask.modelSizeInBillion,
    }).then((result) => {
      setFullFormData({ [GPU_COUNT_NAME_KEY]: result.gpuNum });
      extraForm.setFieldValue(GPU_COUNT_NAME_KEY, result.gpuNum);
    });

    getModelFinetuneDetail(selectedFinetuneTask.taskId).then((result) => {
      const injectParams = {};
      result.configJson.rope_scaling &&
        Reflect.set(injectParams, 'rope_scaling', result.configJson.rope_scaling);
      result.configJson.booster && Reflect.set(injectParams, 'booster', result.configJson.booster);

      setFullFormData(injectParams);
      trainingForm.setFieldsValue(injectParams);
    });
  }, [selectedFinetuneTask]);

  return {
    baseForm,
    trainingForm,
    extraForm,
    handleBasicFormChange,
    handleTrainingFormChange,
    handleExtraFormChange,
    startEvaluate,
    taskPriceInfos,
    selectedPrice,
    setSelectedPrice,
    evaluateLayout,
    resetFormData,
    estimatedTime,
    fullFormData,
    isBuiltLora: isBuiltLora(selectedFinetuneTask!),
    estimatedPrice,
    setEstimatedPrice,
    selectedFinetuneTask,
  };
};

export const [useEvaluatePresenter, EvaluateProvider] = createPresenter<
  ReturnType<typeof EvaluateContext>,
  IEvaluateContextProps
>(EvaluateContext);

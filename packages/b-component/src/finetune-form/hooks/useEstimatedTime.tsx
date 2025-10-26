import { EFinetuneMode, ITaskPriceItem, ITrainSchemaItem } from '@llama-fa/types';
import { FINETUNING_TYPE_NAME_KEY, GPU_COUNT_NAME_KEY } from '@llama-fa/constants';
import { IModelEstimatedTimeResult, dynamicPricing, modelEstimatedTime } from '@llama-fa/core/api';
import { findEmptyValueKey, generateHashId } from '@llama-fa/utils';
import { isEmpty, pick } from 'lodash';
import { useDebounceFn, useGetState, useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';

import { estimedTimeFieldsArray } from '../constants/form';
import { pickValueByLayouts } from '../utils/trans';
import { useRef } from 'react';

export const useEstimatedTime = (params: {
  selectedModelInfo: any;
  fullFormData: Record<any, any>;
  mode: EFinetuneMode;
  basicFormLayout: ITrainSchemaItem[];
  trainingFormLayout: ITrainSchemaItem[];
}) => {
  const { selectedModelInfo, fullFormData, mode, basicFormLayout, trainingFormLayout } = params;

  const [estimatedTime, setEstimatedTime] = useState<undefined | IModelEstimatedTimeResult>();
  const [taskPriceInfos, setTaskPriceInfos] = useState<ITaskPriceItem[] | undefined>(undefined);
  const [selectedPrice, setSelectedPrice, getSelectedPrice] = useGetState<
    ITaskPriceItem | undefined
  >();
  const requestFlag = useRef<any>(null);
  const [uniqueFlag] = useState(() => generateHashId());

  const { run: flushModelEstimatedTime } = useDebounceFn(
    async () => {
      setEstimatedTime(undefined);

      const { publicData = [], fileData = [] } = fullFormData;

      if (isEmpty(fullFormData)) return;
      if (!selectedModelInfo) return;
      if (publicData?.length === 0 && fileData?.length === 0) return;

      const pickBasicFormData = pickValueByLayouts(basicFormLayout, fullFormData);
      const pickTrainingFormData = pickValueByLayouts(trainingFormLayout, fullFormData);
      const formDataByLayout: Record<any, any> = {
        ...pickBasicFormData,
        ...pickTrainingFormData,
      };

      const searchParams: Record<any, any> = {
        ...Object.fromEntries(estimedTimeFieldsArray.map((key) => [key, formDataByLayout[key]])),
        model_name_or_path: selectedModelInfo?.modelName,
        model_size_in_billion: selectedModelInfo?.modelSizeInBillion,
        // gpu_type: 'H800',
        booster: fullFormData.booster,
        packing: fullFormData.packing,
        gpu_nums: fullFormData[GPU_COUNT_NAME_KEY],
        public_datasets: publicData,
        private_datasets: fileData,
      };

      try {
        const currentFlag = Symbol();
        requestFlag.current = currentFlag;
        const result = await modelEstimatedTime(searchParams);

        if (requestFlag.current === currentFlag) {
          setEstimatedTime(result);
        }
      } catch (error) {
        console.error(error);
      }
    },
    { wait: 200 }
  );

  const { run: flushDynamicPrice } = useDebounceFn(
    async () => {
      const gpuCount = fullFormData[GPU_COUNT_NAME_KEY];

      if (!gpuCount) return;

      setTaskPriceInfos(undefined);

      try {
        const result = await dynamicPricing({
          gpuCount,
          predTotalTimeSec: estimatedTime?.predict_total_time_sec,
          uniqueFlag,
        });

        setTaskPriceInfos(result);
      } catch (error) {
        console.error(error);
      }
    },
    { wait: 200 }
  );

  useEffect(() => {
    flushDynamicPrice();
  }, [flushDynamicPrice, estimatedTime]);

  useEffect(() => {
    if (!taskPriceInfos) {
      return;
    }

    const curSelectedPrice = getSelectedPrice();

    if (curSelectedPrice) {
      setSelectedPrice(
        taskPriceInfos.find((item) => item.appMode === curSelectedPrice.appMode && !!item.available)
      );
    } else {
      setSelectedPrice(taskPriceInfos[0]);
    }
  }, [taskPriceInfos, getSelectedPrice]);

  useEffect(
    () => {
      flushModelEstimatedTime();
    },
    estimedTimeFieldsArray.map((key) => fullFormData[key]).concat([selectedModelInfo, mode])
  );

  return {
    flushModelEstimatedTime,
    estimatedTime,
    flushDynamicPrice,
    selectedPrice,
    setSelectedPrice,
    taskPriceInfos,
  };
};

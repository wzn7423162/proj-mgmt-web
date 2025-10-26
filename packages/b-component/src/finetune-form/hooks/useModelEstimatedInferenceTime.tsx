import {
  IModelEstimatedTimeResult,
  dynamicPricing,
  modelEstimatedInferenceTime,
  modelEstimatedTime,
} from '@llama-fa/core/api';
import { ITaskPriceItem, ITuneItem } from '@llama-fa/types';
import { findEmptyValueKey, generateHashId } from '@llama-fa/utils';
import { isEmpty, pick } from 'lodash';
import { useDebounceFn, useGetState, useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';

import { GPU_COUNT_NAME_KEY } from '@llama-fa/constants';
import { estimedTimeFieldsArray } from '../constants/form';
import { useRef } from 'react';

export const useModelEstimatedInferenceTime = (params: {
  selectedFinetuneTask: any;
  fullFormData: Record<any, any>;
  tuneItem?: ITuneItem;
}) => {
  const { selectedFinetuneTask, fullFormData, tuneItem } = params;

  const [estimatedTime, setEstimatedTime] = useState<undefined | IModelEstimatedTimeResult>();
  const [taskPriceInfos, setTaskPriceInfos] = useState<ITaskPriceItem[] | undefined>(undefined);
  const [selectedPrice, setSelectedPrice, getSelectedPrice] = useGetState<
    ITaskPriceItem | undefined
  >();
  const requestFlag = useRef<any>(null);
  const [uniqueFlag] = useState(() => generateHashId());

  const { run: flushModelEstimatedInferenceTime } = useDebounceFn(
    async () => {
      setEstimatedTime(undefined);

      const { publicData = [], fileData = [] } = fullFormData;

      if (isEmpty(fullFormData)) return;
      if (!selectedFinetuneTask) return;
      if (publicData?.length === 0 && fileData?.length === 0) return;

      const searchParams: Record<any, any> = {
        ...Object.fromEntries(estimedTimeFieldsArray.map((key) => [key, fullFormData[key]])),
        model_name_or_path: selectedFinetuneTask?.templateName,
        model_size_in_billion: selectedFinetuneTask?.modelSizeInBillion,
        // gpu_type: 'H800',
        gpu_nums: fullFormData[GPU_COUNT_NAME_KEY],
        public_datasets: publicData ?? [],
        private_datasets: fileData ?? [],
      };

      try {
        const currentFlag = Symbol();
        requestFlag.current = currentFlag;
        const result = await modelEstimatedInferenceTime(searchParams);

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
          tuneType: selectedFinetuneTask?.tuneType,
          uniqueFlag,
          isBaseModel: tuneItem?.isBaseModel!,
          mergeModel: tuneItem?.mergeModel,
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
      flushModelEstimatedInferenceTime();
    },
    estimedTimeFieldsArray.map((key) => fullFormData[key]).concat([selectedFinetuneTask])
  );

  return {
    flushModelEstimatedInferenceTime,
    estimatedTime,
    flushDynamicPrice,
    selectedPrice,
    setSelectedPrice,
    taskPriceInfos,
  };
};

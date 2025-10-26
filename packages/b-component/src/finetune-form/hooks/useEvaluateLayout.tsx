import {
  FINETUNE_MODEL_NAME_KEY,
  GPU_COUNT_NAME_KEY,
  PREDICT_BASIC_CONFIG_SCHEMA,
} from '@llama-fa/constants';
import { ILayoutCheckContext, pickValidLayout } from '@/utils/form-layout';
import { ITrainSchemaItem, ITuneItem } from '@llama-fa/types';

import { useMemo } from 'react';
import { useState } from 'react';

export const useEvaluateLayout = (
  params: {
    selectedFinetuneTask?: ITuneItem;
  } & ILayoutCheckContext
) => {
  const { selectedFinetuneTask, fullFormData } = params;

  const evaluateLayout = useMemo(() => {
    let composeFormData = fullFormData;

    if (selectedFinetuneTask) {
      composeFormData = {
        ...composeFormData,
        finetuning_type: selectedFinetuneTask.tuneType,
      };
    }

    return pickValidLayout(PREDICT_BASIC_CONFIG_SCHEMA as unknown as ITrainSchemaItem[], {
      fullFormData: composeFormData,
    });
  }, [selectedFinetuneTask, fullFormData]);

  return { evaluateLayout };
};

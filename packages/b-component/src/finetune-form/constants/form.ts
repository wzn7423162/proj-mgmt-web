import { GPU_COUNT_NAME_KEY, trainingConfigMap } from '@llama-fa/constants';

export const estimedTimeFieldsSet = new Set<string>(['publicData', GPU_COUNT_NAME_KEY, 'fileData']);
trainingConfigMap.forEach((value) => {
  if (value.is_estimator) {
    estimedTimeFieldsSet.add(value.param_key);
  }
});

export const estimedTimeFieldsArray = Array.from(estimedTimeFieldsSet);

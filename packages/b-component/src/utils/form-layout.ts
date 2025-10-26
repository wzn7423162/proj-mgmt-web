import {
  EDependencyAction,
  EDependencyOprator,
  EGroupKey,
  ITrainSchemaItem,
} from '@llama-fa/types';

import { IModelBaseInfo } from '@llama-fa/core/api';
import { trainingConfigMap } from '@llama-fa/constants';

export interface ILayoutCheckContext {
  fullFormData: Record<any, any>;
  selectedModel?: IModelBaseInfo;
}

const checkDependencies = (schema: ITrainSchemaItem, fullData: Record<any, any>) => {
  if (!schema.dependencies) return;

  return schema.dependencies.find((dep) => {
    const { param_key, values, op } = dep;
    const dependencySchema = trainingConfigMap.get(param_key);

    if (!dependencySchema) return;

    const targetValue = fullData[param_key];
    const dependencyValue = Array.isArray(targetValue) ? targetValue : [targetValue];

    switch (op) {
      case EDependencyOprator.eq:
        return values.every((value) => dependencyValue.includes(value));
      case EDependencyOprator.neq:
        return values.every((value) => !dependencyValue.includes(value));
      case EDependencyOprator.in:
        return values.some((value) => dependencyValue.includes(value));
      case EDependencyOprator.not_in:
        const notInValues = !values.some((value) => dependencyValue.includes(value));

        return notInValues;

      default:
        break;
    }
  });
};

const specialHandleKeys: Record<
  string,
  (schemaItem: ITrainSchemaItem, context: ILayoutCheckContext) => ITrainSchemaItem
> = {
  booster: (schemaItem, context) => {
    const { fullFormData } = context;

    if (fullFormData.stage === 'PPO' && fullFormData.finetuning_type?.toString() === 'lora') {
      const copySchema = { ...schemaItem };
      copySchema.enum_options = copySchema.enum_options?.filter((item) => item.value !== 'unsloth');
      return copySchema;
    }

    return schemaItem;
  },
  moe_aux_loss_coef: (schemaItem, context) => {
    const { selectedModel } = context;

    if (selectedModel?.isMoe !== true) {
      const copySchema = { ...schemaItem };
      copySchema.extraItemProps = {
        hidden: true,
      };

      return copySchema;
    }

    return schemaItem;
  },
  resize_vocab: (schemaItem, context) => {
    const { fullFormData, selectedModel } = context;

    if (fullFormData[schemaItem.param_key]) {
      const copySchema = { ...schemaItem };
      copySchema.extraItemProps = { extra: '请在LoRA参数设置中的其他训练模块添加embedding_layer' };

      return copySchema;
    }

    return schemaItem;
  },
  use_galore: (schemaItem, context) => {
    const { fullFormData } = context;

    if (fullFormData[schemaItem.param_key]) {
      const copySchema = { ...schemaItem };
      copySchema.extraItemProps = {
        extra: '使用GaLore适配器建议设置混合精度训练计算类型为pure_fp16，其他精度会加大显存消耗',
      };

      return copySchema;
    }

    return schemaItem;
  },
  template_key_layout: (schemaItem, context) => {
    const { fullFormData, selectedModel } = context;

    return schemaItem;
  },
};

export const pickValidLayout = (layout: ITrainSchemaItem[], context: ILayoutCheckContext) => {
  const { fullFormData, selectedModel } = context;
  const layoutResult: ITrainSchemaItem[] = [];

  layout.forEach((item) => {
    const dependencyCondition = checkDependencies(item, fullFormData);
    let pushItem = item;

    if (dependencyCondition) {
      pushItem = { ...item };

      // 条件满足，不渲染该项
      if (dependencyCondition.action === EDependencyAction.hidden) {
        pushItem.extraItemProps = {
          hidden: true,
        };
      } else if (dependencyCondition.action === EDependencyAction.readonly) {
        pushItem.readonly = true;
      }
    }

    // 单个key的特殊处理逻辑
    const speicalHandler = specialHandleKeys[item.param_key];
    if (speicalHandler) {
      pushItem = speicalHandler(pushItem, context);
    }

    // 非多模态的模型整个多模态分组的参数都不可用
    if (selectedModel?.modelType !== 'vllm' && item.group_key === EGroupKey.MutilModelsConfig) {
      pushItem = { ...pushItem };
      pushItem.extraItemProps = {
        hidden: true,
      };
    }

    layoutResult.push(pushItem);
  });

  return layoutResult;
};

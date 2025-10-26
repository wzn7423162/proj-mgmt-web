import { GPU_COUNT_NAME_KEY, trainingConfigMap } from '@llama-fa/constants';
import { IModelBaseInfo, checkModelAccount, filesUserDatasets } from '@llama-fa/core/api';
import { getModelFinetuneDetail } from '@llama-fa/core/api/finetune';

import confirm from 'antd/es/modal/confirm';
import { generatePromiseWrap } from '@llama-fa/utils';
import { isEmpty } from 'lodash';
import { message } from 'antd';

export type TValidateResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      errorMessage: string;
    };

export interface IValidateConfigJsonParams {
  configJson: Record<any, any>;
  selectedModelInfo?: IModelBaseInfo;
}

const extraCheckHandlers: Record<string, (value: any, params: IValidateConfigJsonParams) => any> = {
  ref_model_adapters: (value, params) => {
    const { configJson } = params;

    const { quantization_config } = configJson;

    if (quantization_config && value?.includes(',')) {
      throw `开启量化后仅支持一个适配器路径`;
    }
  },
  additional_target: (value, params) => {
    const { configJson } = params;

    const { quantization_config } = configJson;

    if (quantization_config && value?.includes(',')) {
      throw `量化时仅可以配置一个其他适配器路径`;
    }
  },
  use_badam: (value, params) => {
    const { configJson, selectedModelInfo } = params;

    if (!value) return;

    if (configJson[GPU_COUNT_NAME_KEY] < 2) {
      return;
    }

    const { use_deepspeed, ds_stage } = configJson;

    if (!(use_deepspeed && ds_stage === '3')) {
      throw `使用BAdam适配器进行多卡训练时，需要开启DeepSpeed且Stage设置为Zero-3`;
    }

    if (!selectedModelInfo?.isLayer) {
      throw `使用BAdam适配器进行多卡训练时，使用模型需要设置为layer`;
    }
  },
  ds_stage: (value, params) => {
    const { configJson } = params;

    if (value === 'Zero-3') {
      const { booster, use_galore, pissa_init, compute_type } = configJson;

      if (booster === 'unsloth') {
        throw `Unsloth计算加速不支持DeepSeed Zero-3，请调整参数`;
      }

      if (use_galore) {
        throw `使用Galore适配器不支持DeepSeed Zero-3，请调整参数`;
      }

      if (pissa_init) {
        throw `使用DeepSpee Zero-3时，不支持开启PiSSA，请调整参数`;
      }

      if (pissa_init) {
        throw `使用DeepSpee Zero-3时，不支持开启PiSSA，请调整参数`;
      }

      if (compute_type === 'pure_bf16') {
        throw `使用DeepSpee Zero-3时，不支持混合精度训练计算类型为pure_fp16`;
      }
    }
  },
  resize_vocab: (value, params) => {
    if (value) {
      const { configJson } = params;
      const { additional_target } = configJson;

      if (!additional_target?.includes('embedding_layer')) {
        throw `更改词表大小后，请在LoRA参数设置中的其他训练模块添加embedding_layer`;
      }
    }
  },

  template_key_sss: (value, params) => {
    const { configJson } = params;

    if (value) {
    }
  },
};

export const validateConfigJson = (params: IValidateConfigJsonParams): TValidateResult => {
  try {
    const { configJson } = params;
    if (isEmpty(configJson.publicData) && isEmpty(configJson.fileData)) {
      throw `公共数据和文件管理至少要选择一项`;
    }

    Object.entries(configJson).forEach(([key, value]) => {
      const targetSchema = trainingConfigMap.get(key);

      if (!targetSchema) return;

      if (targetSchema.required) {
        const dataType = typeof value;

        if (dataType === 'number') {
          if (isNaN(value as any)) {
            throw `请填写${targetSchema.zh_name || targetSchema.en_name}参数`;
          }
        } else if (dataType === 'boolean') {
        } else if (isEmpty(value)) {
          throw `请填写${targetSchema.zh_name || targetSchema.en_name}参数`;
        }
      }

      const extraCheckHandler = extraCheckHandlers[key];
      if (extraCheckHandler) {
        extraCheckHandler(value, params);
      }
    });

    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      errorMessage: error?.message ?? error ?? '表单校验失败',
    };
  }
};

export const checkModelAmountEnable = async (...params: Parameters<typeof checkModelAccount>) => {
  return checkModelAccount(...params).catch(async (error) => {
    if (error?.code === 1002) {
      const confirmTask = generatePromiseWrap();

      confirm({
        type: 'confirm',
        title: '账户余额和代金券余额不足以支付此次任务的预估费用，是否继续训练？',
        content:
          '账户余额和代金券余额不足以支付此次任务的预估费用，请及时充值，避免对任务运行产生影响',
        okText: '继续',
        cancelText: '取消',
        onOk: () => {
          confirmTask.resolve(undefined);
          return true;
        },
        onCancel: () => confirmTask.reject(),
      });

      await confirmTask.promise;
    } else {
      return Promise.reject(error);
    }
  });
};

export const checkFileDataExtendable = async (extendFinetuneId: string) => {
  let hasUnmatchFile = false;
  let cancelExtend = false;

  const finetuneData = await getModelFinetuneDetail(extendFinetuneId);
  const formData = finetuneData.configJson;

  // 如果继承的参数有文件数据，需要过滤出当前实际可用的文件列表中的项
  if (Array.isArray(formData?.fileData) && formData.fileData.length) {
    const fileList = await filesUserDatasets(
      {},
      {
        queryOptions: {
          gcTime: 1000 * 5,
          staleTime: 1000 * 5,
        },
        extra: {
          hideErrorMessage: true,
        },
      }
    );

    const uniqueFiles = new Set(fileList);
    hasUnmatchFile = !!formData.fileData.find((item: any) => !uniqueFiles.has(item));

    if (hasUnmatchFile) {
      const confirmTask = generatePromiseWrap();

      confirm({
        type: 'confirm',
        title: '应用的参数中数据集文件不存在，是否继续应用参数？',
        content: '数据集文件不存在，应用参数后请重新选择数据',
        okText: '确定',
        cancelText: '取消',
        // centered: true,
        onOk: () => {
          confirmTask.resolve(undefined);

          return true;
        },
        onCancel: () => {
          cancelExtend = true;
          confirmTask.reject();
        },
      });

      await confirmTask.promise;
    }
  }

  return {
    hasUnmatchFile,
    cancelExtend,
  };
};

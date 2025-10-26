export interface ImageParamsItem {
  aspect_ratio: string;
  width: number;
  height: number;
  number_of_images: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed: string | number;
  imageSize?: string;
}

export interface IImageGenerationRecord {
  images: string[];
  prompt: string;
  genParams: ImageParamsItem;
  spendTime: number;
  inferTime: number;
}

export interface IImageGenerationInput {
  aspect_ratio?: string;
  /**
   * 引导强度，控制图像和提示词的相关性强弱的参数，越大越倾向提示词 默认 7.5
   */
  guidance_scale?: number;
  /**
   * 图像高 默认1024
   */
  height?: number;
  /**
   * 反向提示词
   */
  negative_prompt?: string;
  /**
   * 推理步数，默认 28
   */
  num_inference_steps?: number;
  /**
   * 生图数量，默认 1
   */
  number_of_images?: number;
  /**
   * 提示词
   */
  prompt: string;
  /**
   * 种子，默认 0
   */
  seed?: number;
  /**
   * 重绘强度，默认 0.75
   */
  strength?: number;
  /**
   * 反向提示词时才有用，必须大于1 默认 9.0
   */
  // guidance_scal?: number;
  /**
   * 图像宽 默认1024
   */
  width?: number;
}

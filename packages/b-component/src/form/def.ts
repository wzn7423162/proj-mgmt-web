import type { UploadFile } from 'antd';

export interface IUploadModelImagesProps {
  id?: string;
  value?: IUploadModelImagesItemConf[];
  onChange?: (value?: IUploadModelImagesItemConf[]) => void;
  maxCount?: number;
}

export interface IUploadModelImagesItemConf {
  imageUrl?: string;
  isConfig: number;
  prompt: string;
  guidanceScale: number;
  step: number;
  seed: number;
  fileId: string;
  imageSize: string;
}

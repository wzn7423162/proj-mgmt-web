import { UploadFile } from 'antd';

export interface UploadImagesProps {
  className?: string;
  /**
   * 上传图片的回调函数
   */
  onUpload?: (files: File[]) => void;
}

export type CustomUploadFile = UploadFile & {
  fileId?: string;
};

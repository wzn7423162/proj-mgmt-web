import { BaseResult } from './common';
import { IFileMeta } from './meta/file';
export enum EResourceType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Document = 'document',
  All = 'all',
  Other = 'other',
}

export type TUploadResult = BaseResult<IFileMeta>;
export type TUploadDirectoryResult = BaseResult<IFileMeta[]>;

export interface IVectorProgress {
  current: number;
  total: number;
  success: number;
  failed: number;
  file?: IFileMeta;
}

export interface IFileResource {
  bucketName: string;
  createTime: string;
  fileName: string;
  filePath: string;
  fullPath: string;
  id: string;
  ossDomain: string;
}

export interface IUploadFile {
  /** 存储桶名称 */
  bucketName: 'llamafactory-online-assets' | string;
  /** 创建时间，格式：YYYY-MM-DD HH:mm:ss */
  createTime: string;
  /** 文件名 */
  fileName: string;
  /** 文件在 OSS 中的相对路径 */
  filePath: string;
  /** 文件的完整访问 URL */
  fullPath: string;
  /** 文件唯一标识符（UUID） */
  id: string;
  /** OSS 服务域名 */
  ossDomain: string;
}

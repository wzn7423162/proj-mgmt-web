export enum EExportStatus {
  PROGRESS = 0,
  SUCCESS = 1,
  FAILED = 2,
}

export const ExportStatusMap = {
  [EExportStatus.PROGRESS]: { text: '生成中', status: 0 },
  [EExportStatus.SUCCESS]: { text: '生成成功', status: 1 },
  [EExportStatus.FAILED]: { text: '生成失败', status: 2 },
};

export enum ETaskStatus {
  Queuing = 1,
  Starting = 2,
  Running = 3,
  Success = 4,
  Failed = 5,
  Stopped = 6,
  Creating = 7,
  Stopping = 8,
  StopFailed = 9,
}
export enum EModelStatus {
  Unreleased = 0, // 未发布
  Released = 1 // 已发布
}

export const TaskStatusMap = {
  [ETaskStatus.Queuing]: { text: '排队中', status: 'processing' },
  [ETaskStatus.Starting]: { text: '启动中', status: 'processing' },
  [ETaskStatus.Running]: { text: '运行中', status: 'processing' },
  [ETaskStatus.Success]: { text: '运行完成', status: 'success' },
  [ETaskStatus.Failed]: { text: '运行失败', status: 'error' },
  [ETaskStatus.Stopped]: { text: '已停止', status: 'default' },
  [ETaskStatus.Creating]: { text: '创建中', status: 'processing' },
  [ETaskStatus.Stopping]: { text: '停止中', status: 'warning' },
  [ETaskStatus.StopFailed]: { text: '停止失败', status: 'error' },
};

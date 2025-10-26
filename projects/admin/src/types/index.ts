// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  code: number;
  msg: string;
  data: {
    token: string;
    userId: number;
    username: string;
  };
}

// 项目
export interface Project {
  id: number;
  projectName: string;
  machineCount: number;
  userId: number;
  delFlag: string;
  createTime: string;
  updateTime: string;
}

// 机台
export interface Machine {
  id: number;
  machineName: string;
  projectId: number;
  importTime: string;
  onlineTime?: string;
  onlineVerified: number;
  delFlag: string;
  createTime: string;
  updateTime: string;
}

// 分页响应
export interface PageResponse<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// 路由配置
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}


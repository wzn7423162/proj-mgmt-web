export enum ELoginFormType {
  login = 'login',
  resetPassword = 'resetPassword',
}

export interface IBaseLoginFormData {
  phone: string;
  password: string;
  smsCode: string;
}

export interface ISMSGetInfo {
  uuid: string;
}

export enum ESMSType {
  login = 'login',
  forgotPassword = 'forgotPassword',
}

export enum EChangePasswordType {
  forgotPassword = 'forgotPassword',
  editPassword = 'editPassword',
}

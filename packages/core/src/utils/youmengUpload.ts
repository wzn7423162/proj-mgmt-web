import { debounce } from 'lodash';
import { IUserInfo } from '@llama-fa/types';
import { youmengUpload as youmengUploadApi, getUserInfo } from '../api/user';
// 获取所有以 CNZZ 前缀的 cookie
const getCNZZCookies = () => {
  const cookies = document.cookie.split(';');
  const cnzzCookies: Record<string, string> = {};
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [name, value] = cookie.split('=');
    if (name && name.startsWith('CNZZ')) {
      cnzzCookies[name] = decodeURIComponent(value || '');
    }
  }
  return cnzzCookies;
};
const getCookieId = () => {
  const cnzzCookies = getCNZZCookies();
  return Object.values(cnzzCookies)[0]?.split('-')?.slice(0, 2)?.join('-');
};
export class YoumengUploader {
  // 是否已经在登录状态下上报过
  private hasLoggedInUploaded = false;
  /**
   * 执行友盟上报
   * @param userInfo 用户信息
   * @param forceUpload 是否强制上传，忽略标识
   */
  public upload = debounce(async (userInfo?: IUserInfo, forceUpload = false) => {
    if (this.hasLoggedInUploaded && !forceUpload) {
      return;
    }
    let params: any = {
      cookieId: getCookieId(),
    };
    if (userInfo) {
      params = { ...params, userId: userInfo.id, userKey: userInfo.userId };
    }
    await youmengUploadApi(params);
    if (userInfo) {
      this.hasLoggedInUploaded = true;
    }
  }, 1000);

  // 获取用户信息并上报
  public async getUserInfoAndUpload() {
    const userInfo = await getUserInfo();
    this.upload(userInfo);
  }

  /**
   * 重置上传状态
   */
  public reset(): void {
    this.hasLoggedInUploaded = false;
  }
}
// 导出单例实例
export const youmengUploader = new YoumengUploader();

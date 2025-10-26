import { IUserInfo } from '@llama-fa/types';
import { editUserInfo } from '../api/user';
import { random } from 'lodash';
import userAvatartImage1 from '@/assets/images/default-avatar/avatar_1.png';
import userAvatartImage10 from '@/assets/images/default-avatar/avatar_10.png';
import userAvatartImage2 from '@/assets/images/default-avatar/avatar_2.png';
import userAvatartImage3 from '@/assets/images/default-avatar/avatar_3.png';
import userAvatartImage4 from '@/assets/images/default-avatar/avatar_4.png';
import userAvatartImage5 from '@/assets/images/default-avatar/avatar_5.png';
import userAvatartImage6 from '@/assets/images/default-avatar/avatar_6.png';
import userAvatartImage7 from '@/assets/images/default-avatar/avatar_7.png';
import userAvatartImage8 from '@/assets/images/default-avatar/avatar_8.png';
import userAvatartImage9 from '@/assets/images/default-avatar/avatar_9.png';

const userAvatartImageList = [
  userAvatartImage1,
  userAvatartImage2,
  userAvatartImage3,
  userAvatartImage4,
  userAvatartImage5,
  userAvatartImage6,
  userAvatartImage7,
  userAvatartImage8,
  userAvatartImage9,
  userAvatartImage10,
];

export const getUserAvatar = (userInfo: IUserInfo): string => {
  let avatarIndex = userInfo.avatarIndex;

  if (typeof parseInt(avatarIndex) !== 'number') {
    avatarIndex = random(0, userAvatartImageList.length - 1, false).toString();
    editUserInfo({ avatarIndex }).catch(console.error);
  }

  return avatarIndex;
};

export const getUserAvatarUrl = (index: string | number) =>
  userAvatartImageList.at(index as any) ?? userAvatartImageList[0];

import { Flex, Popover, QRCode } from 'antd';
import {
  LLAMA_CONTACT_EMAIL,
  LLAMA_CONTACT_NUMBER,
  LLAMA_FAC_ONLINE_TEXT,
  LLAMA_FAC_TEXT,
} from '@llama-fa/constants';
import React, { useState } from 'react';

import { LIcon } from '../icon';
import { LTitle } from '@/title/Title';
import Style from './GlobalHeader.module.scss';
import { WXAgentQrcode } from '@/wx-agent-qrcode/WXAgentQrcode';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

const ContactUsPanel = React.memo(() => {
  return (
    <div className={cx('contact-us-content')}>
      <div className={cx('ask-text')}>
        {`在使用${LLAMA_FAC_ONLINE_TEXT}的过程中您遇到任何问题，都可以咨询我们，我们会为您提供解决方案`}
      </div>
      <LTitle bold size="medium" title="微信扫一扫，添加客服" />
      <WXAgentQrcode className={cx('qr-code')} />
      <div className={cx('contact-information')}>
        <Flex align="center" wrap="nowrap" className={cx('info-item')}>
          <LIcon type="phone-telephone" size={'small'} />
          <span className={cx('info-middle-text')}>电话:</span>
          <span>{LLAMA_CONTACT_NUMBER}</span>
        </Flex>
        <Flex align="center" wrap="nowrap" className={cx('info-item')}>
          <LIcon type="mail-hb7kii4n" size={'small'} />
          <span className={cx('info-middle-text')}>邮箱:</span>
          <span>{LLAMA_CONTACT_EMAIL}</span>
        </Flex>
      </div>
    </div>
  );
});

export const ContactUsNav = React.memo(() => {
  const [contextVisible, setContextVisible] = useState(false);

  return (
    <span className={cx('btn-item')} style={{ color: contextVisible ? '#2A69FF' : undefined }}>
      <LIcon type="communication" size={'small'} />
      <Popover
        onOpenChange={setContextVisible}
        classNames={{
          root: cx('contact-us'),
        }}
        title="联系我们"
        placement="bottomRight"
        content={<ContactUsPanel />}
      >
        <div>
          <LTitle colorInherit title="联系我们" />
        </div>
      </Popover>
    </span>
  );
});

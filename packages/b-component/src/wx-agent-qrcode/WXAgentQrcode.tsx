import React from 'react';
import agentQRcodeImage from '@llama-fa/constants/assets/images/wechat_agent_qrcode.png';

export interface IWXAgentQrcodeProps extends Partial<React.HTMLAttributes<HTMLElement>> {}

export const WXAgentQrcode = React.memo<IWXAgentQrcodeProps>((props) => {
  const { style, ...restProps } = props ?? {};
  return (
    <div
      style={{
        width: 160,
        height: 160,
        ...style,
      }}
      {...restProps}
    >
      <img style={{ width: '100%' }} src={agentQRcodeImage} />
    </div>
  );
});

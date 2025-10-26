import { Button } from 'antd';
import React, { FC } from 'react';

export interface ILLinkProps {
}

export const LLink: FC<ILLinkProps> = props => {
  return (
    <div>
      <Button style={{ height: 20, padding: 4 }} color="primary" variant="link">联系我们</Button>
    </div>
  );
}


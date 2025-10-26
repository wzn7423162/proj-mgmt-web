import { Modal, ModalProps } from 'antd';
import React, { PropsWithChildren, useMemo, useState } from 'react';

import { useMemoizedFn } from 'ahooks';

export interface ILDialogProps extends Omit<ModalProps, 'children'> {
  onShow?: () => void;
  body?: React.ReactNode | (() => React.ReactNode);
}

export const LDialog = React.memo<PropsWithChildren<ILDialogProps>>((props) => {
  const { body, children, open: propOpen, ...rest } = props;

  const [stateOpen, setStateOpen] = useState(false);

  const open = useMemo(() => {
    return propOpen ?? stateOpen;
  }, [propOpen, stateOpen]);

  const handleCancel = useMemoizedFn((event: any) => {
    props.onCancel?.(event);

    if (propOpen === undefined) {
      setStateOpen(false);
    }
  });

  const handleOk = useMemoizedFn((event: any) => {
    props.onOk?.(event);

    if (propOpen === undefined) {
      setStateOpen(false);
    }
  });

  const handleClick = useMemoizedFn((e: any) => {
    // @ts-ignore
    const orginalOnClick = props.children?.props?.onClick;
    if (typeof orginalOnClick === 'function') {
      const result = orginalOnClick(e);
      if (result === false) {
        return;
      }
    }

    if (!Reflect.has(props, 'visible')) {
      setStateOpen(true);
    }

    setTimeout(() => {
      const { onShow } = props;
      if (typeof onShow === 'function') {
        onShow();
      }
    });
  });

  const trigger = useMemo(() => {
    if (!children) {
      return null;
    }

    if (typeof children === 'string') {
      return children;
    }
    const childrenProps = { onClick: handleClick, key: 'dialog-key' };
    // @ts-ignore
    return React.cloneElement(children, childrenProps);
  }, [children]);

  return (
    <>
      {trigger}
      <Modal {...rest} open={open} onCancel={handleCancel} onOk={handleOk}>
        {typeof body === 'function' ? body() : body}
      </Modal>
    </>
  );
});

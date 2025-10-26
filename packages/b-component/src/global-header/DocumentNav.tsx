import { LIcon } from '../icon';
import { LLAMA_DOCUMENT_URL } from '@llama-fa/constants';
import { LTitle } from '@/title/Title';
import React from 'react';
import Style from './GlobalHeader.module.scss';
import { cxb } from '@llama-fa/utils';
import { useMemoizedFn } from 'ahooks';

const cx = cxb.bind(Style);

export const DocumentNav = React.memo(() => {
  const handleDcoumentClick = useMemoizedFn(() => {
    console.log('点击文档中心');
    // @ts-ignore
    window?._czc?.push(["_trackEvent", "homepage", "online_hp_instruction", "首页", "文档中心"]);
    window.open(LLAMA_DOCUMENT_URL, '_blank')
  });

  return (
    <span className={cx('btn-item', 'clickable-text-hover')}>
      <LIcon type="document-folder" size={'small'} />
      <LTitle title="文档中心" style={{ color: 'inherit' }} onClick={handleDcoumentClick} />
    </span>
  );
});

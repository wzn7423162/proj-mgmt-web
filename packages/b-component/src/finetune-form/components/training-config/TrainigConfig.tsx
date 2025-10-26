import { EFinetuneMode, ITrainSchemaItem } from '@llama-fa/types';
import React, { useEffect, useState } from 'react';
import { useGetState, useMemoizedFn } from 'ahooks';

import { ITrainigConfigProps } from './types';
import { ProfessionalForm } from './ProfessionalForm';
import { QuickForm } from './QuickForm';
import Style from './TrainigConfig.module.scss';
import { cxb } from '@llama-fa/utils';

const cx = cxb.bind(Style);

export const TrainigConfig = React.memo<ITrainigConfigProps>((props) => {
  const { mode } = props;

  const isProfessional = mode === EFinetuneMode.professional;
  const [quickFormExpanded, setQuickFormExpanded, getQuickFormExpanded] = useGetState(false);

  return (
    <div className={cx('training-config')}>
      {isProfessional ? (
        <ProfessionalForm {...props} />
      ) : (
        <QuickForm expanded={quickFormExpanded} onExpandChange={setQuickFormExpanded} {...props} />
      )}
    </div>
  );
});

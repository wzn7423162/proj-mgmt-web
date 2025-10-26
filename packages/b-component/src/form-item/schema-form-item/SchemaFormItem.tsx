import { BooleanRender, EnumRender, IntRender, Strin2gRender, StringRender } from './common';
import { ISchemaFormItemProps, ISchemaFormItemRenderProps } from './types';

import { EDataType } from '@llama-fa/types';
import React from 'react';
import { SchemaFormItemWrapper } from './FormItemWrapper';

const RENDER_MAPPING: Record<EDataType, React.FC<ISchemaFormItemRenderProps>> = {
  [EDataType.boolean]: BooleanRender,
  [EDataType.enum]: EnumRender,
  [EDataType.int]: IntRender,
  [EDataType.float]: IntRender,
  [EDataType.float2]: IntRender,
  [EDataType.string]: StringRender,
  [EDataType.string2]: Strin2gRender,
};

const EmptyComponent = () => null;

export const SchemaFormItem = React.memo<ISchemaFormItemProps>((props) => {
  const { param_key, en_name, zh_name, data_type, number_render_type, ...rest } = props;

  // 增加兜底逻辑，经常json调坏导致页面崩溃
  const RenderComponent: any = RENDER_MAPPING[data_type] ?? EmptyComponent;

  return (
    <SchemaFormItemWrapper {...props}>
      <RenderComponent {...props} />
    </SchemaFormItemWrapper>
  );
});

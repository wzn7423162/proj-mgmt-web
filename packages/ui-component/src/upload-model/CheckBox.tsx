import React, { useCallback, useEffect, useState } from 'react';

import { Checkbox as CheckboxAntd } from 'antd'

interface ICheckboxProps { 
    id?: string;
    value?: number;
    onChange?: (value?: number) => void;

    children?: React.ReactNode;
}
export const Checkbox = React.memo<ICheckboxProps>(({
    onChange, children, value
}) => {
    return <CheckboxAntd checked={ !!value} onChange={(e) => {
        onChange?.(e.target.checked ? 1 : 0 );
    }}>{children}</CheckboxAntd>
});
import React, { useCallback, useEffect, useState } from 'react';

import { Checkbox } from 'antd'
import s from './FormLicense.module.scss'

interface Val {
    zxEnable?: number;
    apiEnable?: number;
    blendEnable?: number;
    downEnable?: number;
}
interface IFormScopeCreativeProps {
    id?: string;
    value?: Val;
    onChange?: (value?: Object) => void;
}
export const FormScopeCreative = React.memo<IFormScopeCreativeProps>(({
    onChange, value,
}) => {
    return <>
        <div className={s.checkbox}>
            <Checkbox
                checked={!!value?.zxEnable}
                onChange={(e) => {
                    onChange?.({ ...value, zxEnable: e.target.checked ? 1 : 0 });
                }}>允许在Baical Infer在线生图</Checkbox>
        </div>
        <div className={s.checkbox}>
            <Checkbox
                checked={!!value?.apiEnable}
                onChange={(e) => {
                    onChange?.({ ...value, apiEnable: e.target.checked ? 1 : 0 });
                }}>允许通过Baical API调用生图</Checkbox></div>
        <div className={s.checkbox}>
            <Checkbox
                checked={!!value?.blendEnable}
                onChange={(e) => {
                    onChange?.({ ...value, blendEnable: e.target.checked ? 1 : 0 });
                }}>允许进行融合</Checkbox>
        </div>
        <div className={s.checkbox}>
            <Checkbox
                checked={!!value?.downEnable}
                onChange={(e) => {
                    onChange?.({ ...value, downEnable: e.target.checked ? 1 : 0 });
                }}>允许下载生图</Checkbox>
        </div>
    </>
})
import React, { useCallback, useEffect, useState } from 'react';
import ProForm, {
    ProFormDependency,
    ProFormDigit,
    ProFormProps,
    ProFormSwitch,
    ProFormSelect,
    ProFormCheckbox,
} from '@ant-design/pro-form';
import { Form, } from 'antd'
import { Checkbox } from './CheckBox';
import { FormScopeCreative } from './FormScopeCreative'

import Style from './FormLicense.module.scss';

interface IFormLicenseProps {
    id?: string;
    value?: number;
    onChange?: (value?: number) => void;
}
export const FormLicense = React.memo<IFormLicenseProps>(({
    onChange,
}) => {
    return <div className={Style['form-license']}>
        <div className={Style['header']}>使用此模型，我授予用户以下权限：</div>
        <div className={Style['title']}>创作许可范围</div>
        <Form.Item name="scopeCreative">
            <FormScopeCreative></FormScopeCreative>
        </Form.Item>

        <div className={Style['title']}>商业许可范围</div>
        <Form.Item name="commercialCreative">
            <Checkbox>生成图片可商用</Checkbox>
        </Form.Item>
        <Form.Item name="saleCreative">
            <Checkbox>允许转售模型或出售融合模型</Checkbox>
        </Form.Item>
    </div>
});
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginAPI } from '@llama-fa/core/api';
import styles from './LoginPage.module.scss';
import { AuthUtils } from '@llama-fa/utils';
import { routerHelper } from '../../routers/hashRoutes';
import { ERouteName } from '../../routers/types';
import { loginByName } from '@/api/request';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { phone: string; password: string }) => {
    setLoading(true);
    try {
      // 參照 online：使用賬號（手機號）+ 密碼登錄，服務端返回 token
      const response = await loginByName({ phone: values.phone, password: values.password });

      if (response?.token) {
        // 保存token和用户信息
        AuthUtils.setToken(response.token);

        message.success('登录成功');
        routerHelper.to(ERouteName.projectList);
      }
    } catch (error: any) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>项目管理系统</div>
        <Form
          name="login"
          className={styles.loginForm}
          initialValues={{ phone: '13800000000', password: 'admin123' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="phone"
            rules={[{ required: true, message: '请输入账号/手机号' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="账号/手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
};


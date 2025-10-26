import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker, Select, Space, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { machineAPI } from '@/api';
import type { Machine } from '@/types';
import styles from './ProjectDetailPage.module.scss';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Machine | null>(null);

  // 定时自动刷新表格（參照 online 的輪詢思路）
  useEffect(() => {
    const timer = setInterval(() => {
      actionRef.current?.reload?.();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const columns: ProColumns<Machine>[] = [
    {
      title: '机台名',
      dataIndex: 'machineName',
      key: 'machineName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
      key: 'importTime',
      width: 200,
      valueType: 'dateTime',
      render: (_, record) => {
        return record.importTime
          ? dayjs(record.importTime).format('YYYY-MM-DD HH:mm:ss')
          : '-';
      },
    },
    {
      title: '上线时间',
      dataIndex: 'onlineTime',
      key: 'onlineTime',
      width: 200,
      valueType: 'dateTime',
      render: (_, record) => {
        return record.onlineTime
          ? dayjs(record.onlineTime).format('YYYY-MM-DD HH:mm:ss')
          : '-';
      },
    },
    {
      title: '上线验证',
      dataIndex: 'onlineVerified',
      key: 'onlineVerified',
      width: 120,
      valueEnum: {
        0: { text: '未验证', status: 'Default' },
        1: { text: '已验证', status: 'Success' },
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Machine) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      machineName: record.machineName,
      importTime: record.importTime ? dayjs(record.importTime) : null,
      onlineTime: record.onlineTime ? dayjs(record.onlineTime) : null,
      onlineVerified: record.onlineVerified,
    });
    setEditModalVisible(true);
  };

  const handleDelete = (record: Machine) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除机台"${record.machineName}"吗？`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await machineAPI.delete(record.id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      await machineAPI.create({
        machineName: values.machineName,
        projectId,
        importTime: values.importTime
          ? values.importTime.format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        onlineTime: values.onlineTime
          ? values.onlineTime.format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        onlineVerified: values.onlineVerified || 0,
      });

      message.success('创建成功');
      setCreateModalVisible(false);
      form.resetFields();
      actionRef.current?.reload();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || '创建失败');
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();

      if (!currentRecord) return;

      await machineAPI.update({
        id: currentRecord.id,
        machineName: values.machineName,
        importTime: values.importTime
          ? values.importTime.format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        onlineTime: values.onlineTime
          ? values.onlineTime.format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        onlineVerified: values.onlineVerified,
      });

      message.success('更新成功');
      setEditModalVisible(false);
      editForm.resetFields();
      setCurrentRecord(null);
      actionRef.current?.reload();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || '更新失败');
    }
  };

  return (
    <div className={styles.projectDetailPage}>
      <div className={styles.header}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/project-list')}
          style={{ marginRight: 16 }}
        >
          返回
        </Button>
        <div className={styles.title}>机台管理</div>
      </div>

      <ProTable<Machine>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          try {
            const response = await machineAPI.getList({
              pageNum: params.current || 1,
              pageSize: params.pageSize || 10,
              projectId,
              machineName: params.machineName,
            });

            return {
              data: response.list,
              success: true,
              total: response.total,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        dateFormatter="string"
        headerTitle="机台列表"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            添加机台
          </Button>,
        ]}
      />

      <Modal
        title="添加机台"
        open={createModalVisible}
        onOk={handleCreate}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="机台名称"
            name="machineName"
            rules={[{ required: true, message: '请输入机台名称' }]}
          >
            <Input placeholder="请输入机台名称" />
          </Form.Item>

          <Form.Item label="导入时间" name="importTime">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="上线时间" name="onlineTime">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="上线验证" name="onlineVerified">
            <Select placeholder="请选择">
              <Select.Option value={0}>未验证</Select.Option>
              <Select.Option value={1}>已验证</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑机台"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setCurrentRecord(null);
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="机台名称"
            name="machineName"
            rules={[{ required: true, message: '请输入机台名称' }]}
          >
            <Input placeholder="请输入机台名称" />
          </Form.Item>

          <Form.Item label="导入时间" name="importTime">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="上线时间" name="onlineTime">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="上线验证" name="onlineVerified">
            <Select placeholder="请选择">
              <Select.Option value={0}>未验证</Select.Option>
              <Select.Option value={1}>已验证</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


import React from 'react';
import { Card, Button, Space, Modal, message } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Project } from '@/types';
import { projectAPI } from '@/api';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/project-detail/${project.id}`);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目"${project.projectName}"吗？删除后将无法恢复。`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await projectAPI.delete(project.id);
          message.success('删除成功');
          onDelete?.();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  return (
    <Card
      className={styles.projectCard}
      hoverable
      onClick={handleView}
    >
      <div className={styles.cardHeader}>
        <div className={styles.projectName}>{project.projectName}</div>
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={handleView}
          >
            查看
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            删除
          </Button>
        </Space>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.infoItem}>
          <DatabaseOutlined className={styles.icon} />
          <span>机台数量：{project.machineCount || 0}</span>
        </div>
        <div className={styles.infoItem}>
          <ClockCircleOutlined className={styles.icon} />
          <span>创建时间：{dayjs(project.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
      </div>
    </Card>
  );
};


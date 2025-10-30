import React from 'react';
import { Button, Space, Modal, message, Typography, Tooltip } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import type { Project } from '@/types';
import { projectAPI } from '@/api';
import styles from './ProjectCard.module.scss';
import { routerHelper } from '@/routers/hashRoutes';
import { ERouteName } from '@/routers/types';
const { Text } = Typography;

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {

  const handleView = () => {
    routerHelper.to(ERouteName.projectDetail, { query: { id: project.id.toString() } });
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

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={styles.instanceCard} onClick={handleView}>
      <div className={styles.header} onClick={stopPropagation}>
        <div className={styles.titleBlock}>
          <div className={styles.titleWrapper}>
            <Text className={styles.title} ellipsis={{ tooltip: project.projectName }}>
              {project.projectName}
            </Text>
          </div>
        </div>
        <div className={styles.actions}>
          <Space>
            <Tooltip title="查看">
              <Button type="text" icon={<EyeOutlined />} onClick={handleView} className={styles.actionButton} />
            </Tooltip>
            <Tooltip title="删除">
              <Button type="text" danger icon={<DeleteOutlined />} onClick={handleDelete} className={styles.actionButton} />
            </Tooltip>
          </Space>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.infoItem}>
          <DatabaseOutlined className={styles.infoIcon} />
          <span>机台数量：{project.machineCount || 0}</span>
        </div>
        <div className={styles.infoItem}>
          <ClockCircleOutlined className={styles.infoIcon} />
          <span>创建时间：{dayjs(project.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
      </div>

      <div className={styles.footer} onClick={stopPropagation}>
        <div />
        <div className={styles.footerActions}>
          {/* 预留底部操作区，保持与 InstanceCard 结构一致 */}
        </div>
      </div>
    </div>
  );
};


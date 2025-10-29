import React from 'react';
import { LayoutMenu } from '../layout-menu/LayoutMenu';
import styles from './MainLeft.module.scss';
import { LeftOutlined, RightOutlined, ProjectOutlined } from '@ant-design/icons';

interface MainLeftProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const MainLeft: React.FC<MainLeftProps> = ({ collapsed, onCollapse }) => {
  return (
    <>
      <div className={styles.leftTop}>
        {!collapsed ? (
          <div className={styles.logo}>
            <ProjectOutlined style={{ fontSize: 22, marginRight: 8, color: '#333' }} />
            <span style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
              项目管理系统
            </span>
          </div>
        ) : (
          <div className={styles.logo}>
            <ProjectOutlined style={{ fontSize: 22, color: '#333' }} />
          </div>
        )}
      </div>
      <LayoutMenu collapsed={collapsed} />
      <div className={styles.leftBottom}>
        <div className={styles.collapseButton} onClick={() => onCollapse(!collapsed)}>
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </div>
      </div>
    </>
  );
};


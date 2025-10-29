import React, { FC } from 'react';
import { Outlet } from 'react-router';
import styles from './MainLayout.module.scss';
import { cxb } from '@llama-fa/utils';
import { MainLeft } from './main-left/MainLeft';
import { MainHeader } from './main-header/MainHeader';
import { useRouteRecord } from '@/hooks/useRouteRecord';

const cx = cxb.bind(styles);

export interface IMainLayoutProps {}

export const MainLayout: FC<IMainLayoutProps> = React.memo((props) => {
  const [collapsed, setCollapsed] = React.useState(false);

  // 使用 useRouteRecord 获取当前路由记录
  const routeRecord = useRouteRecord();
  const isPureContentLayout = routeRecord?.pureLayoutContainer;
  const hiddenTitle = routeRecord?.hiddenTitle;

  return (
    <div className={cx('layout', { ['collapsed']: collapsed })}>
      <div className={cx('layoutBackground')}>
        <div className={cx('gradientArea')}></div>
      </div>
      <div className={cx('left')}>
        <MainLeft collapsed={collapsed} onCollapse={setCollapsed} />
      </div>
      <div className={cx('right')}>
        <div className={cx('toolbar')}>
          <MainHeader />
        </div>
        <div className={cx('mainContent', { ['confinedContent']: !isPureContentLayout })}>
          {isPureContentLayout ? (
            <Outlet />
          ) : (
            <>
              <div className={cx('mainContentTitle')}>
                {hiddenTitle ? null : (
                  <div className={cx('title')}>
                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{routeRecord?.label}</span>
                  </div>
                )}
              </div>
              <div className={cx('content')}>
                <Outlet />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});


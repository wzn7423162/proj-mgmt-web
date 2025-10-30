import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Input, Empty, Spin, Modal, Form, message, Space, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ProjectCard } from '@/components/ProjectCard/ProjectCard';
import { projectAPI } from '@/api';
import type { Project } from '@/types';
import styles from './ProjectListPage.module.scss';
import { useMediaQuery } from '@llama-fa/utils';
import { useDebounceFn } from 'ahooks';

export const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState(0);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

  const pageSize = 10;
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  const screenSize = useMediaQuery();
  const colSpan = 24 / screenSize;

  const fetchProjects = useCallback(async (pageNum: number, search: string, isInitial = false) => {
    setLoading(true);
    try {
      const response = await projectAPI.getList({
        pageNum,
        pageSize,
        projectName: search || undefined,
        orderByColumn: sortOrder ? sortField : null,
        isAsc: sortOrder === 'asc' ? 'asc' : sortOrder === 'desc' ? 'desc' : null,
      } as any);

      if (response.list) {
        setProjects((prev) => {
          const next = isInitial ? response.list : [...prev, ...response.list];
          const totalCount = response.total ?? next.length;
          setTotal(totalCount);
          setHasMore(next.length < totalCount);
          return next;
        });
      }
    } catch (error) {
      console.error('获取项目列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, sortField, sortOrder]);

  useEffect(() => {
    fetchProjects(1, '', true);
  }, []);

  useEffect(() => {
    if (listContainerRef.current) {
      setContainerHeight(listContainerRef.current.clientHeight);
    }
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
    setProjects([]);
    fetchProjects(1, value, true);
  };

  const { run: debouncedSearch } = useDebounceFn(
    (value: string) => {
      handleSearch(value);
    },
    { wait: 500 }
  );

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjects(nextPage, searchText);
  };

  const handleSortFieldChange = (field: string) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(undefined);
        setSortOrder(undefined);
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      if (sortOrder === 'asc') return <CaretUpOutlined />;
      if (sortOrder === 'desc') return <CaretDownOutlined />;
    }
    return (
      <span className={styles.sortIcon}>
        <CaretUpOutlined />
        <CaretDownOutlined />
      </span>
    );
  };

  useEffect(() => {
    setProjects([]);
    setPage(1);
    fetchProjects(1, searchText, true);
  }, [sortField, sortOrder]);

  const handleCreateProject = async () => {
    try {
      const values = await form.validateFields();
      await projectAPI.create({ projectName: values.projectName });

      message.success('创建成功');
      setCreateModalVisible(false);
      form.resetFields();

      // 重新加载列表
      setPage(1);
      setProjects([]);
      fetchProjects(1, searchText, true);
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(error.message || '创建失败');
    }
  };

  const handleDeleteSuccess = () => {
    // 重新加载列表
    setPage(1);
    setProjects([]);
    fetchProjects(1, searchText, true);
  };

  return (
    <div className={styles.projectListPage}>
      <div className={styles.header}>
        {/* <div className={styles.title}>项目列表</div> */}
        <div className={styles.actions}>
          <Space size="large">
            <span
              className={styles.sortControl}
              onClick={() => handleSortFieldChange('createTime')}
            >
              创建时间
              {renderSortIcon('createTime')}
            </span>
            <span
              className={styles.sortControl}
              onClick={() => handleSortFieldChange('updateTime')}
            >
              更新时间
              {renderSortIcon('updateTime')}
            </span>
            <Input
              placeholder="搜索项目名称"
              prefix={<SearchOutlined />}
              style={{ width: 300, marginRight: 16 }}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onChange={(e) => debouncedSearch(e.target.value)}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              新建项目
            </Button>
          </Space>
        </div>
      </div>

      <div className={styles.stats}>
        <span>共 {total} 个项目</span>
      </div>

      <div className={styles.listContainer} ref={listContainerRef}>
        {loading && projects.length === 0 ? (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        ) : projects.length === 0 ? (
          <Empty description="暂无项目" />
        ) : (
          <InfiniteScroll
            dataLength={projects.length}
            next={handleLoadMore}
            hasMore={hasMore}
            loader={
              <div className={styles.loadingMore}>
                <Spin />
              </div>
            }
            endMessage={
              projects.length > 10 && (
                <div className={styles.endMessage}>没有更多项目了</div>
              )
            }
            height={containerHeight}
            className={styles.infiniteScroll}
          >
            <Row gutter={[24, 24]}>
              {projects.map((project) => (
                <Col span={colSpan} key={project.id}>
                  <ProjectCard project={project} onDelete={handleDeleteSuccess} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        )}
      </div>

      <Modal
        title="新建项目"
        open={createModalVisible}
        onOk={handleCreateProject}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="项目名称"
            name="projectName"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


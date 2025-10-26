import { ProFormProps } from '@ant-design/pro-components';
import { useMemo } from 'react';

export const useFormCommonProps = () => {
  const formProps = useMemo(() => {
    const formProps: Partial<ProFormProps<any>> = {
      grid: true,
      rowProps: {
        gutter: [48, 0],
      },
      // colProps: { md: 12, xl: 8, xxl: 6 },
      colProps: { md: 12, xl: 6, xxl: 6 },
      // colProps: { md: 6 },
      submitter: {
        render: () => null,
      },
      labelCol: {
        flex: 'none',
      },
    };

    return formProps;
  }, []);

  return { formProps };
};

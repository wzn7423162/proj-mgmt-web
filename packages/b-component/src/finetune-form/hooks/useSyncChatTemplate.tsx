import { FormInstance } from 'antd';
import { useEffect } from 'react';

export const useSyncChatTemplate = (params: {
  chatTemplate?: string;
  setFullFormData: (data: Record<any, any>) => any;
  trainingForm: FormInstance;
}) => {
  const { chatTemplate, trainingForm, setFullFormData } = params;

  useEffect(() => {
    if (!chatTemplate) return;

    setFullFormData({ template: chatTemplate });
    trainingForm.setFieldValue('template', chatTemplate);
  }, [chatTemplate]);
};

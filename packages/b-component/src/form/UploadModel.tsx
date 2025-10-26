import React, { useCallback, useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { message, Button, Upload as AntdUpload , Flex} from 'antd';

const { Dragger,  } = AntdUpload;
import { AuthUtils } from '@llama-fa/utils'
import s from './UploadModel.module.scss';

export interface IUploadModelProps {
    id?: string;
    value?: Object;
    onChange?: (value?: Object) => void;
    
    baseModel: string;
    scene: string;
    
    multiple?: boolean;
    disabled?: boolean;

    onError?: (res: any) => void;

    ext?: string[];
    accept?: string;
}
export const UploadModel = React.memo<IUploadModelProps>(({ 
    id, value, onChange,

    multiple = false, disabled,
    baseModel, scene,
    onError,
    accept = '.safetensors,.zip,.rar',
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const uploadApiUrl = (process.env.NODE_ENV === 'development' ? '/api' : '') + '/front/sftp/uploadModel';
    const token = AuthUtils.getToken();

    const triggerChange = (changedValue?: Object) => {
        onChange?.(changedValue);
    };
    useEffect(() => { 
        setFileList([]);
        triggerChange();
    }, [baseModel, scene]);

    const handleChange = useCallback((info: any) => {
        const { status, response } = info.file;
        // info.file.percent 当前进度
        console.log('onChange', info.file, info.fileList);
        if (status === 'uploading') {
            setFileList([info.file]);
        } else if (status === 'done') {
            // 这里再处理接口响应错误
            const { data, code, message: msg } = response;
            if (code == 1001) {
                triggerChange(data);
                setFileList([info.file]);
            } else {
                onError && onError(response) || message.error(msg);;
                setFileList([]);
                triggerChange();
            }
        } else if (status === 'error') {
            // message.error(`${info.file.name} 上传失败`);
            onError && onError(response);
            setFileList([]);
        } else if (status == "removed") {
            setFileList([]);
            triggerChange();
        }
    }, [])
    const props: UploadProps = {
        name: 'file',
        rootClassName: s.upload_model,
        multiple,
        disabled,
        maxCount: 1,
        accept,
        action: uploadApiUrl,
        fileList,
        data: {
            baseModel,
            scene,
        },
        headers: {
            FrontToken: `Bearer ${token}`
        },
        onChange: handleChange,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return <Dragger {...props}>
        <Flex align='center' justify='center'>
            <UploadOutlined style={{color: '#fff', fontSize: '18px', marginRight: '10px'}} /> 上传模型文件
        </Flex>
        <div style={{ color: '#95a3aa' }}>
          拖拽文件到此处或<Button type='link' disabled={disabled}>点击上传</Button>
        </div>
        <div className={s['upload_model_tip']}>.zip、.rar压缩文件内需要在一级目录内包含.safetensors文件</div>
    </Dragger>
})
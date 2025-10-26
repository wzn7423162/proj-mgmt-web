import { FileImage } from '../file-image/FileImage';
import { Modal } from 'antd';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { isImageFile } from '@llama-fa/utils';

const PreviewContainer = ({ imgUrl, onClose }: { imgUrl: string; onClose: () => void }) => {
  if (imgUrl) {
    return createPortal(
      <FileImage
        preview={{
          visible: true,
          onVisibleChange: (value) => {
            if (!value) {
              onClose();
            }
          },
        }}
        imgUrl={imgUrl}
        width="100%"
        height="auto"
      />,
      document.body
    );
  }

  // return createPortal(
  //   <Modal title={fileMeta.name} open={true} onCancel={onClose} footer={null}>
  //     <p>文件类型：{fileMeta.type}</p>
  //     <p>文件大小：{fileMeta.size} bytes</p>
  //   </Modal>,
  //   document.body
  // );
};

export class FilePreview {
  private static container: HTMLDivElement | null = null;
  private static root: ReturnType<typeof createRoot> | null = null;

  static show(params: { fileMeta?: File; imgUrl: string }) {
    const { fileMeta, imgUrl } = params;
    // 如果已经存在预览，先关闭
    this.close();

    // 创建新的预览
    this.container = document.createElement('div');
    this.root = createRoot(this.container);
    document.body.appendChild(this.container);

    this.root.render(<PreviewContainer imgUrl={imgUrl} onClose={() => this.close()} />);
  }

  static close() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

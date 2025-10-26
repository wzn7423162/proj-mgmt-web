import React, { FC, memo, useRef, useEffect, forwardRef, useState } from 'react';
// import FluentEditor from '@opentiny/fluent-editor';
import '@opentiny/fluent-editor/style.css';
import './Rich.global.css';
import FluentEditor from '@opentiny/fluent-editor';
import { reqClient } from '@llama-fa/utils';
import { message } from 'antd';
import { IUploadFile } from '@llama-fa/types';
import Quill, { Delta } from 'quill';
import { CustomImageBlot } from './blot/CustomImageBlot';
import styles from './Rich.module.scss';
export interface ILRichProps {
  value?: string;
  onChange?: (content: string) => void;
  height?: number | string;
  readOnly?: boolean;
  placeholder?: string;
  theme?: 'snow' | 'bubble';
  className?: string;
  style?: React.CSSProperties;
  options?: Record<string, any>;
  isBackend?: boolean;
  dataColorMode?: 'light' | 'dark';
}

export interface ILRichRef {
  getContent: () => string;
  setContent: (content: string) => void;
  clear: () => void;
  focus: () => void;
  // getEditor: () => FluentEditor | null;
  getText: () => string;
}
Quill.register(CustomImageBlot);

const TOOLBAR_CONFIG = [
  ['undo', 'redo'],
  [
    { header: [1, 2, 3, 4, 5, 6, false] },
    { size: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px'] },
  ],
  ['bold', 'italic', 'strike', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  // [{ direction: 'rtl' }],
  ['link', 'blockquote'],
  ['image'],
];
// Quill.register(CustomImageBlot);

const maxLength = 10000;

export const LRich = memo(
  forwardRef<ILRichRef, ILRichProps>((props, ref) => {
    const {
      value = '',
      onChange,
      height = 300,
      readOnly = false,
      placeholder = '请输入内容...',
      theme = 'snow',
      className,
      style,
      options = {},
      isBackend,
      // 深色默认
      dataColorMode = 'dark',
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<FluentEditor | null>();
    const editorId = useRef(
      `fluent-editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    );

    useEffect(() => {
      if (containerRef.current && !editor) {
        // 创建编辑器配置
        const editorConfig = {
          theme,
          readOnly,
          placeholder,
          ...options,
        };

        import('@opentiny/fluent-editor').then((md) => {
          const FluentEditor = md.default;
          const Delta = FluentEditor.import('delta');

          const ed = new FluentEditor(`#${editorId.current}`, {
            ...editorConfig,
            placeholder,

            modules: {
              counter: {
                count: maxLength,
                template: (current: number) => {
                  return `${current} / ${maxLength}`;
                },
                errorTemplate: (current: number) => {
                  return `${current} / ${maxLength}`;
                },
              },
              toolbar: TOOLBAR_CONFIG,
              uploader: {
                // 只允许图片文件 PNG、JPG、JPEG、BMP、GIF、WEBP
                mimetypes: [
                  'image/png',
                  'image/jpeg',
                  'image/jpg',
                  'image/bmp',
                  'image/gif',
                  'image/webp',
                ],
                maxSize: 1024 * 1024 * 20,
                // 文件上传处理器
                async handler(range: any, files: File[]) {
                  console.log('开始上传文件:', files);

                  // 处理多个文件上传
                  const uploadPromises = files.map(async (file) => {
                    try {
                      // 使用项目中的 reqClient.upload 方法上传文件
                      const response = await reqClient.upload<IUploadFile>(
                        isBackend ? '/backend/upload/img' : '/front/upload/img', // 替换为实际的上传接口路径
                        {}, // 额外的表单数据
                        file,
                        {
                          extra: {
                            name: 'file'
                          }
                        }
                      );

                      return {
                        success: true,
                        url: response.fullPath,
                        file,
                      };
                    } catch (error) {
                      console.error('文件上传失败:', error);
                      return {
                        success: false,
                        error,
                        file,
                      };
                    }
                  });

                  // 等待所有文件上传完成
                  const results = await Promise.all(uploadPromises);
                  console.log('q=>results', results);
                  // 处理上传结果
                  results.forEach((result, index) => {
                    const currentRange = {
                      index: range.index + index,
                      length: 1,
                    };

                    if (result.success) {
                      // 上传成功，插入图片
                      this.quill.updateContents(
                        new Delta().retain(currentRange.index).delete(1).insert({
                          image: result.url,
                        })
                      );
                      message.success(`图片 ${result.file.name} 上传成功`);
                    } else {
                      // 上传失败，移除占位符
                      this.quill.updateContents(new Delta().retain(currentRange.index).delete(1));
                      message.error(`图片 ${result.file.name} 上传失败`);
                    }
                  });
                },
                // 上传失败回调（这个方法在使用 handler 时可能不会被调用）
                fail(file: File, range: any) {
                  console.log('上传失败回调:', file);
                  // 移除失败的占位符
                  this.quill.updateContents(new Delta().retain(range.index).delete(1));
                  message.error(`图片 ${file.name} 上传失败`);
                },
              },
            },
          });

          // 设置初始placeholder状态
          setTimeout(() => {
            const editorElement = ed.root;
            if (editorElement) {
              const text = ed.getText().trim();
              if (!text) {
                editorElement.classList.add('ql-blank');
              }
              // 设置placeholder属性
              editorElement.setAttribute('data-placeholder', placeholder);
            }
          }, 0);

          setEditor(ed);
        });
      }
    }, []);

    // 初始化编辑器
    useEffect(() => {
      if (!editor) {
        return;
      }

      editor.root.innerHTML = value;

      // 监听内容变化
      editor.on('text-change', (delta: Delta, oldDelta: Delta, source: string) => {
        if (!editor) return;

        const editorElement = editor.root as HTMLElement;
        const plainLen = editorElement.innerText.replace(/[\r\n]+/g, '').length;

        if (plainLen > maxLength && source === 'user') {
          const retain = (delta.ops?.[0]?.retain || 0) as number;
          const insert = delta.ops.reduce((acc, op) => {
            if (typeof op.insert === 'string') {
              acc += op.insert;
            }
            return acc;
          }, '');

          const insertLen = insert.length;
          // 允许插入的长度
          const allowedInsertLen = maxLength - (plainLen - insertLen);

          editor.deleteText(retain + allowedInsertLen, insertLen - allowedInsertLen, 'api');
          requestAnimationFrame(() => {
            if (allowedInsertLen > 0) {
              editor.setSelection(Math.max(retain + allowedInsertLen, 0), 0, 'api');
            } else {
              editor.setSelection(Math.max(retain, 0), 0, 'api');
            }
          });
        }

        // 抛出最新 HTML
        onChange?.(editor.root.innerHTML);
      });

      // 添加中文输入法支持
      const editorElement = editor.root;
      let isComposing = false;

      const handleCompositionStart = () => {
        isComposing = true;
        // 中文输入开始时隐藏placeholder
        if (editorElement.classList.contains('ql-blank')) {
          editorElement.classList.remove('ql-blank');
        }
      };

      const handleCompositionEnd = () => {
        isComposing = false;
        // 中文输入结束后检查内容，如果为空则显示placeholder
        setTimeout(() => {
          const text = editor.getText().trim();
          if (!text) {
            editorElement.classList.add('ql-blank');
          }
        }, 0);
      };

      const handleInput = () => {
        if (!isComposing) {
          const text = editor.getText().trim();
          if (text) {
            editorElement.classList.remove('ql-blank');
          } else {
            editorElement.classList.add('ql-blank');
          }
        }
      };

      // 添加事件监听
      editorElement.addEventListener('compositionstart', handleCompositionStart);
      editorElement.addEventListener('compositionend', handleCompositionEnd);
      editorElement.addEventListener('input', handleInput);

      // 清理函数
      return () => {
        if (editor) {
          editorElement.removeEventListener('compositionstart', handleCompositionStart);
          editorElement.removeEventListener('compositionend', handleCompositionEnd);
          editorElement.removeEventListener('input', handleInput);
        }
      };
    }, [editor]);

    // 监听 value 变化
    useEffect(() => {
      if (editor && value !== undefined) {
        const currentContent = editor.root.innerHTML;
        if (currentContent !== value) {
          editor.root.innerHTML = value;

          // 更新placeholder状态
          setTimeout(() => {
            const text = editor.getText().trim();
            const editorElement = editor.root;
            if (text) {
              editorElement.classList.remove('ql-blank');
            } else {
              editorElement.classList.add('ql-blank');
            }
          }, 0);
        }
      }
    }, [value, editor]);

    // 监听只读状态变化
    useEffect(() => {
      if (editor) {
        editor.enable(!readOnly);
      }
    }, [readOnly]);

    // 监听placeholder变化
    useEffect(() => {
      if (editor && editor.root) {
        const editorElement = editor.root;
        // 更新placeholder属性
        editorElement.setAttribute('data-placeholder', placeholder);

        // 如果编辑器为空，触发placeholder显示
        const text = editor.getText().trim();
        if (!text) {
          editorElement.classList.add('ql-blank');
        }
      }
    }, [placeholder, editor]);

    // 暴露给父组件的方法
    // useImperativeHandle(
    //   ref,
    //   () => ({
    //     getContent: () => {
    //       return editorRef.current?.getHTML() || '';
    //     },
    //     setContent: (content: string) => {
    //       editorRef.current?.setContents(content);
    //     },
    //     clear: () => {
    //       editorRef.current?.setContents('');
    //     },
    //     focus: () => {
    //       editorRef.current?.focus();
    //     },
    //     getEditor: () => {
    //       return editorRef.current;
    //     },
    //     getText: () => {
    //       return editorRef.current?.getText() || '';
    //     },
    //   }),
    //   []
    // );

    return (
      <div
        className={`${styles.fluentEditor} ${className || ''}`}
        data-color-mode={dataColorMode}
        style={style}
      >
        <div
          ref={containerRef}
          id={editorId.current}
          style={{ minHeight: '200px' }}
        />
      </div>
    );
  })
);

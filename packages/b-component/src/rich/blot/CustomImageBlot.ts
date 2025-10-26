import Quill from 'quill';

const ImageBlot = Quill.import('formats/image') as any;

export class CustomImageBlot extends ImageBlot {
  static create(value: any) {
    const node = super.create(value.image || value);
    node.setAttribute('src', value.image || value);
    if (value['alt']) node.setAttribute('alt', value['alt']);
    if (value['data-id']) node.setAttribute('data-id', value['data-id']);
    if (value['data-image-id']) node.setAttribute('data-image-id', value['data-image-id']);
    return node;
  }

  static value(node: any) {
    return {
      'image': node.getAttribute('src'),
      'alt': node.getAttribute('alt'),
      'data-id': node.getAttribute('data-id'),
      'data-image-id': node.getAttribute('data-image-id'),
    };
  }
}

CustomImageBlot.blotName = 'image';
CustomImageBlot.tagName = 'IMG';

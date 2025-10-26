import { Segmented, Slider, theme } from 'antd';

export enum EThemeMode {
  Light = 'Light',
  Dark = 'Dark',
}

// Ant Design 主题配置
export const DarkTheme = {
  // 基础主题设置为深色模式
  algorithm: theme.darkAlgorithm,
  token: {
    colorTextSecondary: '#fff',
    colorBgContainer: '#101317',
  },
  components: {
    Slider: {
      handleActiveColor: '#ffffff',
      handleLineWidth: 1,
      handleLineWidthHover: 1.5,
      railSize: 6,
      handleColor: '#fff',
      railBg: '#2C323D',
      railHoverBg: '#2C323D',
      // trackBg: '#2A69FF',
      // trackHoverBg: '#2A69FF',
    },
    Segmented: {
      trackBg: '#191D24',
      itemSelectedBg: '#2C323D',
      trackPadding: 3,
      // trackHoverBg: '#2A69FF',
    },

    Menu: {
      itemColor: '#95A3AA',
      subMenuItemSelectedColor: '#95A3AA',

      itemSelectedColor: '#fff',
      itemSelectedBg: '#222930',
    },
  },
};

export const DefaultTheme = {
  components: {
    Button: {},
    Select: {},
    Menu: {},
  },
  hashed: false,
};

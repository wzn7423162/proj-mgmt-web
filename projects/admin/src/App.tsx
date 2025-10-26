import 'antd/dist/reset.css';
import '@llama-fa/constants/styles/index.scss';
import 'dayjs/locale/zh-cn';
import './App.scss';

import { RouterProvider } from 'react-router';
import { WrapperProvider } from '@llama-fa/component/provider';
import { routerHelper } from './routers/hashRoutes';

function App() {
  return (
    <WrapperProvider>
      <RouterProvider router={routerHelper.router} />
    </WrapperProvider>
  );
}

export default App;


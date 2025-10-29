import 'antd/dist/reset.css';
import '@llama-fa/constants/styles/index.scss';
import 'dayjs/locale/zh-cn';
import './App.scss';

import { RouterProvider } from 'react-router';
import { WrapperProvider } from '@llama-fa/component/provider';
import { GlobalProvider } from './context/GlobalContext';
import { routerHelper } from './routers/hashRoutes';

function App() {
  return (
    <WrapperProvider>
      <GlobalProvider>
        <RouterProvider router={routerHelper.router} />
      </GlobalProvider>
    </WrapperProvider>
  );
}

export default App;


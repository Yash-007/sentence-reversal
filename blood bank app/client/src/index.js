import React from 'react';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Provider store={store}>
  <ConfigProvider 
  theme={{
       token:{
        colorPrimary:"#873E3E",
        colorBorder: "#873E3E",
       }
  }}
  >
    <App />
  </ConfigProvider>
</Provider>
);

reportWebVitals();

import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // for bootstrap
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



import { BrowserRouter, Router } from 'react-router-dom'; // 신규생성됨.

const root = ReactDOM.createRoot(document.getElementById('root'));

// StrictMode 코드 삭제 
// 개발중에 발생하는 문자를 추가로 감지하기 위해 rendering을 두번 수행해 콘솔 두번찍히게 함.
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

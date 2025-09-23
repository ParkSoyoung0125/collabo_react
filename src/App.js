
import './App.css';


// 분리된 리액트 컴포넌트 import
import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const appName = "IT Academy Coffee Shop";

  // user : 로그인한 사람의 정보를 저장하고 있는 state
  // 클라이언트에서 사용자 정보를 저장하기 위헤 localStorage를 사룔
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loginUser = localStorage.getItem('user');
    /* localStorage.getItem('user')의 반환값 
    - 키 존재 시 문자열 (예: {"id":1,"name":"Tom"})
    - 키 없을 시 null */
    setUser(JSON.parse(loginUser));
  }, []);  // 2번째 매개변수가 empty array 이므로, 1 번만 rendering하면 됨.


  const handleLoginSuccess = (userData) => {
    // userData : LoginPage.js에서 반환받은 member 정보
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('로그인 성공');
  }

  const navigate = useNavigate();

  // 로그인한 사용자가 '로그 아웃' 버튼을 클릭했습니다.
  const handleLogout = (event) => {
    event.preventDefault();

    setUser(null);
    localStorage.removeItem('user');
    console.log('로그 아웃 성공');
    navigate(`/member/login`);
  };

  return (
    <>
      <MenuItems appName={appName} user={user} handleLogout={handleLogout} />

      {/* 분리된 라우터 정보 */}
      <AppRoutes user={user} handleLoginSuccess={handleLoginSuccess} />


      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p>&copy;2025 {appName}.All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Home from './../pages/Home';
import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';
import Element from './../pages/Element';
import ElementList from './../pages/ElementList';
import SignupPage from './../pages/SignupPage';
import LoginPage from './../pages/LoginPage';
import ProductList from './../pages/ProductList';


// 이 파일은 라우팅 정보를 담고있는 파일임.
// 이런 파일(작성중인 지금 파일)을 네트워크에서는 routing table이라고 함.
function App({ user, handleLoginSuccess }) {
    // user : 사용자 정보를 저장하고 있는 객체
    // handleLoginSuccess : 로그인 성공시 동작할 액션
    return (
        <Routes>
            {/* path 프롭스는 요청정보 url, element 프롭스는 컴포넌트 이름 */}
            <Route path='/' element={<Home />} />
            <Route path='/fruit' element={<FruitOne />} />
            <Route path='/fruit/list' element={<FruitList />} />
            <Route path='/element' element={<Element />} />
            <Route path='/element/list' element={<ElementList />} />

            {/* 로그인 여부에 따라 상품 목록 페이지가 다르게 보여야하므로 user 프롭스를 넘김 */}
            <Route path='/product/list' element={<ProductList user={user} />} />

            <Route path='/member/signup' element={<SignupPage />} />

            <Route path='/member/login' element={<LoginPage setUser={handleLoginSuccess} />} />

        </Routes>
    );
}

export default App;
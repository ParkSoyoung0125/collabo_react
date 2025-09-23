import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅.
import { useNavigate } from 'react-router-dom';

function App({ appName, user, handleLogout }) {
    const navigate = useNavigate();

    // user 프롭스를 사용해 상단에 보이는 폴다운 메뉴를 적절히 분기처리함.
    const renderMenu = () => {
        /* 
        user?.role : 자바 스크립트의 optional chaining 문법
        user가 null이면 undefined로 변환해주고, 오류 메세지를 별도로 반환하지 않음.
        */
        switch (user?.role) {
            case 'ADMIN':
                return (
                    <>
                        <Nav.Link onClick={() => navigate(``)}>상품등록</Nav.Link>
                        <Nav.Link onClick={handleLogout}>로그 아웃</Nav.Link>
                    </>
                );
            case 'USER':
                return (
                    <>
                        <Nav.Link onClick={() => navigate(``)}>장바구니</Nav.Link>
                        <Nav.Link onClick={() => navigate(``)}>주문 내역</Nav.Link>
                        <Nav.Link onClick={handleLogout}>로그 아웃</Nav.Link>
                    </>
                );
            default:
                return (
                    <>
                        <Nav.Link onClick={() => navigate(`/member/signup`)}>회원가입</Nav.Link>
                        <Nav.Link onClick={() => navigate(`/member/login`)}>로그인</Nav.Link>
                    </>
                );
        }
    }

    return (
        <Navbar bg="dark" variant='dark' expand="lg">
            <Container>
                <Navbar.Brand href='/'>{appName}</Navbar.Brand>
                <Nav className='me-auto'>
                    {/* 하이퍼링크 : Nav.Link는 다른페이지로 이동할 때 사용됨. */}
                    <Nav.Link onClick={() => navigate(`/product/list`)}>상품 보기</Nav.Link>

                    {/* USER에 따른 분기된 메뉴를 RENDERING */}
                    {renderMenu()}

                    <NavDropdown title={`기본 연습`}>
                        <NavDropdown.Item onClick={() => navigate(`/fruit`)}>과일 1개</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/fruit/list`)}>과일 여러개</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={`기본 실습`}>
                        <NavDropdown.Item onClick={() => navigate(`/element`)}>요소 1개</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/element/list`)}>요소 여러개</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>


    );
}

export default App;
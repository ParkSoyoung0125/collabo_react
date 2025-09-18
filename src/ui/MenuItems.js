import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅.
import { useNavigate } from 'react-router-dom';

function App({ appName }) {
    const navigate = useNavigate();
    return (
        <Navbar bg="dark" variant='dark' expand="lg">
            <Container>
                <Navbar.Brand href='/'>{appName}</Navbar.Brand>
                <Nav className='me-auto'>
                    <Nav.Link>상품 보기</Nav.Link>
                    <Nav.Link onClick={() => navigate(`/member/signup`)}>회원가입</Nav.Link>
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
import axios from "axios";
import { useState } from "react";
import { Card, Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";

function App({ setUser }) {
    // setUser : 사용자 정보를 저장하기 위한 setter 메소드

    // 로그인 관련 state 정의
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /// 오류 메시지 관련 state 정의
    const [errors, setErrors] = useState('');

    const navigate = useNavigate('');

    const LoginAction = async (event) => { // 로그인과 관련된 이벤트 처리 함수
        event.preventDefault();
        try {
            const url = `${API_BASE_URL}/member/login`;
            // const parameters = { email, password };

            // // 스프링부트가 넘겨주는 정보는 Map<String, Object> 타입입니다.
            // const response = await axios.post(url, parameters);

            // axios는 기본값으로 json 형식을 전송하지만, Spring Security가 이를 처리하지 못함.
            // 대신 form-unlencoded 타입으로 전송해줘야 함.
            // URLSearchParams는 자바스크립트에서 QueryString을 다루기 위한 내장 객체.
            const parameters = new URLSearchParams();
            parameters.append('email', email);
            parameters.append('password', password);

            // 스프링부트가 넘겨주는 정보는 Map<String Object> 타입임.
            const response = await axios.post(url, parameters, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true // 세션 기반 인증 시에 필수
            });

            // message에는 '로그인 성공 여부'를 알리는 내용,member에는 로그인 한 사람의 객체 정보가 반환.
            const { message, member } = response.data;

            if (message === 'success') { // 자바에서 Map.put("message","success")로 코딩
                console.log('로그인 한 사람의 정보');
                console.log(member);

                // 로그인 성공시 사용자 정보를 어딘가에 저장해야함.
                setUser(member);

                navigate(`/`); // 로그인 성공 후 홈패 이지로 이동

            } else { // 로그인 실패
                setErrors(message);
            }
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.message || '로그인 실패');
            } else {
                setErrors('Server Error');
            }

        }
    }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Row className="w-100 justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h2 className="text-center mb-4">로그인</h2>

                                {errors && <Alert variant="danger">{errors}</Alert>}

                                <Form onSubmit={LoginAction}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>이메일</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="이메일을 입력해주세요."
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <br />
                                    <Form.Group className="mb-3">
                                        <Form.Label>비밀번호</Form.Label>
                                        <Form.Control
                                            type={"password"}
                                            placeholder="비밀번호를 입력해주세요."
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <br />

                                    <Row className="g-2">
                                        <Col xs={8}>
                                            <Button variant="primary" type="submit" className="w-100">
                                                로그인
                                            </Button>
                                        </Col>
                                        <Col xs={4}>
                                            <Link to={`/member/signup`} className="btn btn-outline-secondary w-100">회원가입</Link>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </>
    );
}

export default App;
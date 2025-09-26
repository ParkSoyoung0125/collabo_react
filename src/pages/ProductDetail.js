/* 
    상품 상세 보기
    전체 화면을 좌우측 1대2로 분리.
    왼쪽은 상품의 이미지 정보, 오른쪽은 상품의 정보 및 '장바구니'와 '구매' 버튼을 만듦.
    */

import { Container, Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function App({ user }) {

    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null); // 백엔드에서 넘어온 상품 정보

    // 로딩 상태를 의미하는 state로, 값이 true면 현재 로딩중
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${API_BASE_URL}/product/detail/${id}`;

        axios.get(url)
            .then((response) => {
                setProduct(response.data);
                setLoading(false); // 상품 정보를 읽어옴.
            })
            .catch((error) => {
                console.log(error);
                alert('상품 정보를 불러오는 중에 오류가 발생하였습니다.');
                navigate(-1); // 이전 페이지로 이동하기
            });
    }, [id]);

    // BackEnd에서 읽어오지 못한 경우를 대비한 코당.
    if (loading === true) {
        return (
            <Container className="my-4">
                <h3>
                    상품 정보를 읽어 오는 중입니다.
                </h3>
            </Container>
        );
    }

    // 상품정보가 없는 경우를 대비한 코당.
    if (!product) {
        return (
            <Container className="my-4">
                <h3>
                    상품 정보가 존재하지 않습니다.
                </h3>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Card>
                <Row className="g-0">
                    {/* 좌측 상품 이미지 */}
                    <Col md={4}>
                        <Card.Img
                            variant="top"
                            src={`${API_BASE_URL}/images/${product.image}`}
                            alt={`${product.name}`}
                            style={{ width: '100%', height: '400px' }}
                            className="mx-auto d-block" />
                    </Col>
                    {/* 우측 상품 정보 및 구매 관련 버튼 */}
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="fs-3">{product.name}</Card.Title>
                            <Table striped>
                                <tbody>
                                    <tr>
                                        <td className="text-center">가격</td>
                                        <td>{product.price}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">카테고리</td>
                                        <td>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">재고</td>
                                        <td>{product.stock}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">상세 설명</td>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">등록일자</td>
                                        <td>{product.inputdate}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            {/* 구매 수량 입력란 */}
                            {/* as={Row}는 렌더링 시 기본값인 <div>말고 Row로 렌더링해줌. */}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Col xs={3} className="text-center">
                                    <strong>구매수량</strong>
                                </Col>
                                <Col xs={5}>
                                    {/* 구매 수량은 최소 1 이상으로 설정, user 모드에 따라 분기 코딩함 */}
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        disabled={!user}
                                    />
                                </Col>
                            </Form.Group>

                            {/* 버튼(이전목록, 장바구니, 구매하기) */}
                            <div className="d-flex justify-content-center m">
                                <Button variant="primary" className="me-3 px-4" href="/product/list">
                                    이전 목록
                                </Button>
                                <Button variant="light" style={{ border: "1px solid black" }} className="me-3 px-4">
                                    장바구니
                                </Button>
                                <Button variant="success" className="me-3 px-4">
                                    구매하기
                                </Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default App;
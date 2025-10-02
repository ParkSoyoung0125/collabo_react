import { useEffect, useState } from "react";
import { Container, Table, Form, Spinner, Alert, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import axios from "axios";

function App({ user }) {
    // loading이 true이면 현재 데이터를 읽고 있는 중임.
    const [loading, setLoading] = useState(true);

    // 오류 정보를 저장할 스테이트
    const [error, setError] = useState('');

    // 주문 목록들을 저장할 스테이트(초기 값 : 빈 배열)
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    // 다음 hook은 사용자 정보 user가 변경될 때 마다 rerendering 됨.
    useEffect(() => {
        if (!user) {
            setError('로그인이 필요합니다.');
            setLoading(false);
        }

        // 스프링 부트의 OrderController의 gerOrderList() 메소드 참조
        const fetchOrders = async () => {
            try {
                const url = `${API_BASE_URL}/order/list`;

                // GET 방식은 파라미터를 넘길 때, params라는 키를 사용하여 넘겨야 한다.
                // 여기서 role은 관리자 유무를 판단하기 위해 넘겨줌.
                const parameters = {
                    params: {
                        memberId: user.id,
                        role: user.role
                    }
                };

                const response = await axios.get(url, parameters);
                setOrders(response.data);

            } catch (error) {
                setError('주문 목록을 불러오는 데에 실패하였습니다.');
                console.log(error);
            } finally {
                setLoading(false);
            };
        };

        fetchOrders(); // 함수 호출

    }, [user]);



    // 관리자를 위한 컴포넌트, 함수
    const makeAdminButton = (bean) => {
        if (user?.role !== "ADMIN" && user?.role !== "USER") return null;
        // if (!["ADMIN", "USER"].includes(user?.role)) return null;

        // 완료 버튼을 클릭해 'PENDING'모드를 'COMPLETED' 모드로 변경함
        const changeStatus = async (newStatus) => {
            try {
                const url = `${API_BASE_URL}/order/update/status/${bean.orderId}?status=${newStatus}`;
                await axios.put(url);

                alert(`송장 번호 ${bean.orderId}의 주문 상태가 ${newStatus}으로 변경되었습니다.`);

                // `COMPLETED` 모드로 변경되고 나면, 화면에 안보임
                // bean.orderId와 동일하지 않은 항목들만 다시 rerendering함
                setOrders((previous) =>
                    previous.filter((order) => order.orderId !== bean.orderId)
                );
            } catch (error) {
                console.log(error);
                alert('주문 완료에 실패하였습니다.');
            }
        };

        // 취소 버튼을 클릭해 '대기 상태'인 주문 내역을 취소함.
        const orderCancle = async () => {
            try {
                const url = `${API_BASE_URL}/order/delete/${bean.orderId}`;
                await axios.delete(url);

                alert(`송장 번호 ${bean.orderId}의 주문이 취소되었습니다.`);

                // bean.orderId와 동일하지 않은 항목들만 다시 rerendering함
                setOrders((previous) =>
                    previous.filter((order) => order.orderId !== bean.orderId)
                );
            } catch (error) {
                console.log(error);
                alert('주문 취소에 실패하였습니다.');
            }
        }

        return (
            <div>
                {/* 완료 버튼은 관리자만 볼 수 있음 */}
                {user?.role === 'ADMIN' && (
                    <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => changeStatus('COMPLETED')}
                    >
                        완료
                    </Button>
                )}

                <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => orderCancle()}
                >
                    취소
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">주문 목록을 불러오는 중입니다.</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }


    return (
        <Container className="my-4">
            <h1 className="my-4">주문 내역</h1>

            {orders.length === 0 ? (
                <Alert variant="secondary">주문 내역이 없습니다.</Alert>
            ) : (<>
                <h5>현재까지 {orders.length} 개를 주문하셨습니다.</h5>
                <Row>
                    {orders.map((bean) => (
                        <Col key={bean.orderId} md={6} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>주문 번호 : {bean.orderId}</Card.Title>
                                        <small className="text-muted">{bean.orderDate}</small>
                                    </div>
                                    <Card.Text>
                                        상태 : <strong>{bean.status}</strong>
                                    </Card.Text>
                                    <ul style={{ paddingLeft: "20px" }}>
                                        {bean.orderItems.map((item, index) => (
                                            <li key={index}>{item.productName}({item.quantity}개)</li>
                                        ))}
                                    </ul>
                                    {/* 관리자 전용 버튼 생성 */}
                                    {makeAdminButton(bean)}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </>
            )}

        </Container>
    );
}

export default App;
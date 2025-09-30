import { useEffect, useState } from "react";
import { Container, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import axios from "axios";

function App({ user }) {
    const thStyle = { fontSize: '1.2rem' }; // 테이블 헤더 스타일
    const [orderList, setOrderList] = useState([]); // 나열할 주문 내역 리스트
    const navigate = useNavigate();


    const toggleAllCheckBox = (isAllCheck) => {
        // isAllCheck : `전체 선택` 체크 박스의 boolean 값
        setOrderList((previous) => {
            // 모든 객체(카트 상품)들의 나머지 속성은 보존하고, 체크 상태(checked)를 
            // `전체 선택` 체크 상태와 동일하게 설정합니다.
            const updatedProducts = previous.map((product) => ({
                ...product,
                checked: isAllCheck
            }));

            return updatedProducts;
        });
    };

    useEffect(() => {
        if (user && user?.id) {
            totalOrderList();
        }
    }, [user]);

    // 테이블에 주문 내역 리스트 배열하기
    const totalOrderList = async (or) => {

        try {
            const url = `${API_BASE_URL}/order/orderList`;
            const response = await axios.post(url);

            setOrderList(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // 체크 박스 선택 후 삭제 시 주문 내역 삭제



    return (
        <Container className="mt-4">
            <h2 className="mb-4">주문 내역</h2>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th style={{ ...thStyle, width: '20%' }}>
                            {/* `전체 선택` 체크 박스의 체크 상태(boolean)를 toggleAllCheckBox 함수에 전달 */}
                            <Form.Check
                                type="checkbox"
                                label="전체 선택"
                                onChange={(event) => toggleAllCheckBox(event.target.checked)}
                            />
                        </th>
                        <th style={thStyle}>구매 내역</th>
                        <th style={thStyle}>구매 금액</th>
                        <th style={thStyle}>구매일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>

                        </td>
                    </tr>
                </tbody>

            </Table>
        </Container>
    );
}

export default App;
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Image, Table, Form } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function App({ user }) {
    const thStyle = { fontSize: '1.2rem' }; // 테이블 헤더 스타일


    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                <span style={{ color: 'blue', fontSize: '2rem' }}>{user?.name}</span>
                <span style={{ color: 'blue', fontSize: '2rem' }}>님의 장바구니</span>
            </h2>

            <Table striped bordered>
                <thead>
                    <tr>
                        <th style={thStyle}>
                            <Form.Check
                                type="checkbox"
                                label="전체 선택"
                                onChange={``}
                            />

                        </th>
                        <th style={thStyle}>상품정보</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>xx</td>
                    </tr>
                </tbody>
            </Table>
            {/* text-start : 좌측 정렬 / text-center : 가운데 정렬 /text-end : 우측 정렬 */}
            <h3 className="text-end mt-3">총 주문 금액 : 0원</h3>
            <div className="text-end">
                <Button variant="primary" size="lg" onClick={``}>
                    주문하기
                </Button>
            </div>
        </Container>
    );
}

export default App;
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";

function App() {
    const [element, setElement] = useState({});

    useEffect(() => {
        const url = `${API_BASE_URL}/element`;
        axios.get(url, {})
            .then((response) => {
                setElement(response.data);
            }, []);
    });
    return (
        <>
            <Table hover style={{ margin: '5px' }}>
                <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>{Number(element.id)}</td>
                    </tr>
                    <tr>
                        <td>상품명</td>
                        <td>{element.name}</td>
                    </tr>
                    <tr>
                        <td>가격</td>
                        <td>{Number(element.price).toLocaleString()} 원</td>
                    </tr>
                    <tr>
                        <td>카테고리</td>
                        <td>{element.category}</td>
                    </tr>
                    <tr>
                        <td>재고</td>
                        <td>{Number(element.stock)} 개</td>
                    </tr>
                    <tr>
                        <td>상세정보</td>
                        <td>{element.description}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}

export default App;
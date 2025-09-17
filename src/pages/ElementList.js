import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";

function App() {
    const [elementList, setElementList] = useState([]);

    useEffect(() => {
        const url = `${API_BASE_URL}/element/list`;
        axios.get(url, {})
            .then((response) => {
                setElementList(response.data);
            }, []);
    });

    const elementListTable = elementList.map((getElement) => (
        <tr key={getElement.id}>
            <td>{Number(getElement.id)}</td>
            <td style={{ width: '10%' }}>{getElement.name}</td>
            <td style={{ width: '10%' }}>{Number(getElement.price).toLocaleString()} 원</td>
            <td>{getElement.category}</td>
            <td style={{ width: '5%' }}>{Number(getElement.stock)}</td>
            <td>{getElement.description}</td>
        </tr>
    ));


    return (
        <>
            <Table>
                <tbody>
                    <tr>
                        <th>아이디</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>카테고리</th>
                        <th>재고</th>
                        <th>상세정보</th>
                    </tr>
                    {elementListTable}
                </tbody>
            </Table>
        </>
    );
}

export default App;
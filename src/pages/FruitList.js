import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Table } from "react-bootstrap";


function App() {

    const [FruitList, setFruitList] = useState([]);

    useEffect(() => {
        const url = `${API_BASE_URL}/fruit/list`;

        axios.get(url, {})
            .then((response) => {
                console.log(response.data);
                setFruitList(response.data);
            });
    }, []);

    const fruitListTable = FruitList.map((fruit) => (
        <tr key={fruit.id}>
            <td>{fruit.id}</td>
            <td>{fruit.name}</td>
            <td>{Number(fruit.price).toLocaleString()} 원</td>
        </tr>
    ));

    return (
        <>
            <Table hover style={{ margin: '5px' }}>
                <tbody>
                    <tr>
                        <th>아이디</th>
                        <th>상품명</th>
                        <th>단가</th>
                    </tr>
                    {fruitListTable}
                </tbody>
            </Table>
        </>
    );
}

export default App;
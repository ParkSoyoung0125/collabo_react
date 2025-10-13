import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Link, StaticRouterProvider, useNavigate } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';


/* 
step 01
상품 목록을 상품 아이디 역순으로 읽어서 화면 전체에 보여줌.
=>> 하나의 행에 3개의 열씩 보여줌.
=>> 필드 검색과 페이징 기능은 구현하지않음.

step 02
사용자 정보가 'ADMIN'이면, 등록/수정/삭제 버튼이 보이게 코딩
삭제 버튼에 대한 기능 구현
*/


function App({ user }) {
    // 스프링에서 넘겨받은 상품목록 state
    const [products, setProducts] = useState([]);

    // 페이징과 관련된 state를 정의함.
    const [paging, setPaging] = useState({
        // 변수 정의
        totalElements: 0, // 전체 데이터 개수(165개)
        pageSize: 6, // 1페이지에 보여 주는 데이터 개수(6개)
        totalPages: 0, // 전체 페이지 개수(28페이지)
        pageNumber: 0, // 현재 페이지 번호(20페이지)
        pageCount: 10, // 페이지 하단 버튼의 개수(10개)
        beginPage: 0, // 페이징 시작 번호 
        endPage: 0, // 페이징 끝 번호
        pagingStatus: '', // "pageNumber/ totalPages 페이지"
        // 자바의 SearchDto 클래스 연관 필드(field)
        searchDateType: 'all', // 기간 검색 콤보박스
        category: '', // 검색하고자 하는 특정 카테고리 콤보박스
        searchMode: '', // 상품 검색 모드 콤보박스_상품이름(name) 또는 상품설명(description)
        searchKeyword: '', // 검색 키워드 입력 상자
    });

    // 스프링 부트에 "상품목록" 요청하기
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`;
        const parameters = {
            params: {
                pageNumber: paging.pageNumber,
                pageSize: paging.pageSize,
                searchDateType: paging.searchDateType,
                category: paging.category,
                searchMode: paging.searchMode,
                searchKeyword: paging.searchKeyword,
            },
            withCredentials: true
        };

        axios.get(url, parameters)
            .then((response) => {
                console.log('응답받은 데이터');
                // 'response.data'는 에러가 나는 이유 : Spring이 자동으로 상품정보는 "content"라는 배열에 넣었기 때문.
                console.log(response.data.content);
                setProducts(response.data.content || []);

                // 사용자가 paginition 항목을 클릭하였으므로, 페이징 정보를 업데이트 해줘야함.
                // 주의) 0(제로 베이스)이므로 코드작성에 유의
                setPaging((previous) => {
                    const totalElements = response.data.totalElements;
                    const totalPages = response.data.totalPages;
                    const pageNumber = response.data.pageable.pageNumber;

                    // 만약 pageSize의 값이 고정적이라면 할당받지 않아도 됨.
                    // 가변적일 경우에는 반드시 할당받아야 함.

                    const pageSize = response.data.pageable.pageSize;

                    const pageCount = 10; // 고정 값으로 그냥 진행

                    const beginPage = Math.floor(pageNumber / previous.pageCount) * previous.pageCount; // 페이징 시작 번호 
                    const endPage = Math.min(beginPage + previous.pageCount - 1, totalPages - 1); // 페이징 끝 번호

                    // 주의) 0(제로 베이스)이므로 +1을 해주어야 함.
                    const pagingStatus = `${pageNumber + 1}/${totalPages} 페이지`;

                    return {
                        ...previous,
                        totalElements: totalElements,
                        totalPages: totalPages,
                        pageNumber: pageNumber,
                        pageSize: pageSize,
                        beginPage: beginPage,
                        endPage: endPage,
                        pagingStatus: pagingStatus
                    }
                });

            })
            .catch((error) => {
                console.log(error);
            });
    }, [paging.pageNumber, paging.searchDateType, paging.category, paging.searchMode, paging.searchKeyword]);

    const navigate = useNavigate();

    // 관리자 모드일때만 보여주는 메뉴 수정&삭제용 버튼 생성용 함수
    const makeAdminButtons = (item, user, navigate) => {
        if (user?.role !== 'ADMIN') return null;

        return (
            <div className="d-flex justify-content-center">
                <Button variant="warning"
                    className="mb-2"
                    size="sm"
                    onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/product/update/${item.id}`);
                    }}>
                    수정
                </Button>
                &nbsp;
                <Button variant="danger"
                    className="mb-2"
                    size="sm"
                    onClick={async (event) => {
                        event.stopPropagation();

                        const isDelete = window.confirm(`'${item.name} 상품을 삭제하시겠습니까?'`);

                        if (isDelete === false) {
                            alert(`'${item.name} 상품 삭제를 취소했습니다.'`);
                            return;
                        }
                        try {
                            // 상품을 삭제 후 다시 상품 목록 페이지를 보여줌.
                            // 주의) 상품을 삭제하려면 반드시 PK인 상품의 id를 넘겨줘야함.
                            await axios.delete(`${API_BASE_URL}/product/delete/${item.id}`);

                            // alert 함수(modal통신)와 비동기 통신 사용 시, 화면 갱신에 유의해야 함.
                            alert(`'${item.name} 상품이 삭제되었습니다.'`);

                            // 삭제된 id를 배제하고, 상품 목록 state를 다시 갱신
                            setProducts(prev => prev.filter(p => p.id !== item.id));

                            navigate(`/product/list`);
                        } catch (error) {
                            console.log(error)
                            alert(`상품 삭제 실패 : ${error.response?.data || error.message}`)
                        }

                    }}>
                    삭제
                </Button>
            </div>
        );
    }

    return (
        <Container className="my-4">
            <h1>상품 목록 페이지</h1>
            <Link to={'/product/insert'}>
                {user?.role === 'ADMIN' && (
                    <Button variant="primary" className="mb-3">
                        상품등록
                    </Button>
                )}
            </Link>

            {/*  필드 검색 영역 */}
            <Form>
                <Row className="mb-3">
                    <Col md={2}>
                        <Form.Select
                            name="searchDateType"
                            value={paging.searchDateType}
                            onChange={(e) => setPaging((previous) => ({ ...previous, searchDateType: e.target.value }))}
                        >
                            <option value='all'>전체기간</option>
                            <option value='1d'>1일</option>
                            <option value='1w'>1주</option>
                            <option value='1m'>1개월</option>
                            <option value='6m'>6개월</option>
                        </Form.Select>
                    </Col>

                    {/* 카테고리 선택 */}
                    <Col md={2}>
                        <Form.Select
                            name="category"
                            value={paging.category}
                            onChange={(e) => setPaging((previous) => ({ ...previous, category: e.target.value }))}
                        >
                            <option value='ALL'>전체 카테고리</option>
                            <option value='BREAD'>빵</option>
                            <option value='BEVERAGE'>음료수</option>
                            <option value='CAKE'>케이크</option>
                        </Form.Select>
                    </Col>

                    {/* 검색모드 선택 */}
                    <Col md={2}>
                        <Form.Select
                            name="searchMode"
                            value={paging.searchMode}
                            onChange={(e) => setPaging((previous) => ({ ...previous, searchMode: e.target.value }))}
                        >
                            <option value='ALL'>전체 검색</option>
                            <option value='name'>상품 이름</option>
                            <option value='description'>상품 설명</option>
                        </Form.Select>
                    </Col>

                    {/* 검색어 입력란 */}
                    <Col md={4}>
                        <Form.Control
                            name="searchKeyword"
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            value={paging.searchKeyword}
                            onChange={(e) => {
                                e.preventDefault();
                                setPaging((previous) => ({ ...previous, searchKeyword: e.target.value }));
                            }}
                        />
                    </Col>

                    {/* 페이징 상태 보여주기 */}
                    <Col md={2}>
                        <Form.Control
                            as="input"
                            type="text"
                            value={paging.pagingStatus}
                            disabled
                            style={{
                                fontSize: '20px',
                                backgroundColor: '#f0f0f0',
                                textAlign: 'center', // 텍스트 가운데 정렬
                                width: '100%', // 필요한 너비 설정
                                margin: '0 auto', // 가운데 정렬을 위한 자동 여백
                            }}
                        />
                    </Col>
                </Row>
            </Form>

            {/* 자료 보여주는 항*/}
            <Row>{products.map((item) => (
                <Col key={item.id} md={4} className="mb-4">
                    <Card className="h-100"
                        onClick={() => navigate(`/product/detail/${item.id}`)}
                        style={{ cursor: "pointer" }}>
                        <Card.Img
                            variant="top"
                            src={`${API_BASE_URL}/images/${item.image}`}
                            alt={item.name}
                            style={{ width: '100%', height: '200px' }}
                        />
                        <Card.Body>
                            {/* borderCollapse : 각 셀의 테두리를 합칠 것인지, 별개로 보여줄지를 설정하는 속성 */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '70%', padding: '4px', border: 'none' }}>
                                            <Card.Title>{item.name}({item.id})</Card.Title>
                                        </td>
                                        {/* textAlign : 수평 정렬 방식, verticalAlign:수직 정렬 방식 지정 */}
                                        {/* rowSpan 속성은 행방향으로 병합 시 사용 ↔ colSapn */}
                                        <td rowSpan={2} style={{ padding: '4px', border: 'none', textAlign: 'center', verticalAlign: 'middle' }}>
                                            {makeAdminButtons(item, user, navigate)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '70%', padding: '4px', border: 'none' }}>
                                            <Card.Text>가격 : {item.price.toLocaleString()}원</Card.Text>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>


                        </Card.Body>
                    </Card>
                </Col>
            ))}
            </Row>
            {/* 패이징 처리 영역 */}
            <Pagination className="justify-content-center mt-4">
                {/* 앞쪽 영역 */}
                <Pagination.First
                    onClick={() => {
                        console.log('First 버튼 클릭(0 페이지로 이동)');
                        setPaging((previous) => ({ ...previous, pageNumber: 0 }));
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button"
                >
                    맨처음
                </Pagination.First>

                <Pagination.Prev
                    onClick={() => {
                        const gotoPage = paging.beginPage - 1;
                        console.log(`Prev 버튼 클릭(${gotoPage} 페이지로 이동)`);
                        setPaging((previous) => ({ ...previous, pageNumber: gotoPage }));
                    }}
                    disabled={paging.pageNumber < paging.pageCount}
                    as="button"
                >
                    이전
                </Pagination.Prev>

                {/* 숫자 링크가 들어가는 영역 */}
                {[...Array(paging.endPage - paging.beginPage + 1)].map((_, idx) => {
                    // pageIndex는 숫자링크 번호임.
                    const pageIndex = paging.beginPage + idx + 1;

                    return (
                        <Pagination.Item
                            key={pageIndex}
                            active={paging.pageNumber === (pageIndex - 1)}
                            onClick={() => {
                                console.log(`${pageIndex} 페이지로 이동)`);
                                setPaging((previous) => ({ ...previous, pageNumber: pageIndex - 1 }));
                            }}
                        >
                            {pageIndex}
                        </Pagination.Item>

                    );
                })}
                <Pagination.Next
                    onClick={() => {
                        const gotoNextPage = paging.endPage + 1;
                        console.log(`Next 버튼 클릭(${gotoNextPage} 페이지로 이동)`);
                        setPaging((previous) => ({ ...previous, pageNumber: gotoNextPage }));
                    }}
                    disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
                    as="button"
                >
                    다음
                </Pagination.Next>

                <Pagination.Last
                    onClick={() => {
                        const lastPage = paging.totalPages - 1;
                        console.log(`Last 버튼 클릭(${lastPage} 페이지로 이동)`);
                        setPaging((previous) => ({ ...previous, pageNumber: lastPage }));
                    }}
                    disabled={paging.pageNumber >= Math.floor(paging.totalPages / paging.pageCount) * paging.pageCount}
                    as="button"
                >
                    맨끝
                </Pagination.Last>
            </Pagination>
        </Container>
    );
}

export default App;
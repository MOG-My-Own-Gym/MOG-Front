import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Table } from 'react-bootstrap';
import PaymentModal from '../../components/Payment/PaymentModal';
import { AuthContext } from '../Login/AuthContext';
import './OrderPage.css';

export default function OrderPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 주문자 정보 상태
  const [ordererInfo, setOrdererInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: ''
  });
  
  // 배송 정보 상태
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    contact1: '',
    contact2: '',
    address: '',
    detailAddress: '',
    zipCode: '',
    deliveryMessage: '',
    depositorName: '',
    deliveryType: 'domestic',
    addressType: 'home'
  });
  
  // 할인 정보 상태
  const [discountInfo, setDiscountInfo] = useState({
    deposit: 0,
    coupon: '',
    availableDeposit: 0
  });
  
  // 동의 상태
  const [agreements, setAgreements] = useState({
    allAgree: false,
    personalInfo: false,
    orderAgree: false
  });

  useEffect(() => {
    // 백엔드 API에서 주문 페이지 데이터 가져오기
    fetchOrderPageData();
  }, [productId, user]);

  const fetchOrderPageData = async () => {
    try {
      setLoading(true);
      
      let apiUrl;
      
      if (user && user.email) {
        // 로그인된 사용자인 경우 사용자별 데이터 조회
        apiUrl = `/api/shop/order/${productId}/my?email=${encodeURIComponent(user.email)}`;
      } else {
        // 로그인되지 않은 경우 기본 데이터 조회
        apiUrl = `/api/shop/order/${productId}?userId=default_user`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('주문 페이지 데이터를 가져올 수 없습니다.');
      }
      
      const data = await response.json();
      
      // 데이터 설정
      setProduct(data.product);
      setOrdererInfo(data.ordererInfo);
      setDeliveryInfo(data.deliveryInfo);
      setDiscountInfo(data.discountInfo);
      
    } catch (error) {
      console.error('주문 페이지 데이터 로딩 실패:', error);
      // 에러 발생 시 기본 데이터로 폴백
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    // API 호출 실패 시 기본 데이터 설정
    const fallbackProduct = {
      id: parseInt(productId),
      name: '상품 정보를 불러올 수 없습니다',
      category: 'unknown',
      price: 0,
      originalPrice: 0,
      image: '/img/yoga.jpeg',
      badge: '',
      description: '상품 정보를 불러올 수 없습니다'
    };
    
    setProduct(fallbackProduct);
    setOrdererInfo({
      name: '',
      email: '',
      phone: '',
      address: '',
      detailAddress: '',
      zipCode: ''
    });
    setDeliveryInfo({
      name: '',
      contact1: '',
      contact2: '',
      address: '',
      detailAddress: '',
      zipCode: '',
      deliveryMessage: '',
      depositorName: '',
      deliveryType: 'domestic',
      addressType: 'home'
    });
    setDiscountInfo({
      deposit: 0,
      coupon: '',
      availableDeposit: 0
    });
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const calculateShippingFee = () => {
    return product && product.price >= 50000 ? 0 : 3000;
  };

  const calculateTotalAmount = () => {
    if (!product) return 0;
    const shippingFee = calculateShippingFee();
    const discountAmount = discountInfo.deposit;
    return product.price + shippingFee - discountAmount;
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'orderer') {
      setOrdererInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'delivery') {
      setDeliveryInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'discount') {
      setDiscountInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAgreementChange = (field) => {
    if (field === 'allAgree') {
      const newValue = !agreements.allAgree;
      setAgreements({
        allAgree: newValue,
        personalInfo: newValue,
        orderAgree: newValue
      });
    } else {
      setAgreements(prev => ({ ...prev, [field]: !prev[field] }));
    }
  };

  const handleProceedToPayment = () => {
    if (!agreements.personalInfo || !agreements.orderAgree) {
      alert('필수 동의 항목에 체크해주세요.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (orderData) => {
    console.log('주문 완료:', orderData);
    alert(`주문이 완료되었습니다!\n주문번호: ${orderData.orderNumber}\n상품: ${orderData.productName}\n총 금액: ${orderData.totalAmount.toLocaleString()}원`);
    navigate('/orders');
  };

  const handleBackToProduct = () => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          <h4>상품을 찾을 수 없습니다</h4>
          <p>요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          <Button variant="warning" onClick={() => navigate('/shop')}>
            쇼핑몰으로 돌아가기
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="order-page-container">
      <Container className="py-5">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4">
          <Button variant="outline-secondary" onClick={handleBackToProduct}>
            ← 상품 상세로 돌아가기
          </Button>
        </div>

        {/* 로그인 상태 안내 */}
        {user ? (
          <Alert variant="info" className="mb-4">
            <strong>{user.email}</strong>님의 정보로 주문 페이지가 구성되었습니다.
          </Alert>
        ) : (
          <Alert variant="warning" className="mb-4">
            로그인하지 않았습니다. <Button variant="link" className="p-0" onClick={() => navigate('/login')}>로그인</Button>하여 개인 정보를 자동으로 입력할 수 있습니다.
          </Alert>
        )}

        <Row>
          <Col lg={8}>
            {/* 주문자 정보 */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">주문자정보</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>이름</Form.Label>
                      <Form.Control
                        type="text"
                        value={ordererInfo.name}
                        onChange={(e) => handleInputChange('orderer', 'name', e.target.value)}
                        placeholder={user ? "자동 입력됨" : "이름을 입력하세요"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>이메일</Form.Label>
                      <Row>
                        <Col xs={5}>
                          <Form.Control
                            type="text"
                            value={ordererInfo.email.split('@')[0] || ''}
                            onChange={(e) => {
                              const domain = ordererInfo.email.split('@')[1] || 'gmail.com';
                              handleInputChange('orderer', 'email', `${e.target.value}@${domain}`);
                            }}
                            placeholder={user ? "자동 입력됨" : "이메일을 입력하세요"}
                          />
                        </Col>
                        <Col xs={1} className="text-center d-flex align-items-center">
                          @
                        </Col>
                        <Col xs={6}>
                          <Form.Select
                            value={ordererInfo.email.split('@')[1] || 'gmail.com'}
                            onChange={(e) => {
                              const username = ordererInfo.email.split('@')[0] || '';
                              handleInputChange('orderer', 'email', `${username}@${e.target.value}`);
                            }}
                          >
                            <option value="gmail.com">gmail.com</option>
                            <option value="naver.com">naver.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="hanmail.net">hanmail.net</option>
                          </Form.Select>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>연락처</Form.Label>
                      <Row>
                        <Col xs={3}>
                          <Form.Select
                            value={ordererInfo.phone.split('-')[0] || '010'}
                            onChange={(e) => {
                              const parts = ordererInfo.phone.split('-');
                              handleInputChange('orderer', 'phone', `${e.target.value}-${parts[1] || ''}-${parts[2] || ''}`);
                            }}
                          >
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                          </Form.Select>
                        </Col>
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            value={ordererInfo.phone.split('-')[1] || ''}
                            onChange={(e) => {
                              const parts = ordererInfo.phone.split('-');
                              handleInputChange('orderer', 'phone', `${parts[0] || '010'}-${e.target.value}-${parts[2] || ''}`);
                            }}
                            placeholder={user ? "자동 입력됨" : "전화번호를 입력하세요"}
                          />
                        </Col>
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            value={ordererInfo.phone.split('-')[2] || ''}
                            onChange={(e) => {
                              const parts = ordererInfo.phone.split('-');
                              handleInputChange('orderer', 'phone', `${parts[0] || '010'}-${parts[1] || ''}-${e.target.value}`);
                            }}
                            placeholder={user ? "자동 입력됨" : "전화번호를 입력하세요"}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* 배송 정보 */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">배송 정보</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>이름</Form.Label>
                      <Form.Control
                        type="text"
                        value={deliveryInfo.name}
                        onChange={(e) => handleInputChange('delivery', 'name', e.target.value)}
                        placeholder={user ? "자동 입력됨" : "수취인 이름을 입력하세요"}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>연락처 1</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Select
                            value={deliveryInfo.contact1.split('-')[0] || ''}
                            onChange={(e) => {
                              const parts = deliveryInfo.contact1.split('-');
                              handleInputChange('delivery', 'contact1', `${e.target.value}-${parts[1] || ''}-${parts[2] || ''}`);
                            }}
                          >
                            <option value="">선택</option>
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                          </Form.Select>
                        </Col>
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            value={deliveryInfo.contact1.split('-')[1] || ''}
                            onChange={(e) => {
                              const parts = deliveryInfo.contact1.split('-');
                              handleInputChange('delivery', 'contact1', `${parts[0] || ''}-${e.target.value}-${parts[2] || ''}`);
                            }}
                            placeholder={user ? "자동 입력됨" : "전화번호를 입력하세요"}
                          />
                        </Col>
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            value={deliveryInfo.contact1.split('-')[2] || ''}
                            onChange={(e) => {
                              const parts = deliveryInfo.contact1.split('-');
                              handleInputChange('delivery', 'contact1', `${parts[0] || ''}-${parts[1] || ''}-${e.target.value}`);
                            }}
                            placeholder={user ? "자동 입력됨" : "전화번호를 입력하세요"}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>연락처 2</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Select
                            value={deliveryInfo.contact2.split('-')[0] || ''}
                            onChange={(e) => {
                              const parts = deliveryInfo.contact2.split('-');
                              handleInputChange('delivery', 'contact2', `${e.target.value}-${parts[1] || ''}-${parts[2] || ''}`);
                            }}
                          >
                            <option value="">선택</option>
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                          </Form.Select>
                        </Col>
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            value={deliveryInfo.contact2.split('-')[1] || ''}
                            onChange={(e) => {
                              const parts = deliveryInfo.contact2.split('-');
                              handleInputChange('delivery', 'contact2', `${parts[0] || ''}-${e.target.value}-${parts[2] || ''}`);
                            }}
                            placeholder="전화번호를 입력하세요"
                          />
                        </Col>
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            value={deliveryInfo.contact2.split('-')[2] || ''}
                            onChange={(e) => {
                              const parts = deliveryInfo.contact2.split('-');
                              handleInputChange('delivery', 'contact2', `${parts[0] || ''}-${parts[1] || ''}-${e.target.value}`);
                            }}
                            placeholder="전화번호를 입력하세요"
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>배송지 선택</Form.Label>
                      <div className="mb-2">
                        <Form.Check
                          inline
                          type="radio"
                          name="deliveryType"
                          id="domestic"
                          label="국내배송"
                          checked={deliveryInfo.deliveryType === 'domestic'}
                          onChange={() => handleInputChange('delivery', 'deliveryType', 'domestic')}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          name="deliveryType"
                          id="overseas"
                          label="해외배송"
                          checked={deliveryInfo.deliveryType === 'overseas'}
                          onChange={() => handleInputChange('delivery', 'deliveryType', 'overseas')}
                        />
                      </div>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          name="addressType"
                          id="home"
                          label="자택"
                          checked={deliveryInfo.addressType === 'home'}
                          onChange={() => handleInputChange('delivery', 'addressType', 'home')}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          name="addressType"
                          id="company"
                          label="회사"
                          checked={deliveryInfo.addressType === 'company'}
                          onChange={() => handleInputChange('delivery', 'addressType', 'company')}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          name="addressType"
                          id="recent"
                          label="최근 배송지"
                          checked={deliveryInfo.addressType === 'recent'}
                          onChange={() => handleInputChange('delivery', 'addressType', 'recent')}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          name="addressType"
                          id="list"
                          label="배송지 목록"
                          checked={deliveryInfo.addressType === 'list'}
                          onChange={() => handleInputChange('delivery', 'addressType', 'list')}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          name="addressType"
                          id="new"
                          label="신규 배송지"
                          checked={deliveryInfo.addressType === 'new'}
                          onChange={() => handleInputChange('delivery', 'addressType', 'new')}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>주소</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Control
                            type="text"
                            placeholder="우편번호"
                            value={deliveryInfo.zipCode || ''}
                            readOnly
                          />
                        </Col>
                        <Col xs={8}>
                          <Button variant="outline-secondary">우편번호</Button>
                        </Col>
                      </Row>
                      <Form.Control
                        type="text"
                        className="mt-2"
                        placeholder="기본주소"
                        value={deliveryInfo.address || ''}
                        readOnly
                      />
                      <Form.Control
                        type="text"
                        className="mt-2"
                        placeholder="상세주소"
                        value={deliveryInfo.detailAddress || ''}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>배송메세지 (100자내외)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={deliveryInfo.deliveryMessage}
                        onChange={(e) => handleInputChange('delivery', 'deliveryMessage', e.target.value)}
                        placeholder="배송 관련 메시지를 입력해주세요"
                      />
                      <small className="text-muted">
                        0/200 bytes (* 영문/숫자 기준 200자, 한글 기준 100자까지 입력 가능합니다.)
                      </small>
                      <div className="mt-2">
                        <small className="text-danger">
                          * 배송기사님이 확인하는 메세지입니다<br/>
                          (ex: 부재시 경비실에 보관해 주세요. 배송전 연락주세요. 등)<br/>
                          * 추가 요청 사항은 게시글 또는 고객센터로 문의주시시기 바랍니다
                        </small>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>무통장 입금자명</Form.Label>
                      <Form.Control
                        type="text"
                        value={deliveryInfo.depositorName}
                        onChange={(e) => handleInputChange('delivery', 'depositorName', e.target.value)}
                        placeholder="입금자명을 입력해주세요"
                      />
                      <small className="text-muted">(주문자와 같을경우 생략 가능)</small>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Check
                      type="checkbox"
                      id="saveAddress"
                      label="해당 배송지 정보를 나의 회원정보로 등록합니다."
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* 주문자 동의 */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">주문자 동의</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6>개인정보 수집·이용</h6>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>목적</th>
                        <th>항목</th>
                        <th>보유기간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>주문자 정보 확인, 주문 내역 안내, 주문 내역 조회</td>
                        <td>주문자 정보(연락처, 이메일)</td>
                        <td rowSpan={2}>주문일로부터 90일까지 보유하며, 관계 법령에 따라 5년간 보관</td>
                      </tr>
                      <tr>
                        <td>상품 배송(구매/환불/취소/교환)을 위한 수취인 정보</td>
                        <td>수취인 정보(이름, 연락처1, 연락처2, 주소)</td>
                      </tr>
                      <tr>
                        <td>서비스 제공(요금정산, 콘텐츠 제공, 구매 및 요금결제, 물품배송, 금융거래 본인 인증 및 금융서비스)</td>
                        <td>무통장입금자명</td>
                        <td>주문일로부터 90일까지(관계 법령에 따라 필요시, 일정기간 보유)</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                <div>
                  <h6>주문동의</h6>
                  <Form.Check
                    type="checkbox"
                    id="allAgree"
                    label="전체 동의"
                    checked={agreements.allAgree}
                    onChange={() => handleAgreementChange('allAgree')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="personalInfo"
                    label="[개인정보 수집·이용] 동의"
                    checked={agreements.personalInfo}
                    onChange={() => handleAgreementChange('personalInfo')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="orderAgree"
                    label="주문 / 결제 정보를 확인하여 구매 진행에 동의합니다."
                    checked={agreements.orderAgree}
                    onChange={() => handleAgreementChange('orderAgree')}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* 주문 상품 할인적용 */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">주문상품 할인적용</h5>
              </Card.Header>
              <Card.Body>
                <div className="price-breakdown">
                  <div className="d-flex justify-content-between mb-2">
                    <span>상품금액</span>
                    <span>{product.price.toLocaleString()}원</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>배송비</span>
                    <span>{calculateShippingFee() === 0 ? '무료' : `${calculateShippingFee().toLocaleString()}원`}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>할인금액</span>
                    <span className="text-danger">-{discountInfo.deposit.toLocaleString()}원</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>추가금액</span>
                    <span>0원</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>결제 예정금액</strong>
                    <strong className="text-danger fs-5">{calculateTotalAmount().toLocaleString()}원</strong>
                  </div>
                </div>

                <div className="mb-3">
                  <Form.Group>
                    <Form.Label>예치금 사용</Form.Label>
                    <Row>
                      <Col xs={8}>
                        <Form.Control
                          type="number"
                          value={discountInfo.deposit}
                          onChange={(e) => handleInputChange('discount', 'deposit', parseInt(e.target.value) || 0)}
                          min="0"
                          max={product.price}
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Check
                          type="checkbox"
                          id="useAllDeposit"
                          label="전액사용"
                        />
                      </Col>
                    </Row>
                    <small className="text-danger">(사용가능 예치금: {discountInfo.availableDeposit.toLocaleString()}원)</small>
                  </Form.Group>
                </div>

                <div className="mb-3">
                  <Form.Group>
                    <Form.Label>쿠폰 사용</Form.Label>
                    <Row>
                      <Col xs={8}>
                        <Form.Control
                          type="text"
                          value={discountInfo.coupon}
                          onChange={(e) => handleInputChange('discount', 'coupon', e.target.value)}
                          placeholder="쿠폰 코드 입력"
                        />
                      </Col>
                      <Col xs={4}>
                        <Button variant="secondary" size="sm">쿠폰선택</Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </div>

                <div className="text-center">
                  <Button
                    variant="warning"
                    size="lg"
                    className="w-100"
                    onClick={handleProceedToPayment}
                    disabled={!agreements.personalInfo || !agreements.orderAgree}
                  >
                    💳 결제하기
                  </Button>
                </div>

                <div className="mt-3">
                  <small className="text-danger">
                    # 배송준비기간은 재고 유무에 따라 주문일로부터 1~3일 소요되며,<br/>
                    재고가 없는 경우 별도 안내드립니다.
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* 사이드 네비게이션 */}
            <div className="side-navigation">
              <Button variant="dark" className="w-100 mb-2">
                💬 TALK
              </Button>
              <Button variant="outline-secondary" className="w-100 mb-2">
                매장 안내
              </Button>
              <Button variant="outline-secondary" className="w-100 mb-2">
                교환
              </Button>
            </div>
          </Col>
        </Row>

        {/* 결제 모달 */}
        <PaymentModal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          product={product}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Container>
    </div>
  );
}

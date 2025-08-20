import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './Shop.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 환불 모달 상태
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [productCondition, setProductCondition] = useState('NEW');
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // 토큰 검사 및 디버깅
      let token = localStorage.getItem('accessToken');
      const userInfo = localStorage.getItem('user');
      
      console.log('🔍 토큰 검사 시작...');
      console.log('📱 Access Token (직접):', token ? `${token.substring(0, 20)}...` : '없음');
      console.log('👤 User Info:', userInfo ? JSON.parse(userInfo) : '없음');
      
      // user 객체에서 토큰 추출 시도
      if (!token && userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.accessToken) {
            token = user.accessToken;
            console.log('✅ User 객체에서 토큰 추출 성공');
          }
        } catch (e) {
          console.error('❌ User 객체 파싱 실패:', e);
        }
      }
      
      if (!token) {
        console.error('❌ Access Token이 없습니다!');
        setError('로그인이 필요합니다. (토큰 없음)');
        setLoading(false);
        return;
      }

      // 토큰 형식 검사
      if (!token.startsWith('Bearer ') && !token.includes('.')) {
        console.error('❌ 토큰 형식이 올바르지 않습니다:', token);
        setError('토큰 형식이 올바르지 않습니다. 다시 로그인해주세요.');
        setLoading(false);
        return;
      }

      console.log('✅ 토큰 검사 통과, API 호출 시작...');
      
      const response = await axios.get(
        'http://localhost:8080/api/v1/payments/user/orders',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ 주문 내역 조회 성공:', response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('❌ 주문 내역 조회 실패:', error);
      
      // 에러 상세 정보
      if (error.response) {
        console.error('📡 서버 응답:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        } else if (error.response.status === 403) {
          setError('접근 권한이 없습니다.');
        } else {
          setError(`서버 오류: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error('🌐 네트워크 오류:', error.request);
        setError('서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.');
      } else {
        console.error('💻 클라이언트 오류:', error.message);
        setError('주문 내역을 불러올 수 없습니다.');
      }
      
      setLoading(false);
    }
  };

  // 결제 취소 처리
  const handleCancelOrder = async (order) => {
    if (!window.confirm(`정말로 "${order.productName}" 주문을 취소하시겠습니까?\n결제 금액이 환불됩니다.`)) {
      return;
    }

    setLoading(true);
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            if (user.accessToken) {
              token = user.accessToken;
            }
          } catch (e) {
            console.error('User 객체 파싱 실패:', e);
          }
        }
      }
      
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      // 결제 취소 API 호출
      const response = await axios.delete(
        `http://localhost:8080/api/v1/payments/${order.merchantUid || order.orderNumber}/cancel`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('결제 취소 성공:', response.data);
      alert('결제가 성공적으로 취소되었습니다.\n환불은 3-5일 내에 처리됩니다.');
      
      // 주문 내역 새로고침
      fetchOrders();
      
    } catch (error) {
      console.error('결제 취소 실패:', error);
      setError('결제 취소에 실패했습니다. 관리자에게 문의해주세요.');
      setLoading(false);
    }
  };

  // 환불 모달 열기
  const openRefundModal = (order) => {
    setSelectedOrder(order);
    setRefundAmount(order.totalAmount.toString());
    setShowRefundModal(true);
  };

  // 환불 모달 닫기
  const closeRefundModal = () => {
    setShowRefundModal(false);
    setSelectedOrder(null);
    setRefundReason('');
    setRefundAmount('');
    setProductCondition('NEW');
    setAdditionalInfo('');
  };

  // 환불 요청 처리
  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      alert('환불 사유를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            if (user.accessToken) {
              token = user.accessToken;
            }
          } catch (e) {
            console.error('User 객체 파싱 실패:', e);
          }
        }
      }
      
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      const refundRequest = {
        refundReason: refundReason,
        refundAmount: parseInt(refundAmount),
        productCondition: productCondition,
        additionalInfo: additionalInfo
      };

      // 환불 요청 API 호출
      const response = await axios.post(
        `http://localhost:8080/api/v1/payments/${selectedOrder.merchantUid || selectedOrder.orderNumber}/refund`,
        refundRequest,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('환불 요청 성공:', response.data);
      alert('환불 요청이 성공적으로 접수되었습니다.\n검토 후 3-5일 내에 처리됩니다.');
      
      // 모달 닫기 및 주문 내역 새로고침
      closeRefundModal();
      fetchOrders();
      
    } catch (error) {
      console.error('환불 요청 실패:', error);
      setError('환불 요청에 실패했습니다. 관리자에게 문의해주세요.');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { variant: 'warning', text: '주문 대기' },
      'CONFIRMED': { variant: 'info', text: '주문 확인' },
      'SHIPPED': { variant: 'primary', text: '배송 중' },
      'DELIVERED': { variant: 'success', text: '배송 완료' },
      'CANCELLED': { variant: 'danger', text: '주문 취소' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">주문 내역을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>오류 발생</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchOrders}>
            다시 시도
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="shop-container">
      <Container className="py-5">
        {/* 헤더 */}
        <div className="text-center mb-5">
          <h1 className="shop-title">📋 주문 내역</h1>
          <p className="shop-subtitle">나의 주문 현황을 확인해보세요</p>
          
          {/* 디버깅 버튼 */}
          <div className="mt-3">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => {
                let token = localStorage.getItem('accessToken');
                const user = localStorage.getItem('user');
                
                // user 객체에서 토큰 추출 시도
                if (!token && user) {
                  try {
                    const userObj = JSON.parse(user);
                    if (userObj.accessToken) {
                      token = userObj.accessToken;
                    }
                  } catch (e) {
                    console.error('User 객체 파싱 실패:', e);
                  }
                }
                
                console.log('🔍 현재 토큰 상태:');
                console.log('📱 Token (직접):', token);
                console.log('👤 User:', user);
                console.log('🔑 최종 사용 토큰:', token);
                
                alert(`직접 토큰: ${localStorage.getItem('accessToken') ? '있음' : '없음'}\n사용자: ${user ? '있음' : '없음'}\n최종 토큰: ${token ? '있음' : '없음'}`);
              }}
            >
              🔍 토큰 상태 확인
            </Button>
          </div>
        </div>

        {/* 주문 내역 */}
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h4>😔 주문 내역이 없습니다</h4>
            <p>첫 번째 주문을 시작해보세요!</p>
            <Button variant="warning" href="/shop">
              쇼핑하러 가기
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {orders.map((order) => (
              <Col key={order.orderId} xs={12} md={6} lg={4}>
                <Card className="order-card h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">주문번호</span>
                    <span className="text-muted">{order.orderNumber}</span>
                  </Card.Header>
                  
                  <Card.Body>
                    <div className="mb-3">
                      <h6 className="card-title">{order.productName}</h6>
                      <p className="text-muted mb-2">
                        카테고리: {order.productCategory || '일반'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>수량: {order.quantity}개</span>
                        <span className="fw-bold text-warning">
                          ₩{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>주문 상태:</span>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                      <div className="text-muted small mt-2">
                        <div>배송지: {order.shippingAddress || '기본 배송지'}</div>
                        <div>주문자: {order.buyerName || '알 수 없음'}</div>
                        <div>연락처: {order.buyerPhone || '알 수 없음'}</div>
                      </div>
                    </div>
                    
                    <div className="text-muted small">
                      <div>주문일: {formatDate(order.createdAt)}</div>
                      {order.updatedAt && (
                        <div>최종 업데이트: {formatDate(order.updatedAt)}</div>
                      )}
                    </div>
                  </Card.Body>
                  
                  <Card.Footer>
                    <div className="d-grid gap-2">
                      <Button variant="outline-info" size="sm">
                        배송 조회
                      </Button>
                      {order.orderStatus === 'CONFIRMED' && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleCancelOrder(order)}
                          disabled={loading}
                        >
                          {loading ? '처리중...' : '결제 취소'}
                        </Button>
                      )}
                      {order.orderStatus === 'DELIVERED' && (
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => openRefundModal(order)}
                          disabled={loading}
                        >
                          환불 요청
                        </Button>
                      )}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* 환불 요청 모달 */}
      <Modal show={showRefundModal} onHide={closeRefundModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>🔄 환불 요청</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {selectedOrder && (
            <div className="mb-4">
              <h6>주문 상품 정보</h6>
              <div className="d-flex justify-content-between align-items-center">
                <span>{selectedOrder.productName}</span>
                <span className="fw-bold text-warning">₩{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
              <small className="text-muted">주문번호: {selectedOrder.orderNumber}</small>
            </div>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>환불 사유 <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                value={refundReason} 
                onChange={(e) => setRefundReason(e.target.value)}
                required
              >
                <option value="">환불 사유를 선택하세요</option>
                <option value="상품 불량">상품 불량</option>
                <option value="상품 오배송">상품 오배송</option>
                <option value="상품과 다름">상품과 다름</option>
                <option value="단순 변심">단순 변심</option>
                <option value="기타">기타</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>환불 금액</Form.Label>
              <Form.Control
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="환불 받을 금액을 입력하세요"
                min="0"
                max={selectedOrder?.totalAmount || 0}
              />
              <Form.Text className="text-muted">
                최대 환불 가능 금액: ₩{selectedOrder?.totalAmount?.toLocaleString() || 0}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>상품 상태</Form.Label>
              <Form.Select 
                value={productCondition} 
                onChange={(e) => setProductCondition(e.target.value)}
              >
                <option value="NEW">새상품 (미사용)</option>
                <option value="USED">사용함</option>
                <option value="DAMAGED">파손됨</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>추가 설명</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="환불 사유에 대한 상세 설명을 입력하세요"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeRefundModal}>
            취소
          </Button>
          <Button 
            variant="warning" 
            onClick={handleRefundRequest}
            disabled={loading || !refundReason.trim()}
          >
            {loading ? '처리중...' : '환불 요청'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

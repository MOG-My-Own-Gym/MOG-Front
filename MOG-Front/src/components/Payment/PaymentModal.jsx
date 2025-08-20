import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getPaymentConfig } from '../../config/payment.config';
import styles from './PaymentModal.module.css';

const PaymentModal = ({ show, onHide, product, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 아임포트 초기화
  useEffect(() => {
    if (show) {
      console.log('PaymentModal 열림, 아임포트 SDK 확인 중...');
      console.log('window.IMP 존재 여부:', !!window.IMP);
      
      if (window.IMP) {
        console.log('아임포트 SDK 로드됨, 초기화 시작...');
        // 환경별 설정에서 가맹점 코드 가져오기
        const config = getPaymentConfig();
        window.IMP.init(config.IAMPORT_MERCHANT_ID);
        console.log('아임포트 초기화 완료 - 가맹점 코드:', config.IAMPORT_MERCHANT_ID);
      } else {
        console.error('아임포트 SDK가 로드되지 않음');
        setError('아임포트 SDK를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
      }
    }
  }, [show]);

    const sendPaymentToBackend = async (impResponse, paymentData) => {
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const paymentRequest = {
        merchantUid: paymentData.merchant_uid,
        impUid: impResponse.imp_uid,
        productName: paymentData.name,
        amount: paymentData.amount,
        paymentMethod: paymentData.pay_method,
        // 사용자 정보는 UsersEntity에서 가져오므로 제거
        // buyerEmail: paymentData.buyer_email,
        // buyerName: paymentData.buyer_name,
        // buyerTel: paymentData.buyer_tel,
        productCategory: product?.category || 'general',
        quantity: 1,
        shippingAddress: '배송지 주소', // TODO: 실제 배송지 정보 입력 받기
        // shippingPhone: paymentData.buyer_tel, - UsersEntity.phoneNum 사용
        orderNotes: ''
      };

      const response = await axios.post(
        'http://localhost:8080/api/v1/payments/process',
        paymentRequest,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('백엔드 결제 처리 성공:', response.data);
      onPaymentSuccess(response.data);
      onHide();
      
    } catch (error) {
      console.error('백엔드 결제 처리 실패:', error);
      setError('결제 정보 저장에 실패했습니다. 관리자에게 문의해주세요.');
    }
  };

  const handlePayment = () => {
    if (!product) {
      setError('상품 정보가 없습니다.');
      return;
    }

    if (!window.IMP) {
      setError('아임포트 SDK를 불러올 수 없습니다.');
      return;
    }

    setLoading(true);
    setError('');

    // 로컬 스토리지에서 사용자 정보 가져오기
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 설정값 확인 로그
    const config = getPaymentConfig();
    console.log('🔧 현재 결제 설정:', config);
    
    const paymentData = {
      // channelKey 방식이 작동하지 않으므로 pg 방식 사용
      // channelKey: config.CHANNEL_KEY, // 주석 처리
      pg: config.PG_PROVIDER, // 'nice_v2' 사용
      pay_method: 'card', // 테스트 환경에서는 신용카드만 사용 (오타 수정됨)
      merchant_uid: `mid_${new Date().getTime()}`,
      amount: product.price,
      name: product.name,
      buyer_email: userInfo.email || 'test@example.com',
      buyer_name: userInfo.usersName || userInfo.nickName || '테스트 사용자',
      buyer_tel: userInfo.phoneNum || '010-1234-5678'
    };

    console.log('결제 요청 데이터:', paymentData);
    console.log('결제 요청 시작...');

    window.IMP.request_pay(paymentData, (response) => {
      console.log('결제 응답 받음:', response);
      setLoading(false);
      
      // 응답 데이터 검증 및 정규화
      const normalizedResponse = {
        success: response.success,
        error_code: response.error_code || response.error_oode,
        error_msg: response.error_msg || response.error_mag,
        imp_uid: response.imp_uid,
        merchant_uid: response.merchant_uid
      };
      
      console.log('🔍 정규화된 응답:', normalizedResponse);
      
      if (normalizedResponse.success) {
        // 결제 성공
        console.log('✅ 결제 성공:', normalizedResponse);
        
        // 백엔드에 결제 정보 전송
        sendPaymentToBackend(normalizedResponse, paymentData);
      } else {
        // 결제 실패 - 에러 정보 상세 로깅
        console.log('🔴 결제 실패 상세:', normalizedResponse);
        
        // imp_uid가 있으면 실제로는 성공일 수 있음
        if (normalizedResponse.imp_uid) {
          console.log('⚠️ imp_uid가 존재하므로 실제로는 성공일 수 있습니다');
          // 백엔드에 결제 정보 전송 시도
          sendPaymentToBackend(normalizedResponse, paymentData);
        } else {
          const errorMessage = normalizedResponse.error_msg || '알 수 없는 오류';
          setError(`결제 실패: ${errorMessage}`);
        }
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalTitle}>💳 결제하기</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {product && (
          <div className={`${styles.productSummary} mb-4`}>
            <h5 className={styles.productSummaryTitle}>주문 상품</h5>
            <div className="d-flex justify-content-between align-items-center">
              <span>{product.name}</span>
              <span className="fw-bold text-warning">₩{product.price.toLocaleString()}</span>
            </div>
          </div>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>결제 수단</Form.Label>
                         <Form.Select
               value={paymentMethod}
               onChange={(e) => setPaymentMethod(e.target.value)}
             >
               <option value="card">신용카드</option>
               <option value="trans" disabled>실시간 계좌이체 (테스트 불가)</option>
               <option value="vbank" disabled>가상계좌 (테스트 불가)</option>
               <option value="phone" disabled>휴대폰 소액결제 (테스트 불가)</option>
             </Form.Select>
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button
          variant="warning"
          className={styles.warningButton}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? '결제 처리중...' : '결제하기'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
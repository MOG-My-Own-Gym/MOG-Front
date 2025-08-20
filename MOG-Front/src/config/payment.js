// Iamport Payment Gateway Configuration
// Iamport 가맹점 관리자 페이지에서 가맹점 식별코드 확인 후 입력

export const PAYMENT_CONFIG = {
  // 🔴 실제 Iamport 가맹점 식별코드로 변경하세요!
  IAMPORT_MERCHANT_ID: 'iamport00m', // PG상점아이디 (MID)
  
  // 테스트 환경 설정
  IS_TEST_MODE: true,
  
  // PG 설정 (테스트용)
  PG_PROVIDER: 'nice_v2', // Nice Payments PG
  
  // API Key (테스트용)
  API_KEY: 'hRILlnbJnma5kNc1GFc6EBzCiL89Dch8vNV23hXw3274QoXAE7ft2B8cdgQtRM99PZiL2TVSZxFQTb3M',
  
  // 결제취소 비밀번호 (테스트용)
  CANCEL_PASSWORD: '123456',
  
  // 결제 수단 (테스트 환경에서는 신용카드만)
  PAYMENT_METHODS: ['card'],
  
  // 통화
  CURRENCY: 'KRW'
};

// 가맹점 코드 설정 함수
export const setMerchantId = (merchantId) => {
  PAYMENT_CONFIG.IAMPORT_MERCHANT_ID = merchantId;
  PAYMENT_CONFIG.PG_PROVIDER = `html5_inicis.${merchantId}`;
};

// 설정 가져오기
export const getPaymentConfig = () => PAYMENT_CONFIG;

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import PaymentModal from '../../components/Payment/PaymentModal';
import './Shop.css';

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // 샘플 상품 데이터
  const products = [
    {
      id: 1,
      name: '프리미엄 요가매트',
      category: 'equipment',
      price: 45000,
      originalPrice: 60000,
      image: '/img/yoga.jpeg',
      badge: 'BEST',
      description: '고급 실리콘 소재의 안전한 요가매트'
    },
    {
      id: 2,
      name: '스마트 웨이트',
      category: 'equipment',
      price: 120000,
      originalPrice: 150000,
      image: '/img/abs.jpeg',
      badge: 'NEW',
      description: '블루투스 연결 가능한 스마트 웨이트'
    },
    {
      id: 3,
      name: '운동복 세트',
      category: 'clothing',
      price: 89000,
      originalPrice: 120000,
      image: '/img/Running.jpeg',
      badge: 'SALE',
      description: '편안하고 스타일리시한 운동복'
    },
    {
      id: 4,
      name: '프로틴 파우더',
      category: 'supplement',
      price: 65000,
      originalPrice: 80000,
      image: '/img/pushups.jpeg',
      badge: 'HOT',
      description: '고품질 단백질 보충제'
    },
    {
      id: 5,
      name: '테스트 상품',
      category: 'equipment',
      price: 100, // ✅ 아임포트 최소 금액으로 조정
      originalPrice: 1000,
      image: '/img/yoga.jpeg', // 임시 이미지 사용
      badge: 'TEST',
      description: '100원 테스트용 상품입니다 (아임포트 최소 금액)'
    }
  ];

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'equipment', name: '운동기구' },
    { id: 'clothing', name: '운동복' },
    { id: 'supplement', name: '보충제' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (orderData) => {
    console.log('주문 완료:', orderData);
    
    // 성공 메시지 표시
    alert(`주문이 완료되었습니다!\n주문번호: ${orderData.orderNumber}\n상품: ${orderData.productName}\n총 금액: ${orderData.totalAmount.toLocaleString()}원`);
    
    // TODO: 주문 내역 페이지로 이동하거나 주문 내역을 표시
    // TODO: 장바구니에서 상품 제거 (장바구니 기능 구현 시)
  };

  return (
    <div className="shop-container">
      <Container className="py-5">
        {/* 헤더 */}
        <div className="text-center mb-5">
          <h1 className="shop-title">🏪 MOG Shop</h1>
          <p className="shop-subtitle">당신의 운동을 더욱 특별하게 만들어줄 제품들을 만나보세요</p>
          <div className="mt-3">
            <Button variant="outline-warning" href="/orders" className="me-2">
              📋 주문 내역
            </Button>
            <Button variant="outline-info" href="/mypage">
              👤 마이페이지
            </Button>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="category-filter mb-4">
          <div className="d-flex justify-content-center flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'warning' : 'outline-warning'}
                onClick={() => setSelectedCategory(category.id)}
                className="category-btn"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 상품 목록 */}
        <Row className="g-4">
          {filteredProducts.map(product => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="product-card h-100">
                <div className="product-image-container">
                  <Card.Img 
                    variant="top" 
                    src={product.image} 
                    className="product-image"
                  />
                  {product.badge && (
                    <Badge 
                      bg="danger" 
                      className="product-badge"
                    >
                      {product.badge}
                    </Badge>
                  )}
                  {product.originalPrice > product.price && (
                    <Badge 
                      bg="success" 
                      className="discount-badge"
                    >
                      {calculateDiscount(product.originalPrice, product.price)}% 할인
                    </Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="product-title">{product.name}</Card.Title>
                  <Card.Text className="product-description">
                    {product.description}
                  </Card.Text>
                  <div className="price-container mt-auto">
                    {product.originalPrice > product.price ? (
                      <div>
                        <span className="original-price">
                          {product.originalPrice.toLocaleString()}원
                        </span>
                        <span className="current-price">
                          {product.price.toLocaleString()}원
                        </span>
                      </div>
                    ) : (
                      <span className="current-price">
                        {product.price.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <div className="product-actions mt-3">
                    <Button variant="warning" className="w-100 mb-2" onClick={() => handleBuyNow(product)}>
                      💳 구매하기
                    </Button>
                    <Button variant="outline-warning" className="w-100">
                      💝 위시리스트
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 빈 상태 */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <h4>😔 해당 카테고리의 상품이 없습니다</h4>
            <p>다른 카테고리를 확인해보세요!</p>
          </div>
        )}

        {/* 결제 모달 */}
        <PaymentModal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          product={selectedProduct}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Container>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import './ProductDetail.css';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('상품 정보를 가져올 수 없습니다.');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('상품 로딩 실패:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const handleBuyNow = () => {
    // OrderPage로 이동
    navigate(`/order/${productId}`);
  };

  const handlePaymentSuccess = (orderData) => {
    console.log('주문 완료:', orderData);
    
    // 성공 메시지 표시
    alert(`주문이 완료되었습니다!\n주문번호: ${orderData.orderNumber}\n상품: ${orderData.productName}\n총 금액: ${orderData.totalAmount.toLocaleString()}원`);
    
    // 주문 내역 페이지로 이동
    navigate('/orders');
  };

  const handleBackToShop = () => {
    navigate('/shop');
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
          <Button variant="warning" onClick={handleBackToShop}>
            쇼핑몰으로 돌아가기
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="product-detail-container">
      <Container className="py-5">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4">
          <Button variant="outline-secondary" onClick={handleBackToShop}>
            ← 쇼핑몰으로 돌아가기
          </Button>
        </div>

        <Row>
          {/* 상품 이미지 */}
          <Col lg={6} className="mb-4">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-detail-image"
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
          </Col>

          {/* 상품 정보 */}
          <Col lg={6}>
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-category">{product.category}</p>
              
              <div className="price-container mb-4">
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

              <p className="product-description mb-4">
                {product.detailedDescription}
              </p>

              {/* 구매 버튼 */}
              <div className="purchase-actions">
                <Button 
                  variant="warning" 
                  size="lg" 
                  className="w-100 mb-3"
                  onClick={handleBuyNow}
                >
                  💳 구매하기
                </Button>
                <Button variant="outline-warning" className="w-100">
                  💝 위시리스트에 추가
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* 상품 상세 정보 */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h4>상품 상세 정보</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h5>제품 사양</h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="fw-bold">카테고리</td>
                          <td>{product.category}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">가격</td>
                          <td>{product.price.toLocaleString()}원</td>
                        </tr>
                        {product.originalPrice > product.price && (
                          <tr>
                            <td className="fw-bold">할인율</td>
                            <td>{calculateDiscount(product.originalPrice, product.price)}%</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <h5>배송 정보</h5>
                    <ul className="list-unstyled">
                      <li>🚚 무료 배송 (5만원 이상 구매 시)</li>
                      <li>📦 배송 기간: 1-3일</li>
                      <li>🔄 교환/반품: 7일 이내</li>
                      <li>💳 안전한 결제 시스템</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

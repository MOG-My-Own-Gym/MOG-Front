import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../Login/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    usersName: '',
    nickName: '',
    email: '',
    phoneNum: '',
    role: 'USER'
  });

  useEffect(() => {
    // 관리자 권한 확인 (SUPER_ADMIN 또는 ADMIN)
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
      navigate('/');
      return;
    }
    
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/users/list', {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('사용자 목록을 가져올 수 없습니다.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      usersName: user.usersName || '',
      nickName: user.nickName || '',
      email: user.email || '',
      phoneNum: user.phoneNum || '',
      role: user.role || 'USER'
    });
    setShowUserModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/update/${selectedUser.usersId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('사용자 정보 업데이트에 실패했습니다.');
      }

      alert('사용자 정보가 성공적으로 업데이트되었습니다.');
      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      alert('사용자 정보 업데이트에 실패했습니다.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('사용자 삭제에 실패했습니다.');
      }

      alert('사용자가 성공적으로 삭제되었습니다.');
      fetchUsers();
    } catch (error) {
      alert('사용자 삭제에 실패했습니다.');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'SUPER_ADMIN') {
      return <Badge bg="danger">최고 관리자</Badge>;
    } else if (role === 'ADMIN') {
      return <Badge bg="warning" text="dark">일반 관리자</Badge>;
    }
    return <Badge bg="primary">일반사용자</Badge>;
  };

  // 역할 변경 권한 확인
  const canChangeRole = (targetUser) => {
    // targetUser가 null이면 false 반환
    if (!targetUser) {
      return false;
    }
    
    // user가 null이면 false 반환
    if (!user) {
      return false;
    }
    
    // SUPER_ADMIN만 역할을 변경할 수 있음
    if (user.role !== 'SUPER_ADMIN') {
      return false;
    }
    
    // 자기 자신의 역할은 변경할 수 없음
    if (user.usersId === targetUser.usersId) {
      return false;
    }
    
    // 다른 SUPER_ADMIN을 만들 수 없음
    if (targetUser.role === 'SUPER_ADMIN') {
      return false;
    }
    
    return true;
  };

  // 모바일용 사용자 카드 컴포넌트
  const UserCard = ({ user }) => (
    <Card className="user-card mb-3">
      <Card.Body>
        <div className="user-card-header mb-3">
          <div className="user-avatar">
            {user.usersName ? user.usersName.charAt(0) : 'U'}
          </div>
          <div className="user-info">
            <h6 className="mb-1">{user.usersName || '이름 없음'}</h6>
            <small className="text-muted">ID: {user.usersId}</small>
          </div>
          <div className="user-role">
            {getRoleBadge(user.role)}
          </div>
        </div>
        
        <div className="user-details">
          <div className="detail-item">
            <span className="detail-label">닉네임:</span>
            <span className="detail-value">{user.nickName || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">이메일:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">전화번호:</span>
            <span className="detail-value">{user.phoneNum || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">가입일:</span>
            <span className="detail-value">
              {new Date(user.regDate).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
        
        <div className="user-actions mt-3">
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => handleEditUser(user)}
          >
            수정
          </Button>
          {user.role !== 'SUPER_ADMIN' && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteUser(user.usersId)}
            >
              삭제
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>오류 발생</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchUsers}>
            다시 시도
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="admin-page-container">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="admin-title">🔧 관리자 페이지</h1>
          <p className="admin-subtitle">사용자 관리 및 시스템 모니터링</p>
        </div>

        <Row>
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">👥 사용자 관리</h5>
                <small className="text-muted">
                  총 {users.length}명의 사용자가 등록되어 있습니다.
                </small>
              </Card.Header>
              <Card.Body>
                {/* 데스크톱용 테이블 (lg 이상에서만 표시) */}
                <div className="d-none d-lg-block">
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>닉네임</th>
                        <th>이메일</th>
                        <th>전화번호</th>
                        <th>역할</th>
                        <th>가입일</th>
                        <th>작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem) => (
                        <tr key={userItem.usersId}>
                          <td>{userItem.usersId}</td>
                          <td>{userItem.usersName}</td>
                          <td>{userItem.nickName}</td>
                          <td>{userItem.email}</td>
                          <td>{userItem.phoneNum}</td>
                          <td>{getRoleBadge(userItem.role)}</td>
                          <td>{new Date(userItem.regDate).toLocaleDateString('ko-KR')}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditUser(userItem)}
                            >
                              수정
                            </Button>
                            {userItem.role !== 'SUPER_ADMIN' && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteUser(userItem.usersId)}
                              >
                                삭제
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* 모바일용 카드 (lg 미만에서만 표시) */}
                <div className="d-lg-none">
                  {users.map((userItem) => (
                    <UserCard key={userItem.usersId} user={userItem} />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 사용자 수정 모달 */}
        <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>사용자 정보 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.usersName}
                      onChange={(e) => setEditForm({...editForm, usersName: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.nickName}
                      onChange={(e) => setEditForm({...editForm, nickName: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>이메일</Form.Label>
                    <Form.Control
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>전화번호</Form.Label>
                    <Form.Control
                      type="tel"
                      value={editForm.phoneNum}
                      onChange={(e) => setEditForm({...editForm, phoneNum: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>역할</Form.Label>
                <Form.Select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  disabled={!selectedUser || !canChangeRole(selectedUser)}
                >
                  <option value="USER">일반사용자</option>
                  <option value="ADMIN">일반 관리자</option>
                  {user && user.role === 'SUPER_ADMIN' && (
                    <option value="SUPER_ADMIN" disabled>최고 관리자</option>
                  )}
                </Form.Select>
                {selectedUser && !canChangeRole(selectedUser) && (
                  <Form.Text className="text-muted">
                    {!user || user.role !== 'SUPER_ADMIN' 
                      ? '역할 변경은 최고 관리자만 가능합니다' 
                      : '자기 자신의 역할은 변경할 수 없습니다'}
                  </Form.Text>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUserModal(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleUpdateUser}>
              수정
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

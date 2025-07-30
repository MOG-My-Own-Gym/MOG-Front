import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MyTrace.module.css';
import RecordPage from '../../components/Record/RecordPage';
import { Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../Login/AuthContext';
import { useModalAlert } from '../../context/ModalAlertContext';
export default function MySocial() {
  const [postData, setPostData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {showModal}=useModalAlert();
  const [userData, setUserData]=useState({
    nickName:'',
    email:'',
    profileImg:'/img/userAvatar.png'
  });
  
  const fetchPosts = async () => {
    const data = await axios
      .get('http://158.180.78.252:8080/api/v1/posts', {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        setPostData(res.data);
      });
  };
  const fetchComments = async () => {
    const commentRes = await axios.get('http://158.180.78.252:8080/api/v1/comments/list', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    const comments = commentRes.data;
    const commentWithPostTitle = await Promise.all(
      comments.map(async comment => {
        const postRes = await axios.get(
          `http://158.180.78.252:8080/api/v1/posts/${comment.postId}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          },
        );
        return { ...comment, postTitle: postRes.data.postTitle };
      }),
    );
    setCommentData(commentWithPostTitle);
  };

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, []);

  useEffect(()=>{
    axios.get(`http://158.180.78.252:8080/api/v1/users/${user.usersId}`)
      .then(res=>{
        setUserData(prev=>({
          ...prev,
          nickName:res.data.nickName,
          email:res.data.email,
          profileImg:res.data.profileImg
        }))
      })
      .catch(e=>{
        console.log(e);
        showModal('사용자의 정보를 가져오는 중 오류가 발생하였습니다.');
      });
  },[user.usersId]);

  return (
    <>
      <div className={styles['trace-container']}>
        <div className={styles['social-container']}>
          {/*나의 소셜 메인 위젯*/}
          <div
            style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', padding: '4em' }}
          >
            <div style={{ display: 'flex', height: '500px', gap: '2em' }}>
              <Card className={styles['profile-card']}>
                <div className="profile-head d-flex flex-column align-items-center">
                  <img className="rounded-circle mt-5" width="150px" src={userData.profileImg} />
                  <h4>{userData.nickName} </h4>
                  <h5>{userData.email}</h5>
                </div>
                <div className="d-flex flex-row justify-content-around mt-4 pr-4">
                  <div className="d-flex flex-column align-items-center">
                    <small className="text-muted">나의 글</small>
                    <h6>4</h6>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <small className="text-muted">나의 댓글</small>
                    <h6>4</h6>
                  </div>
                </div>
              </Card>
              <div className={styles['record-container']}>
                <RecordPage />
              </div>
            </div>
          </div>
          <div className={styles['bbs-container']}>
            <div className={styles['post']}>
              <div className="container-fluid mt-3 mb-3">
                <div>
                  <span className="fs-5 fw-semibold">내가 작성한 게시글</span>
                  <hr className="text-secondary" />
                </div>
                <div className={styles['post-container']}>

                  <ListGroup as="ul">
                    <ListGroup.Item
                      action
                      style={{ backgroundColor: '#fdc800', fontWeight: 'bold' }}
                    >
                      <div className={styles['post-list']}>
                        <div>ID</div>
                        <div>제목</div>
                        <div>내용</div>
                        <div>등록일</div>
                      </div>
                    </ListGroup.Item>

                    {postData.length > 0 ? (
                      postData.map((post, i) => {
                        console.log(post);
                        return (
                          <ListGroup.Item
                            key={i}
                            action
                            style={{ backgroundColor: 'white' }}
                            onClick={() => {
                              navigate(`/post/${post.postId}`);
                            }}
                          >
                            <div className={styles['post-list']}>
                              <React.Fragment>
                                <div>{post.postId}</div>
                                <div>{post.postTitle}</div>
                                <div className={styles['post-content']}>{post.postContent}</div>
                                <div>{post.postRegDate.slice(0, 10)}</div>
                              </React.Fragment>
                            </div>
                          </ListGroup.Item>
                        );
                      })
                    ) : (
                      <div>작성한 글이 없습니다</div>
                    )}
                  </ListGroup>
                </div>
              </div>
            </div>
            <div className={styles['comment']}>
              <div className="container-fluid mt-3 mb-3">
                <div>
                  <span className="fs-5 fw-semibold">내가 작성한 댓글</span>
                  <hr className="text-secondary" />
                </div>
                <div className={styles['comment-container']}>
                  <div className="list-group list-group-flush border-bottom scrollarea">
                    {commentData.length > 0 ? (
                      commentData.map(comment => {
                        return (
                          <Link
                            to={`/post/${comment.postId}`}
                            className="list-group-item list-group-item-action py-3 lh-tight"
                          >
                            <div className="d-flex w-100 align-items-center justify-content-between">
                              <strong className="mb-1">{comment.content}</strong>
                            </div>
                            <div className="col-10 mb-1 small text-uppercase">글 제목1</div>
                          </Link>
                        );
                      })
                    ) : (
                      <div>작성한 댓글이 없습니다</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

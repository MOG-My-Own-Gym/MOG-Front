import { useState } from "react";
import { Link } from "react-router-dom";
export default function MySocial(){

    //하트버튼 누르는 토글여부에 따라 꽉 찬 하트와 빈 하트를 보여주는 컴포넌트
    const HeartItemSocial =()=>{
            const [isLiked, setIsLiked] = useState(false);
          
            const toggleHeart = e => {
                e.preventDefault();
              setIsLiked(!isLiked);
            };
    
            return <>
                <div>
                    <button className="btn-social" onClick={toggleHeart}>
                        {isLiked ? (
                            <img className="img-fluid img-routine" src="/img/like.png" alt="Filled Heart" style={{ height: '30px' }}/>
                        ) : (
                            <img className="img-fluid img-routine" src="/img/empty-like.png" alt="Empty Heart" style={{ height: '30px' }}/>
                        )}
                    </button>
                </div>
            
            </>
    
        };

    return<>
        <div className="container rounded bg-white mt-5 mb-5">
            <div >
                <div className="nav d-flex justify-content-between">
                    {/*나의 소셜 메인 위젯*/}
                    <div className="account row d-flex justify-content-around col-md-3">
                        <div className="container d-flex justify-content-center">
                            <div className="card card-social mt-5 px-4 pt-5 pb-4">
                                <div className="name">
                                    <div className="profile-head d-flex flex-column align-items-center">
                                        <h4>길동05 </h4>
                                        <h5>gildongGa1234</h5>
                                    </div>
                                    <div className="d-flex flex-row justify-content-around mt-4 pr-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <small className="text-muted">나의 글</small>
                                            <h6 >4</h6>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <small className="text-muted">나의 댓글</small>
                                            <h6>4</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="posting col-md-5">
                        <div className="container-fluid mt-3 mb-3">
                            <div className="row g-2 flex-wrap">
                                <div className="col-auto">
                                    <div className="card card-social card-post d-flex flex-column justify-content-around w-100">
                                        <div className="img-container-social"> 
                                            <Link to="#">
                                                <img src="/img/Running.jpeg" className="img-fluid"/>
                                            </Link>
                                        </div>
                                        <div className="title-container">
                                            <div className="d-flex justify-content-between align-items-center my-3">
                                                <h6 className="mb-0">글 제목1</h6> 
                                            </div>
                                            <HeartItemSocial/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="card card-social card-post d-flex flex-column justify-content-around w-100">
                                        <div className="img-container-social"> 
                                            <Link to="#">
                                                <img src="/img/abs.jpeg" className="img-fluid"/>
                                            </Link>
                                        </div>
                                        <div className="title-container">
                                            <div className="d-flex justify-content-between align-items-center my-3">
                                                <h6 className="mb-0">글 제목2</h6> 
                                            </div>
                                            <HeartItemSocial/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="card card-social card-post d-flex flex-column justify-content-around w-100">
                                        <div className="img-container-social"> 
                                            <Link to="#">
                                                <img src="/img/pushups.jpeg" className="img-fluid"/>
                                            </Link>
                                        </div>
                                        <div className="title-container">
                                            <div className="d-flex justify-content-between align-items-center my-3">
                                                <h6 className="mb-0">글 제목3</h6> 
                                            </div>
                                            <HeartItemSocial/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="card card-social card-post d-flex flex-column justify-content-around w-100">
                                        <div className="img-container-social"> 
                                            <Link to="#">
                                                <img src="/img/yoga.jpeg" className="img-fluid"/>
                                            </Link>
                                        </div>
                                        <div className="title-container">
                                            <div className="d-flex justify-content-between align-items-center my-3">
                                                <h6 className="mb-0">글 제목4</h6> 
                                            </div>
                                            <HeartItemSocial/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="comments col-sm-10 col-md-4">
                        <div className="wrapper-social wrapper w-100">
                            <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white w-100">
                                <div>
                                    <span className="fs-5 fw-semibold">내가 작성한 댓글</span>
                                    <hr className="text-secondary"/>
                                </div>
                                <div className="list-group list-group-flush border-bottom scrollarea">
                                    <Link to="#" className="list-group-item list-group-item-action py-3 lh-tight">
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <strong className="mb-1">댓글 내용1</strong>
                                        </div>
                                        <div className="col-10 mb-1 small text-uppercase">글 제목1</div>
                                    </Link>
                                    <Link to="#" className="list-group-item list-group-item-action py-3 lh-tight">
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <strong className="mb-1">댓글 내용2</strong>
                                        </div>
                                        <div className="col-10 mb-1 small text-uppercase">글 제목1</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>
}
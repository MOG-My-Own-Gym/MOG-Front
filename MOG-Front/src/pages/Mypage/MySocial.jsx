import "./css/mysocial.css";
export default function MySocial(){


    return<>
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="pt-2">
                <div className="nav d-flex justify-content-between">
                    <div className="account row d-flex justify-content-around ">
                        <div className="container d-flex justify-content-center">
                            <div className="card card-social mt-5 px-4 pt-5 pb-4">
                                <div className="name">
                                    <h4>James <br/>Martinia Junior</h4>
                                    <div className="d-flex flex-row">
                                        <small className="text-muted">Popular Artist</small>
                                        <i className="fas fa-check ml-2"></i>
                                    </div>
                                    <div className="d-flex flex-row justify-content-between mt-4 pr-4">
                                        <div className="d-flex flex-column align-items-center">
                                            <small className="text-muted">Followers</small>
                                            <h6 >2M</h6>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <small className="text-muted">Following</small>
                                            <h6>01</h6>
                                        </div>
                                        <div className="d-flex flex-column align-items-center">
                                            <small className="text-muted">Groups</small>
                                            <h6>12K</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="posting">
                        <div className="container-fluid mt-3 mb-3">
                            <div className="row g-2 flex-wrap">
                                <div className="col-md-4">
                                    <div className="card card-social">
                                        <div className="img-container img-container-social">
                                            <div className="d-flex justify-content-between align-items-center p-2 first"> 
                                                <span className="percent percent-social">-25%</span> 
                                                <span className="wishlist wishlist-social">
                                                    <i className="fa fa-heart"></i>
                                                </span>
                                            </div> 
                                            <img src="https://i.imgur.com/zS03HnV.jpg" className="img-fluid"/>
                                        </div>
                                        <div className="product-detail-container">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0">Long sleev shirt</h6> 
                                                <span className="text-danger font-weight-bold">$3.99</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="ratings-social"> 
                                                    <i className="fa fa-star"></i> 
                                                    <span>4.5</span> 
                                                </div>
                                                <div className="size"> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size1" value="small"/>
                                                        <span>S</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size1" value="Medium" checked/> 
                                                        <span>M</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size1" value="Large"/> 
                                                        <span>L</span> 
                                                    </label> 
                                                </div>
                                            </div>
                                            <div className="mt-3"> 
                                                <button className="btn btn-danger btn-block">Buy Now</button> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card card-social">
                                        <div className="img-container img-container-social">
                                            <div className="d-flex justify-content-between align-items-center p-2 first"> 
                                                <span className="percent percent-social">-15%</span> 
                                                <span className="wishlist wishlist-social">
                                                    <i className="fa fa-heart"></i>
                                                </span> 
                                            </div> 
                                            <img src="https://i.imgur.com/gGyOciQ.jpg" className="img-fluid"/>
                                        </div>
                                        <div className="product-detail-container">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0">Black top caps</h6> 
                                                <span className="text-danger font-weight-bold">$1.99</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="ratings-social"> 
                                                    <i className="fa fa-star"></i> 
                                                    <span>4.5</span> 
                                                </div>
                                                <div className="size"> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size2" value="small"/> 
                                                        <span>S</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size2" value="Medium" checked/> 
                                                        <span>M</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size2" value="Large"/> 
                                                        <span>L</span> 
                                                    </label> 
                                                </div>
                                            </div>
                                            <div className="mt-3"> 
                                                <button className="btn btn-danger btn-block">Buy Now</button> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card card-social">
                                        <div className="img-container img-container-social">
                                            <div className="d-flex justify-content-between align-items-center p-2 first"> 
                                                <span className="percent percent-social">-35%</span> 
                                                <span className="wishlist wishlist-social">
                                                    <i className="fa fa-heart"></i>
                                                </span> 
                                            </div> 
                                            <img src="https://i.imgur.com/3VuD1Ij.jpg" className="img-fluid"/>
                                        </div>
                                        <div className="product-detail-container">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0">Kiton sui suit</h6> 
                                                <span className="text-danger font-weight-bold">$3.99</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="ratings-social"> 
                                                    <i className="fa fa-star"></i>
                                                    <span>4.5</span> 
                                                </div>
                                                <div className="size"> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size3" value="small"/> 
                                                        <span>S</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size3" value="Medium" checked/> 
                                                        <span>M</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size3" value="Large"/> 
                                                        <span>L</span> 
                                                    </label> 
                                                </div>
                                            </div>
                                            <div className="mt-3"> 
                                                <button className="btn btn-danger btn-block">Buy Now</button> 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card card-social">
                                        <div className="img-container img-container-social">
                                            <div className="d-flex justify-content-between align-items-center p-2 first"> 
                                                <span className="percent percent-social">-25%</span> 
                                                <span className="wishlist wishlist-social">
                                                    <i className="fa fa-heart"></i>
                                                </span> 
                                            </div> 
                                            <img src="https://i.imgur.com/psvQPza.jpg" className="img-fluid"/>
                                        </div>
                                        <div className="product-detail-container">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0">Long red shirt</h6> 
                                                <span className="text-danger font-weight-bold">$4.99</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <div className="ratings-social"> 
                                                    <i className="fa fa-star"></i> 
                                                    <span>4.5</span> 
                                                </div>
                                                <div className="size"> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size4" value="small"/> 
                                                        <span>S</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size4" value="Medium" checked/> 
                                                        <span>M</span> 
                                                    </label> 
                                                    <label className="radio"> 
                                                        <input type="radio" name="size4" value="Large"/> 
                                                        <span>L</span> 
                                                    </label> 
                                                </div>
                                            </div>
                                            <div className="mt-3"> 
                                                <button className="btn btn-danger btn-block">Buy Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="comments d-flex justify-content-center aligh-items-center">
                        <div className="wrapper-social wrapper">
                            <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: "340px"}}>
                                <a href="/" className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
                                    <svg className="bi me-2" style={{width:"30", height:"24"}}>
                                        <use xlink:href="#bootstrap"></use>
                                    </svg>
                                    <span className="fs-5 fw-semibold">Collection of Laptops</span>
                                </a>
                                <div className="list-group list-group-flush border-bottom scrollarea">
                                    <a href="#" className="list-group-item list-group-item-action active py-3 lh-tight" aria-current="true">
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <strong className="mb-1">Dell Laptop with 8GB RAM</strong>
                                            <small>Wed</small>
                                        </div>
                                        <div className="col-10 mb-1 small text-uppercase">8GB RAM | 256GB SSD | Graphics Card</div>
                                    </a>
                                    <a href="#" className="list-group-item list-group-item-action py-3 lh-tight">
                                        <div className="d-flex w-100 align-items-center justify-content-between">
                                            <strong className="mb-1">Dell Laptop with 8GB RAM</strong>
                                            <small className="text-muted">Tues</small>
                                        </div>
                                        <div className="col-10 mb-1 small text-uppercase">8GB RAM | 256GB SSD | Graphics Card</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>
}
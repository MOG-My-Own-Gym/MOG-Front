
export default function Profile(){


    return<>
        <div className="container" id="padding">
            <div className="container-fluid">
                <div className="row pt-5">
                    <div className="col-auto">
                        <div className="profile">
                            <div className="profile-head d-flex justify-content-around">
                                <div className="photo-content d-flex">
                                    <div className="profile-photo ms-5">
                                        <img src={"/img/team/1.jpg"} className="img-fluid col-md-8 rounded-circle" alt=""/>
                                    </div>
                                </div>
                                <div className="profile-info">
                                    <div className="row">
                                        <div className="col-auto">
                                            <div className="row">
                                                <div className="col-xl-10 col-sm-10 border-right-1 prf-col">
                                                    <div className="profile-name">
                                                        <h4 className="text-primary fs-1">Mitchell C. Shay</h4>
                                                        <p>UX / UI Designer</p>
                                                    </div>
                                                </div>
                                                <div className="col-xl-4 col-sm-4 border-right-1 prf-col">
                                                    <div className="profile-email">
                                                        <h4 className="text-muted">hello@email.com</h4>
                                                        <p>Email</p>
                                                    </div>
                                                </div>
                                                {/* 
                                                <div className="col-xl-4 col-sm-4 prf-col">
                                                    <div className="profile-call">
                                                        <h4 className="text-muted">(+1) 321-837-1030</h4>
                                                        <p>Phone No.</p>
                                                    </div>
                                                </div> 
                                                */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>
}
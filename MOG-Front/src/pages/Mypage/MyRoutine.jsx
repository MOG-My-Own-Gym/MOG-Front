import { useState } from "react";
export default function MyRoutine(){

    const HeartItem =()=>{
        const [isLiked, setIsLiked] = useState(false);
      
        const toggleHeart = e => {
            e.preventDefault();
          setIsLiked(!isLiked);
        };

        return <>
            <div>
                <button className="btn-routine" onClick={toggleHeart}>
                    {isLiked ? (
                        <img className="img-fluid img-routine" src="/img/like.png" alt="Filled Heart" style={{ height: '1.4em' }}/>
                    ) : (
                        <img className="img-fluid img-routine" src="/img/empty-like.png" alt="Empty Heart" style={{ height: '1.4em' }}/>
                    )}
                </button>
            </div>
        
        </>

    };

    return<>
        <div className="container">

            <div className="row d-flex justify-content-center mt-5 ">

                <div className="col-md-12 fs-4">
                    

                    <div className="card card-routine w-100 p-5 h-100">

                        <div className="d-flex justify-content-between align-items-center">

                            <span className="font-weight-bold">My Routine</span>

                            <div className="d-flex flex-row">

                                <button className="btn btn-routine btn-primary new"><i className="fa fa-plus"></i> New</button>
                                
                            </div>
                        
                        </div>

                        <div className="mt-3 inputs-routine">
                            <i className="fa fa-search"></i>
                            <input type="text" className="form-control-routine w-100" placeholder="Search Routines..."/>
                            
                        </div>


                        <div className="my-3">

                            <div className="d-flex justify-content-between align-items-center">

                                <div className="d-flex flex-row align-items-center routine-list">

                                    <span className="star"><i className="fa fa-star yellow"></i></span>

                                    <div className="d-flex flex-column">
                                        <span>루틴1</span>
                                    </div>
                                    

                                </div>

                                <HeartItem/>
                            
                            </div>
                            
                        </div>

                        <div className="my-3">

                            <div className="d-flex justify-content-between align-items-center">

                                <div className="d-flex flex-row align-items-center routine-list">

                                    <span className="star"><i className="fa fa-star yellow"></i></span>

                                    <div className="d-flex flex-column">
                                        <span>루틴2</span>
                                    </div>
                                    

                                </div>

                                <HeartItem/>
                            
                            </div>
                            
                        </div>

                        <div className="my-3">

                            <div className="d-flex justify-content-between align-items-center">

                                <div className="d-flex flex-row align-items-center routine-list">

                                    <span className="star"><i className="fa fa-star yellow"></i></span>

                                    <div className="d-flex flex-column">
                                        <span>루틴3</span>
                                    </div>
                                    

                                </div>

                                <HeartItem/>
                            
                            </div>
                            
                        </div>

                        <div className="my-3">

                            <div className="d-flex justify-content-between align-items-center">

                                <div className="d-flex flex-row align-items-center routine-list">

                                    <span className="star"><i className="fa fa-star yellow"></i></span>

                                    <div className="d-flex flex-column">
                                        <span>루틴4</span>
                                    </div>
                                    

                                </div>

                                <HeartItem/>
    
                            </div>
                            
                        </div>

                    </div>

                </div>


            </div>


        </div>
    
    </>
}
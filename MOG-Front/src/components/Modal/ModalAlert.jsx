import { useEffect } from "react";
import { useModalAlert } from "../../context/ModalAlertContext";
import "./css/modal.css";

export default function ModalAlert(){
    const {modalState, hideModal} = useModalAlert();

    //모달이 열리면 body스크롤 잠금, 닫힐때 해제
    useEffect(()=>{
        if(modalState.isVisible){
            document.body.style.overflow='hidden';
        }
        else{
            document.body.style.overflow='';
        }
        return ()=>{
            document.body.style.overflow=''; //컴포넌트 언마운트 시 초기화
        };
    },[modalState.isVisible]);

    //모달이 보이지 않을 때 렌더링 x
    if(!modalState.isVisible){
        return null;
    }

    return <>
       <div className="modal-backdrop fade show"></div>
       <div className="modal fade show" tabIndex="-1" role="dialog" aria-labelledby="modalAlertTitle" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-xl font-semibold" id="modalAlertTitle">알림</h5>
                    </div>
                    <div className="modal-body">
                        <p className="text-start">{modalState.message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-warning" onClick={hideModal}>확인</button>
                    </div>
                </div>
            </div>
       </div>
    </>
}
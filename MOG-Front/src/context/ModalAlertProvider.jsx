import { useReducer } from "react";
import ModalAlertContext from "./ModalAlertContext";

export default function ModalAlertProvider({children}){
    //초기값 - 알림메세지 없음, 모달보이지 않음
    const initialState={
        isVisible:false,
        message:''
    };

    //모달 리듀서
    function modalReducer(state, action){
        switch(action.type){
            case 'SHOW':
                return {...state, isVisible: true, message: action.payload.message};
            case 'HIDE':
                return {...state, isVisible: false, message:''};
            default: return state;
        }
    };

    const [state, dispatch]=useReducer(modalReducer, initialState);

    //showModal함수 : 모달 보여주고 매개변수로 전달된 message출력
    const showModal = message=>{
        dispatch({type:'SHOW', payload:{message}});
    };

    //hideModal함수 : 모달 안보이게 하기
    const hideModal = ()=>{
        dispatch({type:'HIDE'});
    };

    const value ={
        modalState:state,
        showModal,
        hideModal
    };

    return <>
        <ModalAlertContext.Provider value={value}>
            {children}
        </ModalAlertContext.Provider>
    </>
};
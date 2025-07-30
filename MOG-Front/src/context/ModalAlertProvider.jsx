import { useReducer, useRef } from "react";
import ModalAlertContext from "./ModalAlertContext";

export default function ModalAlertProvider({children}){
    //초기값 - 알림메세지 없음, 모달보이지 않음
    const initialState={
        isVisible:false,
        message:'',
        type:'alert'
    };

    //모달 리듀서
    function modalReducer(state, action){
        switch(action.type){
            case 'ALERT_SHOW'://일반 알림 모달
                return {...state, isVisible: true, message: action.payload.message, type:'alert'};
            case 'CONFIRM_SHOW'://확인 모달
                return {...state, isVisible: true, message: action.payload.message, type:'confirm'}
            case 'HIDE'://모달 숨기기
                return {...state, isVisible: false, message:''};
            default: return state;
        }
    };

    const [state, dispatch]=useReducer(modalReducer, initialState);

    //확인 모달의 Promise resolve/reject를 저장할 ref
    const confirmPromiseRef = useRef(null);

    //showModal함수 : 알림 모달 보여주고 매개변수로 전달된 message출력
    const showModal = message=>{
        dispatch({type:'ALERT_SHOW', payload:{message}});
    };

    //showConfirm함수 : 확인 모달 보여주고 Promise를 반환
    const showConfirm = message =>{
        return new Promise((resolve, reject)=>{
            dispatch({type:'CONFIRM_SHOW', payload:{message}});
            confirmPromiseRef.current={resolve, reject}; //Promise의 resolve함수를 저장
        })
    }
    //hideModal함수 : 모달 안보이게 하기 (외부에서 닫을때, 또는 confirm 취소 시)
    const hideModal = ()=>{
        //만약 확인 모달이 열려있고, 아직 처리되지 않앗다면 취소로 간주하여 false로 resolve
        if(state.type ==='confirm' && confirmPromiseRef.current){
            confirmPromiseRef.current.resolve(false);
            confirmPromiseRef.current=null;
        }
        dispatch({type:'HIDE'});
    };

    //handleConfirm함수 : 확인 모달의 확인/취소 버튼 클릭 시 호출
    const handleConfirm = confirmed =>{
        if(confirmPromiseRef.current){
            confirmPromiseRef.current.resolve(confirmed);
            confirmPromiseRef.current=null;
        }
        dispatch({type:'HIDE'});
    };

    const value ={
        modalState:state,
        showModal,
        hideModal,
        showConfirm,
        handleConfirm
    };

    return <>
        <ModalAlertContext.Provider value={value}>
            {children}
        </ModalAlertContext.Provider>
    </>
};
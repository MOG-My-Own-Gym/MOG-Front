import { useReducer } from "react";
import ModalAlertContext from "./ModalAlertContext";

export default function ModalAlertProvider({children}){
    const initialState={
        isVisible:false,
        message:''
    };

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

    const showModal = message=>{
        dispatch({type:'SHOW', payload:{message}});
    };

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
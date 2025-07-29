import { createContext, useContext} from "react";

const ModalAlertContext = createContext();

export function useModalAlert(){
    const context = useContext(ModalAlertContext);
    if(!context){
        throw new Error('useModalAlert는 반드시 ModalAlertProvider안에서 사용되어야 합니다');
    }
    return context;
}

export default ModalAlertContext;
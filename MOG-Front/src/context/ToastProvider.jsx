import { useReducer } from 'react';
import { ToastReducer } from '../reducer/ToastReducer';
import ToastContext from './ToastContext';

export default function ToastProvider({ children }) {
  const initialState = {
    isToast: false,
    content: 'content',
  };
  const [toast, dispatch] = useReducer(ToastReducer, initialState);
  return <ToastContext.Provider value={{ toast, dispatch }}>{children}</ToastContext.Provider>;
}

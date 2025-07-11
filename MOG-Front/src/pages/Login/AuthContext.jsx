import { createContext, useReducer } from "react";

const initialState = {user: JSON.parse(localStorage.getItem('user'))||null};

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.user));
            return {...state, user:action.user};
        case 'LOGOUT':
            localStorage.removeItem('user');
            return {...state, user:null};
        default:
            return state;
    };
};

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [state, dispatch]=useReducer(authReducer, initialState);

    return <>
        <AuthContext.Provider value={{user: state.user, dispatch}}>
            {children}
        </AuthContext.Provider>
    </>
};

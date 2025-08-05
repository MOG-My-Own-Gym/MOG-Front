import { createContext, useReducer } from 'react';
import useTimer from '../hooks/useTimer';

const initialState = {
  isRunning: false,
  detailTime: null,
  subDetailTime: null,
};

function routineReducer(state, action) {
  switch (action.type) {
    case 'RUN':
      return { ...state, isRunning: action.isRunning };
    default:
      return state;
  }
}

export const RoutineContext = createContext();

export function RoutineProvider({ children }) {
  const [state, dispatch] = useReducer(routineReducer, initialState);
  const timer = useTimer(10);

  return (
    <>
      <RoutineContext.Provider value={timer}>{children}</RoutineContext.Provider>
    </>
  );
}

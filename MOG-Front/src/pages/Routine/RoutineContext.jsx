import { createContext, useReducer } from 'react';

const initialState = {
  routine: JSON.parse(localStorage.getItem('routine')) || null,
  originRoutine: JSON.parse(localStorage.getItem('originRoutine')) || null,
};

function routineReducer(state, action) {
  switch (action.type) {
    case 'SAVE':
      localStorage.setItem('routine', JSON.stringify(action.routine));
      localStorage.setItem('originRoutine', JSON.stringify(action.originRoutine));
      return { ...state, routine: action.routine, originRoutine: action.originRoutine };
    default:
      return state;
  }
}

export const RoutineContext = createContext();

export function RoutineProvider({ children }) {
  const [state, dispatch] = useReducer(routineReducer, initialState);

  return (
    <>
      <RoutineContext.Provider
        value={{ routine: state.routine, originRoutine: state.originRoutine, dispatch }}
      >
        {children}
      </RoutineContext.Provider>
    </>
  );
}

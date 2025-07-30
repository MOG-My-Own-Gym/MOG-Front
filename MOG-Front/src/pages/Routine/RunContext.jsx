import { createContext, useReducer } from 'react';

const initialState = {
  isRunning: false,
  startTime: null,
  endTime: null,
};

function runReducer(state, action) {
  switch (action.type) {
    case 'RUN':
      const start = Date.now();
      return { ...state, isRunning: action.isRunning, startTime: start };
    case 'COMPLETE':
      const end = Date.now();
      return { ...state, isRunning: action.isRunning, endTime: end };
    default:
      return state;
  }
}

export const RunContext = createContext();

export function RunProvider({ children }) {
  const [state, dispatch] = useReducer(runReducer, initialState);

  return (
    <>
      <RunContext.Provider
        value={{
          isRunning: state.isRunning,
          startTime: state.startTime,
          endTime: state.endTime,
          dispatch,
        }}
      >
        {children}
      </RunContext.Provider>
    </>
  );
}

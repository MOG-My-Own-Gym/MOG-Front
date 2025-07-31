import { useReducer } from 'react';
import SuggestContext from './SuggestContext';

export default function SuggestProvider({ children }) {
  const initialState = {
    suggest: { Level: [], Type: [], BodyPart: [], Equipment: [] },
  };

  function suggestReducer(state, action) {
    switch (action.type) {
      case 'SAVE':
        return { ...state, suggest: action.payload.suggest };
      case 'INIT':
        return { ...state, suggest: initialState.suggest };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(suggestReducer, initialState);

  const saveSuggest = suggest => {
    dispatch({ type: 'SAVE', payload: { suggest } });
  };

  const initSuggest = () => {
    dispatch({ type: 'INIT' });
  };

  const value = {
    suggestState: state,
    saveSuggest,
    initSuggest,
  };

  return (
    <>
      <SuggestContext.Provider value={value}>{children}</SuggestContext.Provider>
    </>
  );
}

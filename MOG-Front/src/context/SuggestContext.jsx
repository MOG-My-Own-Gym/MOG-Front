import { createContext, useContext } from 'react';

const SuggestContext = createContext();

export function useSuggest() {
  const context = useContext(SuggestContext);

  return context;
}

export default SuggestContext;

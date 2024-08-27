import { useReducer } from 'react';
import { useEffect } from 'react';
import Header from './Header';
import Inicio from './Inicio';

const initialState = {
  questions: [],
  // 'loading', 'error' 'ready', 'active', 'finished'
  status: 'loading',
};
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };

    default:
      throw new Error('Action Unknown');
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(function () {
    fetch('http://localhost:3000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className='app '>
      <Header />
      <Inicio>
        <p>1/15</p>
        <p>Question?</p>
      </Inicio>
    </div>
  );
}

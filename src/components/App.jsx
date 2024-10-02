import { useReducer } from 'react';
import { useEffect } from 'react';
// componets
import Header from './Header';
import Inicio from './Inicio';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';

const initialState = {
  questions: [],
  // 'loading', 'error' 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
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
    case 'start':
      return {
        ...state,
        status: 'active',
      };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        anwser: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    default:
      throw new Error('Action Unknown');
  }
}

export default function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

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
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
          />
        )}
        {status === 'active' && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Inicio>
    </div>
  );
}

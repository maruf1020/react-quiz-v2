// # How to run this app
// firstly install npm
// then npm run server
// then npm start 


import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SEC_PER_POINT = 1;

const initialState = {
  questions: [],
  //Loading, error, ready, active, finished
  status: '',
  currentQuestionIndex: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondRemaining: null
}

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'dataReceived':
      return {
        ...state,
        questions: payload,
        status: 'ready'
      }
    case 'loading':
      return {
        ...state,
        status: 'loading'
      }
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      }
    case 'start':
      return {
        ...state,
        status: 'active',
        secondRemaining: state.questions.reduce((acc, question) => acc + question.points, 0) * SEC_PER_POINT
      }
    case 'newAnswer':
      const question = state.questions.at(state.currentQuestionIndex);
      return {
        ...state,
        answer: payload,
        points: payload === question.correctOption ? state.points + question.points : state.points
      }
    case 'nextQuestion':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answer: null
      }
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highScore: state.points > state.highScore ? state.points : state.highScore
      }
    case 'restart':
      console.log(state.questions)
      return { ...initialState, status: 'ready', questions: state.questions, highScore: state.highScore };
    case 'timer':
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining <= 0 ? 'finished' : state.status
      }

    default:
      throw new Error('Unknown action type');
  }
}

export default function App() {
  const [{ questions, status, currentQuestionIndex, answer, points, highScore, secondRemaining }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const totalPoints = questions.reduce((acc, question) => acc + question.points, 0);

  useEffect(() => {
    dispatch({ type: 'loading' });
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }))
  }, []);


  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' &&
          <>
            <Progress
              index={currentQuestionIndex}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={questions[currentQuestionIndex]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
              <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={currentQuestionIndex} />
            </Footer>
          </>
        }
        {status === 'finished' && <FinishScreen score={points} total={totalPoints} highScore={highScore} dispatch={dispatch} />}
      </Main>
    </div>
  )
}
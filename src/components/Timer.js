import { useEffect } from "react";

function Timer({ dispatch, secondRemaining }) {

    const minuit = Math.floor(secondRemaining / 60);
    const second = secondRemaining % 60;

    useEffect(() => {
        const timer = setInterval(() => {
            dispatch({ type: 'timer' })
        }, 1000);
        return () => clearInterval(timer);
    }, [dispatch]);

    return (
        <div className="timer">
            {minuit < 10 ? `0${minuit}` : minuit}:{second < 10 ? `0${second}` : second}
        </div>
    )
}

export default Timer

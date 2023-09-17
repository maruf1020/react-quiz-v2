function FinishScreen({ score, total, highScore, dispatch }) {

    const percentage = Math.round(score / total * 100);

    let emoji;
    if (percentage === 100) emoji = "🥇";
    if (percentage >= 80 && percentage < 100) emoji = "🎉";
    if (percentage >= 50 && percentage < 80) emoji = "🙃";
    if (percentage >= 0 && percentage < 50) emoji = "🤨";
    if (percentage === 0) emoji = "🤦‍♂️";

    return (
        <>
            <p className="result">
                {emoji} You scored <strong>{score}</strong> points out of <strong>{total}</strong> ({percentage}%)
            </p>
            <p className="high-score">(High score: {highScore} points)</p>

            <button className="btn btn-ui" onClick={() => dispatch({ type: 'restart' })}>Restart the Quiz</button>

        </>

    )
}

export default FinishScreen

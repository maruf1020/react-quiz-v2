function Progress({ index, numQuestions, points = 0, totalPoints = 0, answer }) {
    return (
        <header className="progress">
            {/* because we know (1 + true = 2) */}
            <progress max={numQuestions} value={index + Number(answer !== null)} />
            <p>Question <strong>{index + 1}</strong>/ {numQuestions}</p>
            <p><strong>{points}</strong>/ {totalPoints}</p>
        </header>
    )
}

export default Progress

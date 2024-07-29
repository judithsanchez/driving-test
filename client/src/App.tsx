import {useState, useEffect} from 'react';
import './App.css';

interface Question {
	id: string;
	prompt: string;
	correct: string;
	options: string[];
}

function App() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
	const [results, setResults] = useState<boolean[]>([]);
	const [shuffledOptions, setShuffledOptions] = useState<string[][]>([]);

	useEffect(() => {
		fetchRandomQuestions();
	}, []);

	const fetchRandomQuestions = async () => {
		try {
			const response = await fetch('http://localhost:3000/questions');
			const allQuestions = await response.json();
			const shuffled = allQuestions.sort(() => 0.5 - Math.random());
			const selected = shuffled.slice(0, 5);
			setQuestions(selected);
			setSelectedAnswers(new Array(selected.length).fill(''));
			setResults(new Array(selected.length).fill(false));
			setShuffledOptions(selected.map(question => shuffleOptions(question)));
		} catch (error) {
			console.error('Error fetching questions:', error);
		}
	};

	const shuffleOptions = (question: Question) => {
		return [...question.options, question.correct].sort(
			() => 0.5 - Math.random(),
		);
	};

	const handleAnswerChange = (questionIndex: number, answer: string) => {
		const newAnswers = [...selectedAnswers];
		newAnswers[questionIndex] = answer;
		setSelectedAnswers(newAnswers);
	};

	const checkAnswer = (questionIndex: number) => {
		const question = questions[questionIndex];
		const selectedAnswer = selectedAnswers[questionIndex];
		const isCorrect = selectedAnswer === question.correct;
		const newResults = [...results];
		newResults[questionIndex] = isCorrect;
		setResults(newResults);
	};

	return (
		<div className="app">
			<h1>Driving Test</h1>
			{questions.map((question, index) => (
				<div
					key={question.id}
					className={`question-container ${
						results[index] !== false
							? results[index]
								? 'correct'
								: 'incorrect'
							: ''
					}`}
				>
					<h2 className="question-prompt">{question.prompt}</h2>
					<div className="options-container">
						{shuffledOptions[index].map((option, optionIndex) => (
							<label key={optionIndex} className="option-label">
								<input
									type="radio"
									name={`question-${question.id}`}
									value={option}
									checked={selectedAnswers[index] === option}
									onChange={() => handleAnswerChange(index, option)}
								/>
								{option}
							</label>
						))}
					</div>
					<button className="check-button" onClick={() => checkAnswer(index)}>
						Check Answer
					</button>
					{results[index] !== false && (
						<div className="result-container">
							<p className="result-text">
								{results[index] ? 'Correct!' : 'Incorrect.'}
							</p>
							<p className="correct-answer">
								Correct answer: {question.correct}
							</p>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

export default App;

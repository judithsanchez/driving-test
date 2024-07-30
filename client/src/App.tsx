import {useState, useEffect, useRef} from 'react';
import './App.css';
import {Question, SelectedAnswers, Results, ShuffledOptions} from './lib/types';
import {
	NUM_QUESTIONS,
	DRIVING_TEST_TITLE,
	CHECK_ANSWER_TEXT,
	CORRECT_ANSWER_TEXT,
	ERROR_FETCHING_QUESTIONS,
} from './lib/constants';
import {
	fetchRandomQuestions,
	shuffleOptions,
	initializeArrays,
	updateQuestionStats,
	postPracticeSession,
} from './lib/utils';

function App() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>([]);
	const [results, setResults] = useState<Results>([]);
	const [shuffledOptions, setShuffledOptions] = useState<ShuffledOptions>([]);
	const [practiceSession, setPracticeSession] = useState<PracticeSession>({
		date: new Date(),
		correct_answers: 0,
		incorrect_answers: 0,
	});

	const hasRunEffect = useRef(false);

	useEffect(() => {
		if (hasRunEffect.current) return;
		hasRunEffect.current = true;

		const newSession = {
			date: new Date(),
			correct_answers: 0,
			incorrect_answers: 0,
		};
		setPracticeSession(newSession);
		postPracticeSession(newSession);
	}, []);

	useEffect(() => {
		const loadQuestions = async () => {
			try {
				const selected = await fetchRandomQuestions(NUM_QUESTIONS);
				setQuestions(selected);
				const [newAnswers, newResults] = initializeArrays(selected.length);
				setSelectedAnswers(newAnswers);
				setResults(newResults);
				setShuffledOptions(selected.map(shuffleOptions));
			} catch (error) {
				console.error(ERROR_FETCHING_QUESTIONS, error);
			}
		};
		loadQuestions();
	}, []);

	const handleAnswerChange = (questionIndex: number, answer: string) => {
		setSelectedAnswers(prev => {
			const newAnswers = [...prev];
			newAnswers[questionIndex] = answer;
			return newAnswers;
		});
	};

	const checkAnswer = async (questionIndex: number) => {
		const question = questions[questionIndex];
		const selectedAnswer = selectedAnswers[questionIndex];
		const isCorrect = selectedAnswer === question.correct;

		setResults(prev => {
			const newResults = [...prev];
			newResults[questionIndex] = isCorrect;
			return newResults;
		});

		setPracticeSession(prev => ({
			...prev,
			correct_answers: isCorrect
				? prev.correct_answers + 1
				: prev.correct_answers,
			incorrect_answers: isCorrect
				? prev.incorrect_answers
				: prev.incorrect_answers + 1,
		}));

		await updateQuestionStats(question, isCorrect);

		setQuestions(prev => {
			const newQuestions = [...prev];
			newQuestions[questionIndex] = {
				...newQuestions[questionIndex],
				streak: isCorrect,
			};
			return newQuestions;
		});
	};

	return (
		<div className="app">
			<h1>{DRIVING_TEST_TITLE}</h1>
			{questions.map((question, index) => (
				<div
					key={question.id}
					className={`question-container ${
						results[index] !== null
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
									disabled={results[index] !== null}
								/>
								{option}
							</label>
						))}
					</div>
					<button
						className={`check-button ${
							results[index] === false ? 'incorrect' : ''
						}`}
						onClick={() => checkAnswer(index)}
						disabled={results[index] !== null}
					>
						{CHECK_ANSWER_TEXT}
					</button>

					{results[index] !== null && !results[index] && (
						<div className="result-container">
							<p className="correct-answer incorrect">
								{CORRECT_ANSWER_TEXT} {question.correct}
							</p>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

export default App;

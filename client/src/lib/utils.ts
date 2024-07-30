import {API_URL, ERROR_UPDATING_QUESTION} from './constants';
import {PracticeSession, Question} from './types';

export const shuffleArray = <T>(array: T[]): T[] => {
	return [...array].sort(() => 0.5 - Math.random());
};

export const shuffleOptions = (question: Question): string[] => {
	return shuffleArray([...question.options, question.correct]);
};

export const fetchRandomQuestions = async (
	numQuestions: number,
): Promise<Question[]> => {
	const response = await fetch(`${API_URL}/questions`);
	const allQuestions = (await response.json()) as Question[];
	return shuffleArray(allQuestions).slice(0, numQuestions);
};

export const initializeArrays = (
	length: number,
): [string[], boolean[], string[][]] => {
	return [
		new Array(length).fill(''),
		new Array(length).fill(null),
		new Array(length).fill([]),
	];
};

export const updateQuestionStats = async (
	question: Question,
	isCorrect: boolean,
): Promise<void> => {
	const updatedQuestion = {
		...question,
		correct_answer: isCorrect
			? question.correct_answer + 1
			: question.correct_answer,
		incorrect_answer: isCorrect
			? question.incorrect_answer
			: question.incorrect_answer + 1,
		streak: isCorrect,
	};

	try {
		const response = await fetch(`${API_URL}/${question.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedQuestion),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error(ERROR_UPDATING_QUESTION, error);
	}
};

export const postPracticeSession = async (
	session: PracticeSession,
): Promise<void> => {
	console.log('Attempting to post session:', session);
	try {
		const response = await fetch(`${API_URL}/practice_sessions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(session),
		});
		console.log('Response status:', response.status);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		console.log('Session posted successfully');
	} catch (error) {
		console.error('Error posting practice session:', error);
	}
};

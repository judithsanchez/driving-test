import {API_URL, ERROR_UPDATING_QUESTION} from './constants';
import {Question} from './types';

export const shuffleArray = <T>(array: T[]): T[] => {
	return [...array].sort(() => 0.5 - Math.random());
};

export const shuffleOptions = (question: Question): string[] => {
	return shuffleArray([...question.options, question.correct]);
};

export const fetchRandomQuestions = async (
	numQuestions: number,
): Promise<Question[]> => {
	const response = await fetch(API_URL);
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

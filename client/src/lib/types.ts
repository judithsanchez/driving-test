export interface Question {
	id: string;
	prompt: string;
	correct: string;
	options: string[];
	streak: boolean;
	correct_answer: number;
	incorrect_answer: number;
}

export type SelectedAnswers = string[];
export type Results = boolean[];
export type ShuffledOptions = string[][];

export interface PracticeSession {
	date: Date;
	correct_answers: number;
	incorrect_answers: number;
}

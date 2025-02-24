import { useState } from 'react';
import { motion } from 'framer-motion';

export interface SurveyQuestion {
  id: string;
  question: string;
  options: string[];
}

const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'motivation',
    question: 'What excites you most about Mars?',
    options: [
      'Adventure & Exploration',
      'Scientific Discovery',
      'Building a Legacy',
      'Economic Opportunities',
      'Ensuring Human Survival'
    ]
  },
  {
    id: 'concerns',
    question: 'What\'s your biggest concern about moving to Mars?',
    options: [
      'The Astronomical Cost',
      'Safety Concerns',
      'Ethical Implications',
      'Practical Challenges',
      'Personal Readiness'
    ]
  },
  {
    id: 'knowledge',
    question: 'How would you rate your Mars knowledge?',
    options: [
      'Total Skeptic',
      'Curious Beginner',
      'Casual Enthusiast',
      'Amateur Expert',
      'Future Martian CEO'
    ]
  }
];

interface SurveyProps {
  onComplete: (answers: Record<string, string>) => void;
}

export default function Survey({ onComplete }: SurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [surveyQuestions[currentQuestion].id]: answer
    };
    setAnswers(newAnswers);

    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log('Survey complete, sending answers:', newAnswers);
      onComplete(newAnswers);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <motion.div
        key={currentQuestion}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-red-600">
          {surveyQuestions[currentQuestion].question}
        </h2>
        <div className="space-y-4">
          {surveyQuestions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 text-left bg-white border-2 border-red-400 rounded-lg hover:bg-red-50 transition-colors"
            >
              {option}
            </motion.button>
          ))}
        </div>
        <div className="text-center text-gray-500">
          Question {currentQuestion + 1} of {surveyQuestions.length}
        </div>
      </motion.div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface SurveyQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
}

const surveyQuestions: SurveyQuestion[] = [
  // Fear-based questions
  {
    id: 'fear_crisis',
    category: 'Fear',
    question: 'Have you ever felt that the current state of the world is heading toward a crisis, and that failing to act could have severe consequences?',
    options: [
      'Strongly agree - I feel this urgency daily',
      'Somewhat agree - It concerns me occasionally',
      'Neutral - I try not to think about it',
      'Somewhat disagree - Things will work out',
      'Strongly disagree - The future looks bright'
    ]
  },
  {
    id: 'fear_survival',
    category: 'Fear',
    question: 'Do you worry about potential future events—such as environmental collapse or societal breakdown—that might force you into survival situations?',
    options: [
      'Very frequently - It keeps me up at night',
      'Often - I actively prepare for such scenarios',
      'Sometimes - When I see concerning news',
      'Rarely - I prefer to stay optimistic',
      'Never - These fears are overblown'
    ]
  },
  {
    id: 'fear_regret',
    category: 'Fear',
    question: 'When you consider your future, how much do you fear that inaction now could lead to regret or irreversible loss later?',
    options: [
      'Extremely concerned - I must act now',
      'Very concerned - I think about it often',
      'Moderately concerned - It's on my mind',
      'Slightly concerned - I take it as it comes',
      'Not concerned - I live in the present'
    ]
  },
  // Spirituality questions
  {
    id: 'spiritual_purpose',
    category: 'Spirituality',
    question: 'Do you feel that your life has a higher purpose or calling that guides your major decisions?',
    options: [
      'Absolutely - My purpose drives everything',
      'Mostly - I often consider my calling',
      'Sometimes - I'm still discovering it',
      'Rarely - I'm more practical minded',
      'Not at all - I make rational decisions'
    ]
  },
  {
    id: 'spiritual_values',
    category: 'Spirituality',
    question: 'How do your personal beliefs or spiritual values influence your long-term goals?',
    options: [
      'They are the foundation of all my choices',
      'They strongly influence major decisions',
      'They provide general guidance',
      'They play a minor role',
      'They don't influence my decisions'
    ]
  },
  {
    id: 'spiritual_destiny',
    category: 'Spirituality',
    question: 'Have you ever felt destined to pursue a path that aligned with your spiritual or religious convictions?',
    options: [
      'Yes, frequently and powerfully',
      'Yes, on important occasions',
      'Sometimes, but I'm not sure',
      'Rarely, if ever',
      'Never experienced this'
    ]
  },
  // Financial questions
  {
    id: 'money_security',
    category: 'Financial',
    question: 'How important is financial security and reward in your career decisions?',
    options: [
      'It's my primary motivation',
      'Very important, but not everything',
      'Equally important as other factors',
      'Somewhat important',
      'Not a major consideration'
    ]
  },
  {
    id: 'money_incentives',
    category: 'Financial',
    question: 'When evaluating opportunities, what role do monetary incentives play in your decision-making?',
    options: [
      'They are the deciding factor',
      'They heavily influence my choice',
      'They're one of several factors',
      'They're a minor consideration',
      'They rarely affect my decisions'
    ]
  },
  {
    id: 'money_challenges',
    category: 'Financial',
    question: 'Would significant financial benefits motivate you to take on challenging or risky projects?',
    options: [
      'Absolutely - High risk, high reward',
      'Usually - If the reward is worth it',
      'Sometimes - Depends on the situation',
      'Rarely - I prefer stability',
      'Never - Money isn't worth the risk'
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

  const currentCategory = surveyQuestions[currentQuestion].category;
  const progressPercentage = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-red-400 cyber-text uppercase tracking-wider">Progress</span>
          <span className="text-sm font-medium text-red-400 cyber-text">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        className="space-y-8"
      >
        <div className="text-sm font-medium text-red-400 mb-2 cyber-text uppercase tracking-widest">
          {currentCategory}
        </div>
        
        <h2 className="text-2xl font-bold text-white cyber-text">
          {surveyQuestions[currentQuestion].question}
        </h2>

        <div className="space-y-4">
          {surveyQuestions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
              className="w-full p-4 text-left cyber-button rounded-lg group"
            >
              <span className="flex items-center">
                <span className="inline-block w-6 h-6 border-2 border-red-500 rounded-full mr-3 group-hover:border-white transition-colors" />
                {option}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="text-center text-red-400 cyber-text uppercase tracking-wider text-sm">
          Question {currentQuestion + 1} of {surveyQuestions.length}
        </div>
      </motion.div>
    </motion.div>
  );
}

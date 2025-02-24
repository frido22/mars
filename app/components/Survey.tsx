import { useState } from 'react';

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
      'Moderately concerned - I\'m on my mind',
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
      'Sometimes - I\'m still discovering it',
      'Rarely - I\'m more practical minded',
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
      'They don\'t influence my decisions'
    ]
  },
  {
    id: 'spiritual_destiny',
    category: 'Spirituality',
    question: 'Have you ever felt destined to pursue a path that aligned with your spiritual or religious convictions?',
    options: [
      'Yes, frequently and powerfully',
      'Yes, on important occasions',
      'Sometimes, but I\'m not sure',
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
      'It\'s my primary motivation',
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
      'They\'re one of several factors',
      'They\'re a minor consideration',
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
      'Never - Money isn\'t worth the risk'
    ]
  }
];

interface SurveyProps {
  onComplete: (answers: Record<string, string>) => void;
}

const Survey = ({ onComplete }: SurveyProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (answer: string) => {
    const currentQuestion = surveyQuestions[currentQuestionIndex];
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answer
    };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;

  return (
    <div className="cyber-container p-8 rounded-lg max-w-2xl mx-auto floating">
      <div className="mb-8">
        <h2 className="cyber-text text-2xl mb-2 glowing-text">
          {currentQuestion.category}
        </h2>
        <div className="progress-bar mb-4">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="cyber-text text-xl mb-6">
          {currentQuestion.question}
        </p>
      </div>

      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="cyber-button w-full p-4 text-left option-hover"
          >
            <span className="inline-block w-8 text-center mr-2 text-neon-red">
              {String.fromCharCode(65 + index)}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 text-sm text-center cyber-text">
        Question {currentQuestionIndex + 1} of {surveyQuestions.length}
      </div>
    </div>
  );
};

export default Survey;

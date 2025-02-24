import { useState, useEffect } from 'react';

interface ResultsProps {
  answers: string[];
}

interface ApiResponse {
  whyLeave: string;
  whyMars: string;
  howToGet: string;
  error?: string;
}

const Results = ({ answers }: ResultsProps) => {
  const [responses, setResponses] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateResponse = async () => {
      try {
        const res = await fetch('/api/generate-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        });

        if (!res.ok) throw new Error('Failed to generate response');

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        setResponses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to analyze your Mars readiness. Please try again.');
        setLoading(false);
      }
    };

    generateResponse();
  }, [answers]);

  if (error) {
    return (
      <div className="cyber-container p-8 rounded-lg max-w-2xl mx-auto text-center">
        <h2 className="cyber-text text-2xl mb-4 glowing-text">System Error</h2>
        <p className="cyber-text text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="cyber-button mt-6 px-8 py-3"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cyber-container p-8 rounded-lg max-w-2xl mx-auto text-center">
        <h2 className="cyber-text text-2xl mb-4 glowing-text">Analyzing Mars Readiness</h2>
        <div className="cyber-border p-4 mb-4">
          <div className="space-y-2">
            <div className="h-2 bg-red-500/20 rounded animate-pulse"></div>
            <div className="h-2 bg-red-500/20 rounded animate-pulse delay-75"></div>
            <div className="h-2 bg-red-500/20 rounded animate-pulse delay-150"></div>
          </div>
        </div>
        <p className="cyber-text">Processing neural patterns...</p>
      </div>
    );
  }

  if (!responses) return null;

  const sections = [
    {
      title: "Why Leave Earth? 🌍",
      content: responses.whyLeave,
      icon: "🚀"
    },
    {
      title: "Why Mars? 🔴",
      content: responses.whyMars,
      icon: "✨"
    },
    {
      title: "Your Journey Plan 🛸",
      content: responses.howToGet,
      icon: "🌠"
    }
  ];

  return (
    <div className="cyber-container p-8 rounded-lg max-w-2xl mx-auto floating">
      <h2 className="cyber-text text-2xl mb-6 glowing-text text-center">
        Your Mars Destiny Revealed! 🚀
      </h2>
      
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="cyber-card p-6 hover:transform hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{section.icon}</span>
              <h3 className="cyber-text text-xl glowing-text">
                {section.title}
              </h3>
            </div>
            <div className="cyber-text leading-relaxed pl-12">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button 
          onClick={() => window.location.reload()} 
          className="cyber-button px-8 py-3"
        >
          Begin New Mars Journey 🚀
        </button>
      </div>
    </div>
  );
};

export default Results;

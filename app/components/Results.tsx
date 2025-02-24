import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ResultsProps {
  answers: Record<string, string>;
}

interface ApiResponse {
  whyLeave?: string;
  whyMars?: string;
  howToGet?: string;
  error?: string;
}

export default function Results({ answers }: ResultsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const getPersonalizedResponse = async () => {
      try {
        console.log('Sending answers to API:', answers);
        
        const result = await fetch('/api/generate-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        });
        
        if (!result.ok) {
          const errorData = await result.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.error || 'Failed to generate response');
        }

        const data = await result.json();
        console.log('API success response:', data);
        
        if (!data.whyLeave || !data.whyMars || !data.howToGet) {
          throw new Error('Invalid response format from server');
        }
        
        setResponse(data);
        setError(null);
      } catch (error) {
        console.error('Failed to generate response:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    getPersonalizedResponse();
  }, [answers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-red-600 animate-bounce">
          🚀 Calculating your cosmic destiny...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-6">
        <h2 className="text-2xl font-bold mb-4">Houston, we have a problem!</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="text-center text-red-600">
        Oops! Something went wrong with our Mars-o-meter!
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 space-y-8"
    >
      <h1 className="text-4xl font-bold text-red-600 text-center">
        Your Mars Destiny Awaits! 🚀
      </h1>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-400"
      >
        <h2 className="text-2xl font-bold mb-3">Why Leave Earth? 🌍</h2>
        <p className="text-lg">{response.whyLeave}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-400"
      >
        <h2 className="text-2xl font-bold mb-3">Why Mars? 🔴</h2>
        <p className="text-lg">{response.whyMars}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-400"
      >
        <h2 className="text-2xl font-bold mb-3">Your Travel Plan 🛸</h2>
        <p className="text-lg">{response.howToGet}</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mx-auto block mt-8 px-8 py-4 bg-red-600 text-white rounded-full text-xl font-bold hover:bg-red-700 transition-colors"
        onClick={() => window.location.reload()}
      >
        Start New Mars Journey 🚀
      </motion.button>
    </motion.div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { useConfig } from '../ConfigContext';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';

export default function QuestionFlow() {
  const { id } = useParams<{ id: string }>();
  const { config, loading } = useConfig();
  const navigate = useNavigate();

  if (loading || !config) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const question = config.questions.find((q) => q.id === id);

  if (!question) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Pergunta não encontrada</div>;
  }

  const handleOptionClick = (opt: { nextPath: string, pixelSnippet?: string }) => {
    if (opt.pixelSnippet) {
      try {
        new Function(opt.pixelSnippet)();
      } catch (e) {
        console.error('Error executing option pixel snippet', e);
      }
    }

    const { nextPath } = opt;
    if (nextPath.startsWith('q_')) {
      navigate(`/q/${nextPath}`);
    } else if (nextPath.startsWith('r_')) {
      navigate(`/result/${nextPath}`);
    } else {
      // Fallback
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div 
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6"
        >
          {config.branding.logoUrl && (
            <img 
              src={config.branding.logoUrl} 
              alt="Logo" 
              className="h-10 mx-auto object-contain opacity-50"
            />
          )}
          <h2 className="text-2xl font-bold text-center text-gray-800 leading-snug">
            {question.text}
          </h2>
          
          <div className="flex flex-col gap-3 pt-4">
            {question.options.map((opt) => (
              <Button
                key={opt.id}
                onClick={() => handleOptionClick(opt)}
                variant="outline"
                className="w-full text-left justify-start px-6 bg-gray-50 text-gray-800 hover:bg-brand-primary hover:text-white border border-gray-200 transition-all font-normal text-base h-auto py-4 rounded-xl"
              >
                {opt.text}
              </Button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

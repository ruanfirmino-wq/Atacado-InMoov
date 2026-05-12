import { useNavigate } from 'react-router-dom';
import { useConfig } from '../ConfigContext';
import { Button } from '../components/ui/Button';

export default function Home() {
  const { config, loading } = useConfig();
  const navigate = useNavigate();

  if (loading || !config) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const startQuiz = () => {
    if (config.questions.length > 0) {
      navigate(`/q/${config.questions[0].id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full animate-fade-in">
        {config.branding.logoUrl && (
          <img 
            src={config.branding.logoUrl} 
            alt="Logo" 
            className="h-16 mx-auto mb-8 object-contain"
          />
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          {config.homepage.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {config.homepage.subtitle}
        </p>
        <Button onClick={startQuiz} className="w-full text-lg shadow-lg">
          {config.homepage.buttonText}
        </Button>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { useConfig } from '../ConfigContext';
import { Button } from '../components/ui/Button';

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const { config, loading } = useConfig();

  if (loading || !config) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const result = config.results.find((r) => r.id === id);

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">Resultado não encontrado</div>;
  }

  const handleRedirect = () => {
    window.location.href = result.redirectUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl animate-fade-in-up">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{result.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{result.description}</p>
        <Button onClick={handleRedirect} className="w-full text-lg shadow-md hover:shadow-lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}

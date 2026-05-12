import { useState, useEffect } from 'react';
import { useConfig } from '../ConfigContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Settings, Image, Target, Code, Palette, LogOut, ChevronRight, LogIn } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { AppConfig, Question, ResultPage } from '../types';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function AdminDashboard() {
  const { config, saveConfig } = useConfig();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'branding'|'homepage'|'pixels'|'flow'>('flow');
  const [localConfig, setLocalConfig] = useState<AppConfig | null>(config);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        setLocalConfig(config);
      }
    });
    return () => unsub();
  }, [config]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Erro ao fazer login:', e);
      alert('Erro ao fazer login');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSave = async () => {
    if (!localConfig) return;
    try {
      await saveConfig(localConfig);
      alert('Configurações salvas!');
    } catch (e: any) {
      console.error(e);
      alert('Erro ao salvar. Verifique se você tem permissão ou consulte o console.');
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center p-6 text-xl">Verificando autenticação...</div>;

  if (!user || !localConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
          <p className="text-sm text-gray-500 mb-6">Entre com sua conta do Google para acessar o painel administrativo.</p>
          <Button onClick={handleLogin} className="w-full flex items-center gap-2 justify-center bg-white text-gray-800 border hover:bg-gray-50 hover:text-gray-900 border-gray-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-primary" /> Admin
        </h1>
        <nav className="flex-1 space-y-2">
          <TabButton active={activeTab === 'flow'} onClick={() => setActiveTab('flow')} icon={<Target />} label="Funil (Perguntas/Resultados)" />
          <TabButton active={activeTab === 'homepage'} onClick={() => setActiveTab('homepage')} icon={<Image />} label="Página Inicial" />
          <TabButton active={activeTab === 'branding'} onClick={() => setActiveTab('branding')} icon={<Palette />} label="Aparência (Logo/Cores)" />
          <TabButton active={activeTab === 'pixels'} onClick={() => setActiveTab('pixels')} icon={<Code />} label="Pixels de Rastreamento" />
        </nav>
        <Button variant="outline" className="mt-auto w-full text-red-600 border-red-200 hover:bg-red-50" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 min-h-full p-8 relative">
           
           <div className="flex justify-between items-center border-b pb-4 mb-8">
             <h2 className="text-2xl font-semibold text-gray-800 capitalize">
               {activeTab === 'flow' ? 'Construtor de Funil' : activeTab}
             </h2>
             <Button onClick={handleSave}>Salvar Alterações</Button>
           </div>

           {/* Tab Content Rendering */}
           {activeTab === 'branding' && (
             <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Logo</label>
                  <Input 
                    value={localConfig.branding.logoUrl} 
                    onChange={e => setLocalConfig({...localConfig, branding: {...localConfig.branding, logoUrl: e.target.value}})}
                    placeholder="https://exemplo.com/logo.png"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cor Primária (Botões)</label>
                  <div className="flex gap-4 items-center">
                    <Input 
                      type="color" 
                      className="w-16 h-12 p-1"
                      value={localConfig.branding.primaryColor} 
                      onChange={e => setLocalConfig({...localConfig, branding: {...localConfig.branding, primaryColor: e.target.value}})}
                    />
                    <span className="text-sm text-gray-500">{localConfig.branding.primaryColor}</span>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cor de Fundo (Background)</label>
                  <div className="flex gap-4 items-center">
                    <Input 
                      type="color" 
                      className="w-16 h-12 p-1"
                      value={localConfig.branding.backgroundColor} 
                      onChange={e => setLocalConfig({...localConfig, branding: {...localConfig.branding, backgroundColor: e.target.value}})}
                    />
                    <span className="text-sm text-gray-500">{localConfig.branding.backgroundColor}</span>
                  </div>
               </div>
             </div>
           )}

           {activeTab === 'homepage' && (
             <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal</label>
                  <Input 
                    value={localConfig.homepage.title} 
                    onChange={e => setLocalConfig({...localConfig, homepage: {...localConfig.homepage, title: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-brand-primary"
                    rows={3}
                    value={localConfig.homepage.subtitle} 
                    onChange={e => setLocalConfig({...localConfig, homepage: {...localConfig.homepage, subtitle: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Botão Iniciar</label>
                  <Input 
                    value={localConfig.homepage.buttonText} 
                    onChange={e => setLocalConfig({...localConfig, homepage: {...localConfig.homepage, buttonText: e.target.value}})}
                  />
               </div>
             </div>
           )}

           {activeTab === 'pixels' && (
             <div className="space-y-6">
               <p className="text-sm text-gray-500">Cole scripts de rastreamento (ex: Pixel do Facebook, Google Analytics) abaixo.</p>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Head Scripts (&lt;head&gt;)</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 p-3 font-mono text-xs h-40"
                    placeholder="<!-- Add your script here -->"
                    value={localConfig.pixels.headScripts} 
                    onChange={e => setLocalConfig({...localConfig, pixels: {...localConfig.pixels, headScripts: e.target.value}})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Scripts (&lt;body&gt;)</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 p-3 font-mono text-xs h-40"
                    value={localConfig.pixels.bodyScripts} 
                    onChange={e => setLocalConfig({...localConfig, pixels: {...localConfig.pixels, bodyScripts: e.target.value}})}
                  />
               </div>
             </div>
           )}

           {activeTab === 'flow' && (
             <FlowBuilder localConfig={localConfig} setLocalConfig={setLocalConfig} />
           )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-blue-50 text-brand-primary' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon} {label}
    </button>
  );
}

// Flow Builder subcomponent to manage questions and results
function FlowBuilder({ localConfig, setLocalConfig }: { localConfig: AppConfig, setLocalConfig: any }) {
  
  const addQuestion = () => {
    const newQ: Question = {
      id: `q_${uuidv4().split('-')[0]}`,
      text: 'Nova Pergunta?',
      options: []
    };
    setLocalConfig({ ...localConfig, questions: [...localConfig.questions, newQ] });
  };

  const removeQuestion = (id: string) => {
    setLocalConfig({ ...localConfig, questions: localConfig.questions.filter(q => q.id !== id) });
  };

  const addOption = (qId: string) => {
    const updatedQs = localConfig.questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: [...q.options, { id: `opt_${uuidv4().split('-')[0]}`, text: 'Nova opção', nextPath: '' }]
        };
      }
      return q;
    });
    setLocalConfig({ ...localConfig, questions: updatedQs });
  };

  const updateOption = (qId: string, optId: string, field: string, value: string) => {
    const updatedQs = localConfig.questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(opt => opt.id === optId ? { ...opt, [field]: value } : opt)
        };
      }
      return q;
    });
    setLocalConfig({ ...localConfig, questions: updatedQs });
  };

  const removeOption = (qId: string, optId: string) => {
    const updatedQs = localConfig.questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optId)
        };
      }
      return q;
    });
    setLocalConfig({ ...localConfig, questions: updatedQs });
  };

  const updateQuestionText = (id: string, val: string) => {
    setLocalConfig({ ...localConfig, questions: localConfig.questions.map(q => q.id === id ? { ...q, text: val } : q) });
  };

  const addResult = () => {
    const newR: ResultPage = {
      id: `r_${uuidv4().split('-')[0]}`,
      title: 'Página Final',
      description: 'Chegamos ao fim',
      redirectUrl: 'https://exemplo.com'
    };
    setLocalConfig({ ...localConfig, results: [...localConfig.results, newR] });
  };

  const removeResult = (id: string) => {
    setLocalConfig({ ...localConfig, results: localConfig.results.filter(r => r.id !== id) });
  };

  const updateResult = (id: string, field: string, val: string) => {
    setLocalConfig({ ...localConfig, results: localConfig.results.map(r => r.id === id ? { ...r, [field]: val } : r) });
  };

  // Build the list of valid destinations for the dropdown
  const destinations = [
    ...localConfig.questions.map(q => ({ label: `Pergunta: ${q.id}`, value: q.id })),
    ...localConfig.results.map(r => ({ label: `Resultado: ${r.id}`, value: r.id }))
  ];

  return (
    <div className="space-y-12">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Perguntas ({localConfig.questions.length})</h3>
          <Button onClick={addQuestion} variant="outline" className="h-8 py-1 rounded">Adicionar Pergunta</Button>
        </div>
        
        <div className="space-y-6">
          {localConfig.questions.map((q, qIndex) => (
            <div key={q.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50 relative group">
              <button 
                onClick={() => removeQuestion(q.id)} 
                className="absolute top-4 right-4 text-xs text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remover Pergunta
              </button>
              
              <div className="mb-4 pr-24">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">ID: {q.id}</label>
                <Input value={q.text} onChange={e => updateQuestionText(q.id, e.target.value)} className="font-medium text-lg leading-tight p-2 h-auto" />
              </div>

              <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Opções:</h4>
                {q.options.map((opt) => (
                  <div key={opt.id} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <Input 
                      value={opt.text} 
                      onChange={e => updateOption(q.id, opt.id, 'text', e.target.value)} 
                      placeholder="Texto da Opção"
                      className="flex-1 h-9 text-sm"
                    />
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <select 
                      value={opt.nextPath} 
                      onChange={e => updateOption(q.id, opt.id, 'nextPath', e.target.value)}
                      className="flex-1 h-9 rounded-md border border-gray-300 text-sm px-2 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Destino Condicional (Selecione...)</option>
                      {destinations.map(dest => (
                        <option key={dest.value} value={dest.value}>{dest.label}</option>
                      ))}
                    </select>
                    <button onClick={() => removeOption(q.id, opt.id)} className="text-gray-400 hover:text-red-500 p-2">✕</button>
                  </div>
                ))}
                <Button onClick={() => addOption(q.id)} variant="outline" className="h-8 py-1 text-xs border-dashed text-gray-600 bg-transparent">
                  + Nova Opção
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Páginas de Finalização (Resultados) ({localConfig.results.length})</h3>
          <Button onClick={addResult} variant="outline" className="h-8 py-1 rounded">Adicionar Resultado</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localConfig.results.map((r) => (
            <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white relative group">
              <button 
                onClick={() => removeResult(r.id)} 
                className="absolute top-4 right-4 text-xs text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remover
              </button>
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">ID: {r.id}</label>
              <div className="space-y-3">
                <Input value={r.title} onChange={e => updateResult(r.id, 'title', e.target.value)} placeholder="Título (ex: Excelente!)" />
                <textarea 
                    className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-brand-primary"
                    rows={2}
                    placeholder="Descrição..."
                    value={r.description} 
                    onChange={e => updateResult(r.id, 'description', e.target.value)}
                />
                <div>
                  <label className="text-xs text-gray-500">URL de Redirecionamento (Local Final)</label>
                  <Input value={r.redirectUrl} onChange={e => updateResult(r.id, 'redirectUrl', e.target.value)} placeholder="https://..." className="mt-1 bg-gray-50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

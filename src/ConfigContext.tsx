import { createContext, useContext, useEffect, useState } from 'react';
import { AppConfig } from './types';
import { fetchConfig, updateConfig } from './api';

interface ConfigContextType {
  config: AppConfig | null;
  loading: boolean;
  saveConfig: (newConfig: AppConfig) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig()
      .then(data => {
        setConfig(data);
        document.documentElement.style.setProperty('--color-primary', data.branding.primaryColor);
        document.documentElement.style.setProperty('--color-bg', data.branding.backgroundColor);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveConfig = async (newConfig: AppConfig) => {
    const success = await updateConfig(newConfig);
    if (success) {
      setConfig(newConfig);
      document.documentElement.style.setProperty('--color-primary', newConfig.branding.primaryColor);
      document.documentElement.style.setProperty('--color-bg', newConfig.branding.backgroundColor);
    } else {
      throw new Error('Falha ao salvar');
    }
  };

  return (
    <ConfigContext.Provider value={{ config, loading, saveConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

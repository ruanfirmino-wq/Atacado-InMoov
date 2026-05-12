import { useEffect, useRef } from 'react';
import { useConfig } from './ConfigContext';

export function PixelInjector() {
  const { config, loading } = useConfig();
  const injectedRef = useRef(false);

  useEffect(() => {
    if (loading || !config || injectedRef.current) return;

    try {
      if (config.pixels.headScripts.trim()) {
        const fragment = document.createRange().createContextualFragment(config.pixels.headScripts);
        document.head.appendChild(fragment);
      }
      if (config.pixels.bodyScripts.trim()) {
        const fragment = document.createRange().createContextualFragment(config.pixels.bodyScripts);
        document.body.appendChild(fragment);
      }
      injectedRef.current = true;
    } catch (e) {
      console.error('Erro ao injetar pixels', e);
    }
  }, [config, loading]);

  return null;
}

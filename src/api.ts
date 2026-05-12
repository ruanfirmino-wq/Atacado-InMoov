import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { AppConfig } from './types';
import { handleFirestoreError, OperationType } from './firestoreError';

const CONFIG_DOC_ID = 'main';

const DEFAULT_CONFIG: AppConfig = {
  adminUids: [],
  branding: {
    logoUrl: '',
    primaryColor: '#3b82f6',
    backgroundColor: '#f3f4f6',
  },
  homepage: {
    title: 'Descubra seu perfil ideal!',
    subtitle: 'Responda a este breve questionário para encontrar a melhor oportunidade para você.',
    buttonText: 'Começar Agora',
  },
  pixels: {
    headScripts: '',
    bodyScripts: '',
  },
  questions: [
    {
      id: 'q_initial',
      text: 'Qual o seu objetivo principal hoje?',
      options: [
        { id: 'opt_1', text: 'Aprender uma nova habilidade', nextPath: 'r_learning' },
        { id: 'opt_2', text: 'Ganhar mais dinheiro', nextPath: 'r_money' }
      ]
    }
  ],
  results: [
    {
      id: 'r_learning',
      title: 'Ótima Escolha!',
      description: 'Recomendamos o nosso curso focado em iniciantes.',
      redirectUrl: 'https://exemplo.com/curso',
    },
    {
      id: 'r_money',
      title: 'Excelente!',
      description: 'Temos um método para faturar rápido.',
      redirectUrl: 'https://exemplo.com/metodo',
    }
  ]
};

export const fetchConfig = async (): Promise<AppConfig> => {
  try {
    const docRef = doc(db, 'configurations', CONFIG_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Omit the adminUids field from being passed straight down, or just return as is
      return docSnap.data() as AppConfig;
    } else {
      // Return default config if not initialized in Firestore yet.
      return DEFAULT_CONFIG;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `configurations/${CONFIG_DOC_ID}`);
    return DEFAULT_CONFIG; // fallback
  }
};

export const updateConfig = async (config: AppConfig): Promise<boolean> => {
  try {
    const docRef = doc(db, 'configurations', CONFIG_DOC_ID);
    
    const existingUids = config.adminUids || [];
    const currentUserUid = auth.currentUser?.uid;
    const adminUids = Array.from(new Set([...existingUids, currentUserUid].filter(Boolean)));
    
    const payload = {
      ...config,
      adminUids
    };
    
    // Use setDoc with merge: false to overwrite, but also ensuring we conform to the blueprint
    await setDoc(docRef, payload, { merge: false });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `configurations/${CONFIG_DOC_ID}`);
    return false;
  }
};

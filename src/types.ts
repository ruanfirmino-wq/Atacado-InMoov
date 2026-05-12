export interface Option {
  id: string;
  text: string;
  nextPath: string; // ID of the next question or result
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
}

export interface ResultPage {
  id: string;
  title: string;
  description: string;
  redirectUrl: string;
}

export interface AppConfig {
  adminUids?: string[];
  branding: {
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
  };
  homepage: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  pixels: {
    headScripts: string;
    bodyScripts: string;
  };
  questions: Question[];
  results: ResultPage[];
}

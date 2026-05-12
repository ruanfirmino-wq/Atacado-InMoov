export interface Option {
  id: string;
  text: string;
  nextPath: string; // ID of the next question or result
  pixelSnippet?: string; // JavaScript to execute when option is selected (e.g., fbq('track...'))
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
  pixelSnippet?: string; // JavaScript to execute when result is shown
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
    pixelSnippet?: string; // JavaScript to execute when start button is clicked
  };
  pixels: {
    headScripts: string;
    bodyScripts: string;
  };
  questions: Question[];
  results: ResultPage[];
}

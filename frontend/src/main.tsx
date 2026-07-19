import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { TelegramProvider } from './telegram/TelegramProvider';

import './index.css';

const rootElement = document.getElementById('root');

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function showFatalError(error: unknown) {
  const message =
    error instanceof Error
      ? `${error.name}: ${error.message}\n\n${error.stack ?? ''}`
      : String(error);

  console.error('Frontend fatal error:', error);

  document.body.innerHTML = `
    <main style="
      min-height:100vh;
      padding:24px;
      background:#f4efe7;
      color:#2d241d;
      font-family:system-ui,sans-serif;
    ">
      <h1 style="font-size:24px">
        Ошибка запуска frontend
      </h1>

      <pre style="
        white-space:pre-wrap;
        overflow-wrap:anywhere;
        padding:16px;
        border:1px solid #d8c7b3;
        border-radius:12px;
        background:#fffaf3;
      ">${escapeHtml(message)}</pre>
    </main>
  `;
}

window.addEventListener('error', (event) => {
  showFatalError(event.error ?? event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  showFatalError(event.reason);
});

try {
  if (!rootElement) {
    throw new Error('HTML element #root was not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <TelegramProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TelegramProvider>
    </StrictMode>,
  );
} catch (error) {
  showFatalError(error);
}

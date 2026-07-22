import {
  StrictMode,
} from 'react';
import {
  createRoot,
} from 'react-dom/client';
import {
  BrowserRouter,
} from 'react-router-dom';

import App from './App';
import {
  TelegramProvider,
} from './telegram/TelegramProvider';

import './styles/index.css';

const rootElement =
  document.getElementById(
    'root',
  );

function showFatalError(
  error: unknown,
) {
  console.error(
    'Frontend fatal error:',
    error,
  );

  if (!rootElement) {
    return;
  }

  const main =
    document.createElement(
      'main',
    );

  main.className =
    'fatal-error';

  const title =
    document.createElement(
      'h1',
    );

  title.textContent =
    'Не удалось открыть VERSTAK';

  const description =
    document.createElement(
      'p',
    );

  description.textContent =
    'Закройте приложение, проверьте соединение и попробуйте снова.';

  main.append(
    title,
    description,
  );

  rootElement.replaceChildren(
    main,
  );
}

window.addEventListener(
  'error',
  (event) => {
    showFatalError(
      event.error ||
        event.message,
    );
  },
);

window.addEventListener(
  'unhandledrejection',
  (event) => {
    showFatalError(
      event.reason,
    );
  },
);

try {
  if (!rootElement) {
    throw new Error(
      'HTML element #root was not found',
    );
  }

  createRoot(
    rootElement,
  ).render(
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

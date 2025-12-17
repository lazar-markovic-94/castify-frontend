import { QueryProvider } from './app/providers/QueryProvider';
import { AppRouter } from './app/router';
import { ToastProvider } from './shared/contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </ToastProvider>
  );
}

export default App;

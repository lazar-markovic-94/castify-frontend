import { QueryProvider } from './app/providers/QueryProvider';
import { AppRouter } from './app/router';

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;

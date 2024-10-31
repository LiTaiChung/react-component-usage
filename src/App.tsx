import { useRoutes } from 'react-router-dom';

import routes from './routes';

function App() {
  const appRoutes = useRoutes(routes);
  return appRoutes;
}

export default App;

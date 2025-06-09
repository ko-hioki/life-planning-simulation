import { Routes, Route } from 'react-router-dom';
import { HomePage, WizardPage } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wizard" element={<WizardPage />} />
    </Routes>
  );
}

export default App;

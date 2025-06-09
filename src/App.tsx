import { Routes, Route } from 'react-router-dom';
import { HomePage, WizardPage } from './pages';
import { TestSimulationPage } from './pages/TestSimulationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wizard" element={<WizardPage />} />
      <Route path="/test" element={<TestSimulationPage />} />
    </Routes>
  );
}

export default App;

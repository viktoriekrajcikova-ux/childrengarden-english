import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DifficultyPage from './pages/DifficultyPage';
import MapPage from './pages/MapPage';
import LevelPage from './pages/LevelPage';
import ReviewPage from './pages/ReviewPage';
import VictoryPage from './pages/VictoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DifficultyPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/level/:id" element={<LevelPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/victory" element={<VictoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/shared/ErrorBoundary';

const DifficultyPage = lazy(() => import('./pages/DifficultyPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const LevelPage = lazy(() => import('./pages/LevelPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const VictoryPage = lazy(() => import('./pages/VictoryPage'));

export default function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Suspense fallback={<div style={{ textAlign: 'center', paddingTop: '40vh', fontSize: '2em' }}>Nahrávám...</div>}>
      <Routes>
        <Route path="/" element={<DifficultyPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/level/:id" element={<LevelPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/victory" element={<VictoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

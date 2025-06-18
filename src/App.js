import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClassicView from './pages/ClassicView';
import PokemonDetail from './pages/PokemonDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/classic" element={<ClassicView />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="*" element={<ClassicView />} />
      </Routes>
    </Router>
  );
}

export default App;
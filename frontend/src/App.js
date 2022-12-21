import './App.css';
import {Routes, Route} from 'react-router-dom';

import Home from './Components/Home';
import CropRecommender from './Components/CropRecommender';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crop-recommender" element={<CropRecommender />} />
      </Routes>
    </div>
  );
}

export default App;

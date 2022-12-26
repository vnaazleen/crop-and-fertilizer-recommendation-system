import './App.css';
import {Routes, Route} from 'react-router-dom';

import Home from './Components/Home/Home';
import CropRecommender from './Components/CropRecommender/CropRecommender';
import Geolocation from './Components/Geolocation/Geolocation';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crop-recommender" element={<CropRecommender />} />
        <Route path="/geolocation" element={<Geolocation />} />
      </Routes>
    </div>
  );
}

export default App;

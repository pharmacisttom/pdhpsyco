import { useState, useEffect } from 'react'
import Home from './components/Home'
import Assessment2Q9Q from './components/Assessment2Q9Q'
import AssessmentSPST20 from './components/AssessmentSPST20'
import AssessmentTHI15 from './components/AssessmentTHI15'
import './index.css'

function App() {
  const [currentView, setCurrentView] = useState('home');

  // Simple router based on state
  const navigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      {currentView === 'home' && <Home onNavigate={navigate} />}
      {currentView === '2q9q' && <Assessment2Q9Q onNavigate={navigate} />}
      {currentView === 'spst20' && <AssessmentSPST20 onNavigate={navigate} />}
      {currentView === 'thi15' && <AssessmentTHI15 onNavigate={navigate} />}
    </div>
  )
}

export default App

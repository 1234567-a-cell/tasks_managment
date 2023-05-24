import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './SideBar';
import TaskManager from './TaskManager';
// Import other components

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />

        <Routes>
          {/* Other routes */}
          <Route path="/tasks">
            <TaskManager />
          </Route>
          {/* Other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

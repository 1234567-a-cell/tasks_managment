import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaskManager from './TaskManager';
// import CategoryManager from './CategoryManager';

function Sidebar() {
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <Router>
      <div className="d-flex">
        <div className="sidebar">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                to="/tasks"
                className={`nav-link ${activeLink === 'tasks' ? 'active' : ''}`}
                onClick={() => handleLinkClick('tasks')}
              >
                Tasks Management
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/categories"
                className={`nav-link ${activeLink === 'categories' ? 'active' : ''}`}
                onClick={() => handleLinkClick('categories')}
              >
                Category Management
              </Link>
            </li>
          </ul>
        </div>
        <div className="content">
          <Routes>
            <Route path="/tasks">
              <TaskManager />
            </Route>
            {/* <Route path="/categories">
              <CategoryManager />
            </Route> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Sidebar;

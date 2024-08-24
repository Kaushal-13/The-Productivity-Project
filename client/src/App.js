import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import Kanban from './components/Kanban'

const App = () => {
  return (
    <Router>
      <div>
        <nav >
          <Link to="/">Home</Link>
        </nav>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/kanban/:id' element={<Kanban />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

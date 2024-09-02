import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Cadastro from './components/Cadastro/Cadastro';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

function App() {
  const [socket, setSocket] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Cadastro/>} />
          <Route path="/join" element={<Join setSocket={setSocket} />} />
          <Route path="/chat" element={<Chat socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

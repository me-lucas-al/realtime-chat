import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import io from 'socket.io-client';
import style from './Join.module.css';
import { Input, CircularProgress } from '@mui/material';
import logo from '/src/assets/images/logo.png';

export default function Join({ setSocket }) {
  const usernameRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const socket = io('wss://chat-cheetah.onrender.com', {
      reconnectionAttempts: 3,
      timeout: 10000
    });

    socket.on('connect_error', () => {
      setErrorMessage('Conectando com o servidor...');
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [setSocket]);

  const handleSubmit = () => {
    const username = usernameRef.current.value;
    if (!username.trim()) return;
    
    setErrorMessage('');
    setLoading(true);

    const socket = io('wss://chat-cheetah.onrender.com');
    
    socket.emit('set_username', username);

    socket.on('username_set', () => {
      setLoading(false);
      setSocket(socket);
      navigate('/chat'); 
    });

    socket.on('error_message', (errorMessage) => {
      setErrorMessage(errorMessage);
      setLoading(false);
      socket.disconnect();
    });
  };

  const getEnterKey = (e) => {
    if (e.key === 'Enter') handleSubmit(); 
  };

  return (
    <>
      <div className="img">
        <img src={logo} alt="logo" style={{ width: '400px', height: 'auto', marginBottom: '15%' }} onClick={() => navigate('/')} />
      </div>
      <div className={style['join-container']}>
        <h2>Registre seu usuário</h2>
        <Input inputRef={usernameRef} placeholder='Nome de usuário' onKeyDown={getEnterKey} disabled={loading} />
        <button 
          style={{ width: '120px', height: 'auto', background: 'black', marginTop: '5%', color: 'white' }} 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </button>
        <Link to="/" style={{ marginTop: '20px', marginBottom: '-10px' }}>Voltar</Link>
        {errorMessage && <p style={{ color: 'green' }}>{errorMessage}</p>} 
      </div>
    </>
  );
}

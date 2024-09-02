import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import io from 'socket.io-client';
import style from './Join.module.css';
import { Input, Button } from '@mui/material';
import logo from '/src/components/images/logo.png';

export default function Join({ setSocket }) {
  const usernameRef = useRef();
  const navigate = useNavigate(); 

  const handleSubmit = async () => {
    const username = usernameRef.current.value;
    if (!username.trim()) return;

    const socket = await io.connect('wss://chat-cheetah.onrender.com');

    socket.on('error_message', (errorMessage) => {
      alert(errorMessage); 
      socket.disconnect();
    });

    socket.emit('set_username', username);

    socket.on('username_set', () => {
      setSocket(socket);
      navigate('/chat'); 
    });
  };

  return (
    <>
    <div className="img">
      <img src={logo} alt="logo" style={{ width: '400px', height: 'auto', marginBottom: '15%'}} onClick={() => navigate('/')} />
    </div>
    <div className={style['join-container']}>
      <h2>Registre seu usuário</h2>
      <Input inputRef={usernameRef} placeholder='Nome de usuário' />
      <button style={{ width: '120px', height: 'auto', background: 'black', marginTop: '5%'}} sx={{mt:2}} onClick={handleSubmit} variant="contained">Entrar</button>
      <Link to="/" style={{marginTop: '20px', marginBottom:'-10px'}}>Voltar</Link>
    </div>
    </>
  );
}

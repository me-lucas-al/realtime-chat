import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import style from './Chat.module.css';
import logo from '/src/assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Chat({ socket }) {
  const bottomRef = useRef();
  const messageRef = useRef();
  const [messageList, setMessageList] = useState([]);
  const [userColors, setUserColors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (Array.isArray(data)) {
        setMessageList(data);
      } else {
        setMessageList((current) => [...current, data]);
      }
    });

    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(() => {
    setMessageList((prevList) => 
      prevList.map((message) => {
        if (!userColors[message.author] && message.authorId !== socket.id) {
          userColors[message.author] = generateDarkColor();
        }
        return message;
      })
    );
  }, [messageList, userColors]);

  useEffect(() => {
    scrollDown();
  }, [messageList]);

  const generateDarkColor = () => {
    const randomValue = () => Math.floor(Math.random() * 128); 
    const red = randomValue();
    const green = randomValue();
    const blue = randomValue();
    return `rgb(${red}, ${green}, ${blue})`;
  };

  const handleSubmit = () => {
    const message = messageRef.current.value;
    if (!message.trim()) return;

    socket.emit('message', message);
    clearInput();
    focusInput();
  };

  const clearInput = () => {
    messageRef.current.value = '';
  };

  const focusInput = () => {
    messageRef.current.focus();
  };

  const getEnterKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <img 
        src={logo} 
        alt="logo" 
        style={{ width: '300px', height: 'auto', marginLeft: '15%', cursor: 'pointer'}} 
        onClick={() => navigate('/')} 
      />
      <div className={style['chat-container']}>
        <div className={style['chat-body']}>
          {messageList.map((message, index) => (
            <div
              className={`${style['message-container']} ${message.authorId === socket.id ? style['message-mine'] : ''}`}
              key={index}
            >
              <div
                className="message-author"
                style={{
                  color: message.authorId === socket.id
                    ? 'darkblue'
                    : message.systemMessage
                    ? 'grey'
                    : userColors[message.author],
                  textAlign: message.systemMessage ? 'center' : 'left',
                }}
              >
                <strong>{message.authorId === socket.id ? 'Você' : message.author}</strong>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className={style['chat-footer']}>
          <Input 
            inputRef={messageRef} 
            placeholder='Mensagem' 
            onKeyDown={(e) => getEnterKey(e)} 
            fullWidth 
          />
          <SendIcon 
            sx={{ m: 1, cursor: 'pointer' }} 
            onClick={handleSubmit} 
            color="primary" 
          />
        </div>
      </div>
    </div>
  );
}

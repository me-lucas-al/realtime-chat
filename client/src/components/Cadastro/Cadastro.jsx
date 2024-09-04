import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/images/logo.png';
import style from './Cadastro.module.css';

export default function Cadastro() {
  const navigate = useNavigate();

  const handleAlunoClick = () => {
    navigate('/join');
  };

  const handleMonitorClick = () => {
    alert("Os administradores não te adequaram para monitor");
  };

  return (
    <div>
      <div className="img">
        <img src={logo} alt="logo" style={{ width: '400px', height: 'auto', position: 'relative', bottom: '10px', left: '30px' }} />
      </div>
      <main>
        <div className={style.login}>
          <h2>Você vai entrar como:</h2>
          <button className={style.btnOpcao} onClick={handleAlunoClick}>Aluno</button>
          <button className={style.btnOpcao} onClick={handleMonitorClick}>Monitor</button><br />
        </div>
      </main>
    </div>
  );
}

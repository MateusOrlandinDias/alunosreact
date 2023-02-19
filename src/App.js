import React, { useState } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import logoCadastro from './assets/caderneta.png';

function App() {
  const baseUrl = "https://localhost:44369/api/alunos";

  const [data, setData] = useState([]);

  const pedidoGet = async()=>{
    
  }
  
  return (
    <div className="App">
      <br/>
      <h3>Cadastro de Alunos</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro"/>
        <button className='btn btn-success'>Incluir Novo Aluno</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {/*Exibir os dados*/}
        </tbody>
      </table>
    </div>
  );
}

export default App;

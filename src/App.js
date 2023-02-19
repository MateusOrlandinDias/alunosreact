import React, { useState, useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import logoCadastro from './assets/caderneta.png';

function App() {
  const baseUrl = "https://localhost:44369/api/alunos";

  const [data, setData] = useState([]);

  const pedidoGet = async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  /*
  pedidoGet() fica dentro de useEffect para que seja executado sempre (independente de data ter sido alterada) para 
  o caso da variavel data ter sido alterada.

  Se eu usasse:
  useEffect(()=>{
    pedidoGet();
  }, [])
  Ele executaria pedidoGet() somente a primeira vez em que foi renderizada

  Se eu usasse:
  useEffect(()=>{
    pedidoGet();
  }, [data])
  Ele só executaria pedidoGet() quando data fosse atualizada

  Mas queremos que ele esteja sempre atualizando neste projeto.
  */
  useEffect(()=>{
    pedidoGet();
  })
  
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
          {/*Exibir os dados
          O .map serve para mapear e o que precisamos de data
          o tr com a key é para que a linha de cada aluno tenha seu priprio ID como chave unica*/}
          {data.map(aluno=>(
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className='btn btn-primary'>Editar</button> {"   "}
                <button className='btn btn-danger'>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

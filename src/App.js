import React, { useState, useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/caderneta.png';
import logoAlunosAPI from './assets/Logo.png';
import User from './assets/User.png';

function App() {
  //End-point para o GET
  const baseUrl = "https://localhost:44369/api/alunos";

  //State requisição API
  /*O useState é um Hook do React que é usado para adicionar o estado ao componente 
  funcional. Ele permite que você atualize o estado do componente e force o 
  componente a ser renderizado novamente sempre que o estado é alterado.

  No código fornecido, const [data, setData] = useState([]); define um estado 
  data vazio e uma função setData para atualizar o estado. Ele é usado para 
  armazenar a lista de alunos obtidos da API.
   */
  const [data, setData] = useState([]);

  /*Defini o State para abrir e fechar o modal e deixei o default em false 
  Para checkagem deste estado, devemos verificar o estado isOpen={modalIncluir}
  pelo componente Modal no return do HTML*/
  const [modalIncluir, setModalIncluir]=useState(false);


  /*Aqui eu defino um novo estado de um novo aluno (con infos zeradas)
  e defini uma função setAlunoSelecionado para enviar as informações desse novo
  aluno assim que o estado dele for alterado.

  Os mesmos "name"s que eu usei aqui, terão que ser especificados nos inputs
  do Modal, ex:
<input type="text" name="nome" className='form-control'/>
<input type="text" name="email" className='form-control'/>
<input type="text" name="idade" className='form-control'/>

E preciso também chamar a função handleChange na opção "onChange" dos
inputs do Modal. Ou seja, sempre que eu mudar a info de um input do modal,
vai estar sincronizado atualizando no meu banco de dados.

Ex final input:
<input type="text" className='form-control' name="nome" onChange={handleChange}/>
<input type="text" className='form-control' name="email" onChange={handleChange}/>
<input type="text" className='form-control' name="idade" onChange={handleChange}/>

   */
  const [alunoSelecionado, setAlunoSelecionado]= useState({
    id:'',
    nome: '',
    email: '',
    idade: ''
  })

  /*Ao chamar esta função, é dado um toggle no modal de incluir */
  const abrirFecharModalIncluir=()=>{
    setModalIncluir(!modalIncluir);
  }

  /*Seguindo o state alunoSelecionado, abaixo temos a função handleChange
  para pegar as informações do form Modal e enviar setar esta mudança de state */
  const handleChange = e=>{
    const {name, value} = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado, [name]: value
    });
    console.log(alunoSelecionado);
  }

  //Função GET API para att a tabela
  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  //Função POST API para inserir um novo aluno
  const pedidoPost=async()=>{
    console.log("Post");
    delete alunoSelecionado.id; //Deleta esse ID que tinha sido criado em branco para atualizar o ID criado pelo banco de dados
    alunoSelecionado.idade=parseInt(alunoSelecionado.idade);//converte idade pra int
      await axios.post(baseUrl, alunoSelecionado)
    .then(response=>{
      setData(data.concat(response.data)); //Usa o state data com sua função setData para atualizar o front
      abrirFecharModalIncluir();//Da o toggle na tabela
    }).catch(error=>{
      console.log(error);
    })
  }

  //Effect para requisição API e atualização de dados
  /*O useEffect é outro Hook do React que é usado para executar efeitos colaterais 
  em componentes funcionais. O useEffect é executado após cada renderização do 
  componente e recebe uma função que pode executar qualquer ação, como obter 
  dados de uma API.
  
  pedidoGet() fica dentro de useEffect para que seja executado sempre 
  (independente de data ter sido alterada).

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
  useEffect(() => {
    pedidoGet();
  })

  /*Estava com problema de renderização infinita que basicamente ele chamava pedidoPost 
    antes de o usuario clickar, durante a renderização. Abaixo o que não funcionou:
    <button className='btn btn-primary' onClick={pedidoPost()}>Incluir</button>{"    "}
    o que deve ser feito:
    <button className='btn btn-primary' onClick={() => pedidoPost()}>Incluir</button>{"    "}
  */

  return (
    <div className="aluno-container">
      <header>
        <div class="logo"><img src={logoAlunosAPI} alt='Logo'/></div>
        <nav>
          <ul>
            <li><a href="#">Cadastro de Alunos</a></li>
          </ul>
        </nav>
        <div class="user-profile">
          <img src={User} alt='Logo'/>
          <p>User</p>
          <></>
        </div>
      </header>

      <div className='alunos'>
        <div className='incluir-alunos'>
          <img src={logoCadastro} alt="Cadastro" />
          <button className='btn btn-success' onClick={()=>abrirFecharModalIncluir()}>Incluir Novo Aluno</button>
        </div>  
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
            {data.map(aluno => (
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

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nome:</label>
            <br/>
            <input type="text" className='form-control' name="nome" onChange={handleChange}/>
            <br/>
            <label>Email:</label>
            <br/>
            <input type="text" className='form-control' name="email" onChange={handleChange}/>
            <br/>
            <label>Idade:</label>
            <br/>
            <input type="text" className='form-control' name="idade" onChange={handleChange}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={()=>pedidoPost()}>Incluir</button>{"    "}
          <button className='btn btn-danger' onClick={()=>abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;

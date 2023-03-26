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
  const [modalIncluir, setModalIncluir] = useState(false);

  /*useState de abertura do modal de editar, semelhante ao modar incluir. 
  Também foi definido como padão false */
  const [modalEditar, setModalEditar] = useState(false);

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
  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    idade: ''
  })

  /*Metodo para selecionar o aluno e abrir o modal editar */
  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    (opcao==="Editar") &&
      abrirFecharModalEditar();

  }

  /*Ao chamar esta função, é dado um toggle no modal de incluir */
  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  /*Fução para mudar o state do modal na propriedade isOpen do front-end */
  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  /*Seguindo o state alunoSelecionado, abaixo temos a função handleChange
  para pegar as informações do form Modal e enviar setar esta mudança de state 
  
  o handleChange é chamado sempre para editar um modal ou criar novas infos no modal...
  Ele se linka com algum aluno atravez do .target pois cada linha daquelas tem uma key 
  na tabela, o que ja deve linkar com o aluno certo, pelo que eu entendo.

  E se não existir ele deve adicionar, conforme o spread "..." em setAlunoSelecionado mostra. 

  Basicamente o handleChange conecta as mudanças feitas no modal com o post, put e tal
  */
  const handleChange = e => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado, [name]: value
    });
    console.log(`Estamos no handle change, o aluno selecionado é: ${alunoSelecionado}`);
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
  const pedidoPost = async () => {
    console.log("Post");
    delete alunoSelecionado.id; //Deleta esse ID que tinha sido criado em branco para atualizar o ID criado pelo banco de dados
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);//converte idade pra int
    await axios.post(baseUrl, alunoSelecionado)
      .then(response => {
        setData(data.concat(response.data)); //Usa o state data com sua função setData para atualizar o front
        abrirFecharModalIncluir();//Da o toggle na tabela
      }).catch(error => {
        console.log(error);
      })
  }

  /*O put vai transformar a idade para int para começar,
  fazer um axios.put pro base url+/id do aluno e vai atribuir todos os valores configurados agora, assim
  atualizando as infos de tal aluno. 
  
  Verifica dentre os alunos qual foi alterado para atribuir as modificações... 
  O comportamento funciona por conta do .map*/
  const pedidoPut = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(baseUrl + "/" + alunoSelecionado.id, alunoSelecionado)
      .then(response => {
        console.log(`Response put: ${response}}`);
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(aluno => {
          if (aluno.id === alunoSelecionado.id) {
            aluno.nome = resposta.nome;
            aluno.email = resposta.email;
            aluno.idade = resposta.idade;
          }
        });
        abrirFecharModalEditar();
        console.log(`Estamos no put, o aluno modificado e as modificações são: ${alunoSelecionado}`);
      }).catch(error => {
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
        <div class="logo"><img src={logoAlunosAPI} alt='Logo' /></div>
        <nav>
          <ul>
            <li><a href="#">Cadastro de Alunos</a></li>
          </ul>
        </nav>
        <div class="user-profile">
          <img src={User} alt='Logo' />
          <p>User</p>
          <></>
        </div>
      </header>

      <div className='alunos'>
        <div className='incluir-alunos'>
          <img src={logoCadastro} alt="Cadastro" />
          <button className='btn btn-success' onClick={() => abrirFecharModalIncluir()}>Incluir Novo Aluno</button>
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
                  <button className='btn btn-primary' onClick={() => selecionarAluno(aluno, "Editar")}>Editar</button> {"   "}
                  <button className='btn btn-danger' onClick={() => selecionarAluno(aluno, "Excluir")}>Excluir</button>
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
            <br />
            <input type="text" className='form-control' name="nome" onChange={handleChange} />
            <br />
            <label>Email:</label>
            <br />
            <input type="text" className='form-control' name="email" onChange={handleChange} />
            <br />
            <label>Idade:</label>
            <br />
            <input type="text" className='form-control' name="idade" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPost()}>Incluir</button>{"    "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>ID: </label>
            <input type="text" className="form-control" readOnly
              value={alunoSelecionado && alunoSelecionado.id} />
            <br />
            <label>Nome: </label><br />
            {/*É necessário no value fazer a condição alunoSelecionado && alunoSelecionado.nome pois
            pode ocorrer um erro de não haver alunosSelecionados, nesse caso ele só ignora o value*/}
            <input type="text" className="form-control" name="nome" onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.nome} /><br />
            <label>Email: </label><br />
            <input type="text" className="form-control" name="email" onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.email} /><br />
            <label>Idade: </label><br />
            <input type="text" className="form-control" name="idade" onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.idade} /><br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPut()}>Editar</button>{"    "}
          <button className='btn btn-danger' onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;

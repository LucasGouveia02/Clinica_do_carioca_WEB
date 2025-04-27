const perfil = 'PACIENTE';
// const perfil = 'MEDICO';
const usuarioId = 1;
const usuarioName = "Ana";

const greeting = document.getElementById('greeting');
const botaoBuscar = document.querySelector(".btn-filtro");
const botaoDetalhes = document.querySelector(".btn-detalhes");
var consultaIdLinhaSelecionada = null;
let currentPage = 1;
let totalPages = 0;
let data = [];

fetchData();

async function fetchData(page = 0) {
  try {
    let response;
    if (perfil === 'MEDICO') {
      response = await fetch(`http://localhost:8080/consulta/historico/medico?medicoId=${usuarioId}&page=${page}`);
    } else {
      response = await fetch(`http://localhost:8080/consulta/historico/paciente?pacienteId=${usuarioId}&page=${page}`);
    }
    const result = await response.json();
    data = result.consultas;
    totalPages = result.totalPages;
    renderTabela();
    setupPagination();
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

function renderTabela() {
  const tabela = document.querySelector('.divTable');
  tabela.innerHTML = '';
  tabela.innerHTML = `
        <thead id="tableHeader"></thead>
        <tbody id="tableBody"></tbody>
        `;
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  const searchInput = document.getElementById('searchInput');
  greeting.innerText = `Olá, ${usuarioName}!`;
  if (perfil === 'PACIENTE') {

    searchInput.placeholder = 'Digite o nome do profissional';
    tableHeader.innerHTML = `
      <tr>
        <th style="background-color: #D9D9D9;">Profissional</th>
        <th style="background-color: #D9D9D9;">Especialidade</th>
        <th style="background-color: #D9D9D9;">Status</th>
        <th style="background-color: #D9D9D9;">Data da consulta</th>
        <th style="background-color: #D9D9D9;">Ação</th>
      </tr>`;
    data.forEach((c, i) => {
      tableBody.innerHTML += `
        <tr data-id="${c.id}">
          <td>${c.medico}</td>
          <td>${c.especialidade}</td>
          <td>${c.status}</td>
          <td>${formatarData(c.dataConsulta)}</td>
          <td>
            <span 
              class="btn-cancelar ${(c.status === 'Cancelada' || c.status === 'Concluída' || c.status === 'Finalizada') ? 'text-decoration-line-through no-click' : ''}" 
              style="${(c.status === 'Cancelada' || c.status === 'Concluída' || c.status === 'Finalizada') ? 'cursor: default;' : ''}"
              onclick="cancelarConsulta(event, ${c.id})">
              Cancelar
            </span>
          </td>
        </tr>`;
    });
  } else {
    searchInput.placeholder = 'Digite o nome do paciente';
    tableHeader.innerHTML = `
      <tr>
        <th style="background-color: #D9D9D9;">Paciente</th>
        <th style="background-color: #D9D9D9;">Status</th>
        <th style="background-color: #D9D9D9;">Modalidade</th>
        <th style="background-color: #D9D9D9;">Data da consulta</th>
        <th style="background-color: #D9D9D9;">Ação</th>
      </tr>`;
    data.forEach((c, i) => {
      tableBody.innerHTML += `
        <tr data-id="${c.id}">
          <td>${c.paciente}</td>
          <td>${c.status}</td>
          <td>${c.modalidade}</td>
          <td>${formatarData(c.dataConsulta)}</td>
          <td>
            <span 
              class="btn-cancelar ${(c.status === 'Cancelada' || c.status === 'Concluída' || c.status === 'Finalizada') ? 'text-decoration-line-through no-click' : ''}" 
              style="${(c.status === 'Cancelada' || c.status === 'Concluída' || c.status === 'Finalizada') ? 'cursor: default;' : ''}"
              onclick="cancelarConsulta(event, ${c.id})">
              Cancelar
            </span>
          </td>
        </tr>`;
    });
  }

  // Adiciona o evento de clique às linhas da tabela
  const linhas = tableBody.querySelectorAll('tr');
  linhas.forEach(linha => {
    linha.addEventListener('click', () => selecionarLinha(linha));
  });
}

function selecionarLinha(tr) {
  const linhas = tableBody.querySelectorAll('tr');
  linhas.forEach(row => row.classList.remove('table-primary')); // Remove a classe de todas as linhas
  tr.classList.add('table-primary'); // Adiciona a classe à linha clicada

  consultaIdLinhaSelecionada = tr.getAttribute('data-id');
}

async function cancelarConsulta(event, consultaId) {
  const span = event.target;
  const tr = span.closest('tr');
  selecionarLinha(tr);

  // Verifica se o elemento possui a classe 'no-click'
  if (span.classList.contains('no-click')) {
    return;
  }

  // Usa setTimeout para permitir que o DOM seja atualizado antes de exibir o confirm
  setTimeout(() => {
    const confirmacao = confirm('Tem certeza de que deseja cancelar esta consulta?');
    if (!confirmacao) return;

    // Continua com a lógica de cancelamento após o confirm
    cancelarConsultaBackend(consultaId);
  }, 0);
}

async function cancelarConsultaBackend(consultaId) {
  try {
    const response = await fetch(`http://localhost:8080/consulta/cancelar?consultaId=${consultaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao cancelar a consulta');
    }

    alert('Consulta cancelada com sucesso!');
    fetchData();
  } catch (error) {
    console.error('Erro ao cancelar a consulta:', error);
    alert('Erro ao cancelar a consulta. Tente novamente.');
  }
}

function setupPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.classList.add('page-btn');
    if (i === currentPage) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      currentPage = i;
      fetchData(currentPage - 1); // Ajusta a página para a API (0-indexed)
    });
    pagination.appendChild(button);
  }
}

botaoBuscar.addEventListener("click", function () {
  filtrarUsuario();
});
botaoDetalhes.addEventListener("click", function () {
  exibirDetalhes();
});

function filtrarUsuario() {
  var filtro = document.querySelector('.filtro').value.toUpperCase();

  // Se o filtro estiver vazio, busca os produtos normalmente
  if (!filtro) {
    fetchData(); // Carrega a lista completa se o filtro estiver vazio
    return;
  }

  async function fetchFilteredData(page = 0) {
    try {

      let response, perfilUsuario;
      if (perfil === 'MEDICO') {
        response = await fetch(`http://localhost:8080/consulta/historico/medico/nomePaciente?nomePaciente=${filtro}&medicoId=${usuarioId}&page=${page}`);
        perfilUsuario = "PACIENTE";
      } else {
        response = await fetch(`http://localhost:8080/consulta/historico/paciente/nomeMedico?nomeMedico=${filtro}&pacienteId=${usuarioId}&page=${page}`);
        perfilUsuario = "MÉDICO";
      }

      // Se a API retornar 404, exibe a mensagem de produto não encontrado
      if (response.status === 404) {
        exibirMensagemNaoEncontrado(perfilUsuario);
        return;
      }

      const result = await response.json();
      if (result.consultas.length === 0) {
        // Caso a lista de produtos retornada seja vazia, exibe mensagem de produto não encontrado
        exibirMensagemNaoEncontrado(perfilUsuario);
      } else {
        data = result.consultas; // Armazena os produtos filtrados
        totalPages = result.totalPages; // Armazena o número total de páginas para os produtos filtrados
        renderTabela(); // Exibe os dados filtrados
        setupPagination(); // Configura a paginação para os dados filtrados
      }
    } catch (error) {
      console.error('Erro ao buscar dados filtrados:', error);
      exibirMensagemNaoEncontrado(perfilUsuario);
    }
  }

  fetchFilteredData();
}

function exibirMensagemNaoEncontrado(perfilUsuario) {
  const tabela = document.querySelector('.divTable');
  tabela.innerHTML = `
      <div class="nao-encontrado">
          <p>${perfilUsuario} NÃO ENCONTRADO!</p>
          <img src="../img/not-found.png" alt="Produto não encontrado" width="200">
      </div>
  `;

  const pagination = document.getElementById('pagination');
  pagination.innerHTML = ''; // Limpa a paginação quando não houver resultados
}

function exibirDetalhes() {
  const linhasSelecionadas = document.querySelectorAll('.table-primary');
  if (linhasSelecionadas.length === 0) {
    alert('Selecione uma linha para ver os detalhes!');
    return;
  }

  showDetalhesModal(consultaIdLinhaSelecionada);
}

async function showDetalhesModal(consultaId) {
  const modal = document.getElementById('detalhesModal');
  const modalContent = document.querySelector('.modal-content'); // Elemento onde os detalhes serão exibidos

  try {
    const response = await fetch(`http://localhost:8080/consulta/detalhe?consultaId=${consultaId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes da consulta');
    }

    const detalhes = await response.json();

    // Monta o conteúdo do modal com os detalhes da consulta
    modalContent.innerHTML = `
      <div class="header-modal-detalhes">
        <h3>Detalhes da consulta</h3>  
        <span class="close">&times;</span>
      </div>
      <p style="margin-bottom: 16px;"><strong>Status:</strong> ${detalhes.statusConsulta}</p>
      <p style="margin-bottom: 16px;"><strong>Paciente:</strong> ${detalhes.paciente}</p>
      <p style="margin-bottom: 16px;"><strong>Data:</strong> ${formatarData(detalhes.dataConsulta)}</p>
      <p style="margin-bottom: 16px;"><strong>Profissional:</strong> ${detalhes.medico}</p>
      <p style="margin-bottom: 16px;"><strong>Observação do paciente:</strong> ${detalhes.observacaoPaciente}</p>
      <p style="margin-bottom: 16px;"><strong>Observação do médico:</strong> ${detalhes.observacaoMedico}</p>
      <p style="margin-bottom: 16px;"><strong>Unidade:</strong> ${detalhes.unidade}</p>
      <p style="margin-bottom: 16px;"><strong>Modalidade:</strong> ${detalhes.modalidade}</p>
`;

    // Exibe o modal
    modal.style.display = 'block';

    const closeBtn = document.getElementsByClassName('close')[0];
    // Configura o botão de fechar
    closeBtn.onclick = function () {
      modal.style.display = 'none';
    };

    // Fecha o modal ao clicar fora dele
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes da consulta:', error);
    modalContent.innerHTML = `<p>Erro ao carregar os detalhes da consulta.</p>`;
    modal.style.display = 'block';
  }
}

function formatarData(dataBackend) {
  const [data, hora] = dataBackend.split(' '); // Divide a data e a hora
  const [ano, mes, dia] = data.split('-'); // Divide o ano, mês e dia
  const [horaFormatada, minuto] = hora.split(':'); // Divide a hora e os minutos

  return `${dia}/${mes}/${ano} às ${horaFormatada}:${minuto}`;
}
const perfil = 'medico';
const usuarioId = 1;
const usuarioName = "Ana";

const greeting = document.getElementById('greeting');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const botaoBuscar = document.querySelector(".btn-filtro");
let currentPage = 1;
let totalPages = 0;
let data = [];

fetchData();

async function fetchData(page = 0) {
  try {
    let response;
    if (perfil === 'medico') {
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
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  const searchInput = document.getElementById('searchInput');
  greeting.innerText = `Olá, ${usuarioName}!`;
  if (perfil === 'paciente') {
    
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
        <tr>
          <td>${c.medico}</td>
          <td>${c.especialidade}</td>
          <td>${c.status}</td>
          <td>${formatarData(c.dataConsulta)}</td>
          <td><span class="btn-cancelar ${c.status === 'Cancelada' ? 'text-decoration-line-through' : ''}">Cancelar</span></td>
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
        <tr>
          <td>${c.paciente}</td>
          <td>${c.status}</td>
          <td>${c.modalidade}</td>
          <td>${formatarData(c.dataConsulta)}</td>
          <td><span class="btn-cancelar ${c.status === 'Cancelada' ? 'text-decoration-line-through' : ''}">Cancelar</span></td>
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
  linhas.forEach(row => row.classList.remove('table-primary'));
  tr.classList.add('table-primary');
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
  filtrarProdutos();
});

function filtrarProdutos() {
  var filtro = document.getElementById('filtro').value.toUpperCase();

  console.log(filtro);

  // Se o filtro estiver vazio, busca os produtos normalmente
  if (!filtro) {
    fetchData(); // Carrega a lista completa se o filtro estiver vazio
    return;
  }

  async function fetchFilteredData(page = 0) {
    try {
      const response = await fetch(`http://localhost:8084/product/listByNameAndStoreId?name=${filtro}&storeId=${storeId}&page=${page}`);

      // Se a API retornar 404, exibe a mensagem de produto não encontrado
      if (response.status === 404) {
        exibirMensagemProdutoNaoEncontrado();
        return;
      }

      const result = await response.json();
      if (result.products.length === 0) {
        // Caso a lista de produtos retornada seja vazia, exibe mensagem de produto não encontrado
        exibirMensagemProdutoNaoEncontrado();
      } else {
        data = result.products; // Armazena os produtos filtrados
        totalPages = result.totalPages; // Armazena o número total de páginas para os produtos filtrados
        displayTableData(); // Exibe os dados filtrados
        setupPagination(); // Configura a paginação para os dados filtrados
      }
    } catch (error) {
      console.error('Erro ao buscar dados filtrados:', error);
      exibirMensagemProdutoNaoEncontrado(); // Exibe mensagem em caso de erro
    }
  }

  fetchFilteredData(); // Chama a função para buscar os produtos filtrados
}

function exibirMensagemProdutoNaoEncontrado() {
  const tabela = document.querySelector('.divTable');
  tabela.innerHTML = `
      <div class="produto-nao-encontrado">
          <p>PRODUTO NÃO ENCONTRADO!</p>
          <img src="../img/not-found.png" alt="Produto não encontrado" width="200">
      </div>
  `;

  const pagination = document.getElementById('pagination');
  pagination.innerHTML = ''; // Limpa a paginação quando não houver resultados
}

function formatarData(dataBackend) {
  const [data, hora] = dataBackend.split(' '); // Divide a data e a hora
  const [ano, mes, dia] = data.split('-'); // Divide o ano, mês e dia
  const [horaFormatada, minuto] = hora.split(':'); // Divide a hora e os minutos

  return `${dia}/${mes}/${ano} às ${horaFormatada}:${minuto}`;
}
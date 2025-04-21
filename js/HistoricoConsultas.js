const modo = 'paciente'; // troque para 'medico' se quiser o modo médico

const greeting = document.getElementById('greeting');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');

const consultas = {
  paciente: [
    { profissional: "Dr. Rafael Monteiro", especialidade: "Clínico geral", status: "Agendada - retorno", data: "25/12/2024 às 08:45" },
    { profissional: "Dr. Rafael Monteiro", especialidade: "Clínico geral", status: "Agendada", data: "25/12/2024 às 08:45" },
    { profissional: "Dr. Rafael Monteiro", especialidade: "Clínico geral", status: "Cancelada", data: "25/12/2024 às 08:45" },
  ],
  medico: [
    { paciente: "Jefferson Cavalcante", status: "Finalizado", modalidade: "Presencial", data: "25/12/2024 às 08:45" },
    { paciente: "Jefferson Cavalcante", status: "Finalizado", modalidade: "Virtual", data: "25/12/2024 às 08:45" },
    { paciente: "Jefferson Cavalcante", status: "Pendente", modalidade: "Virtual", data: "25/12/2024 às 08:45" },
  ]
};

function renderTabela() {
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  if (modo === 'paciente') {
    greeting.innerText = 'Olá, Jefferson!';
    tableHeader.innerHTML = `
      <tr>
        <th>Profissional</th>
        <th>Especialidade</th>
        <th>Status</th>
        <th>Data da consulta</th>
        <th>Ação</th>
      </tr>`;
    consultas.paciente.forEach((c, i) => {
      tableBody.innerHTML += `
        <tr onclick="selecionarLinha(this)">
          <td>${c.profissional}</td>
          <td>${c.especialidade}</td>
          <td>${c.status}</td>
          <td>${c.data}</td>
          <td><span class="btn-cancelar ${c.status === 'Cancelada' ? 'text-decoration-line-through' : ''}">Cancelar</span></td>
        </tr>`;
    });
  } else {
    greeting.innerText = 'Olá, Dr. Rafael!';
    tableHeader.innerHTML = `
      <tr>
        <th>Paciente</th>
        <th>Status</th>
        <th>Modalidade</th>
        <th>Data da consulta</th>
        <th>Ação</th>
      </tr>`;
    consultas.medico.forEach((c, i) => {
      tableBody.innerHTML += `
        <tr onclick="selecionarLinha(this)">
          <td>${c.paciente}</td>
          <td>${c.status}</td>
          <td>${c.modalidade}</td>
          <td>${c.data}</td>
          <td><span class="btn-cancelar ${c.status === 'Finalizado' ? 'text-decoration-line-through' : ''}">Cancelar</span></td>
        </tr>`;
    });
  }
}

function selecionarLinha(tr) {
  const linhas = tableBody.querySelectorAll('tr');
  linhas.forEach(row => row.classList.remove('selected-row'));
  tr.classList.add('selected-row');
}

function filtrar() {
  const termo = document.getElementById('searchInput').value.toLowerCase();
  const linhas = tableBody.querySelectorAll('tr');
  linhas.forEach(linha => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(termo) ? '' : 'none';
  });
}

renderTabela();

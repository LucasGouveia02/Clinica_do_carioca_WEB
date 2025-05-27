async function carregarDetalhesConsulta(consultaId) {
  try {
    const response = await fetch(`http://localhost:8080/consulta/detalhe?consultaId=${consultaId}`);
    const data = await response.json();

    // Supondo que os dados retornados venham com as chaves:
    // nomePaciente, modalidade, unidade, observacoes
    preencherFormulario(data);
  } catch (error) {
    console.error("Erro ao carregar detalhes da consulta:", error);
  }
}

function preencherFormulario(data) {
  document.getElementById('nome').value = data.paciente || '';
  document.getElementById('modalidade').value = data.modalidade || '';
  document.getElementById('unidade').value = data.unidade || '';
  document.getElementById('observacoes').value = data.observacaoPaciente || '';
  document.getElementById('status').value = data.statusConsulta || '';
}

window.onload = function () {
  const consultaId = localStorage.getItem('consultaIdSelecionada');
  console.log("Consulta ID selecionada:", consultaId);
  if (consultaId) {
    carregarDetalhesConsulta(consultaId);
  } else {
    alert('Nenhuma consulta selecionada!');
  }
};

async function salvarObservacao(consultaId) {
  const observacao = document.getElementById('observacoesMedico').value;
  const status = document.getElementById('status').value;

  try {
    const response = await fetch(`http://localhost:8080/consulta/add/observacao?consultaId=${consultaId}&novoStatus=${encodeURIComponent(status)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(observacao)
    });

    if (response.ok) {
      alert("Alterações realizadas com sucesso!");
      window.location.href = 'PortalPacienteMedico.html';
    } else {
      alert("Erro ao salvar observação.");
    }
  } catch (error) {
    console.error("Erro ao salvar observação:", error);
  }
}

const btnSalvarObservacao = document.querySelector('.btn-schedule');
btnSalvarObservacao.addEventListener('click', function () {
    const consultaId = localStorage.getItem('consultaIdSelecionada');
    if (!consultaId) {
        alert('Nenhuma consulta selecionada!');
        return;
    }

    salvarObservacao(consultaId);
});

function voltar() {
  window.location.href = 'PortalPacienteMedico.html';
}



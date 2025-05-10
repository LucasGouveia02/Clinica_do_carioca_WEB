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
  const consultaId = 4; // ou de onde estiver vindo
  carregarDetalhesConsulta(consultaId);
};

async function salvarObservacao(consultaId) {
  const observacao = document.getElementById('observacoesMedico').value;

  try {
    const response = await fetch(`http://localhost:8080/consulta/add/observacao?consultaId=${consultaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(observacao)
    });

    if (response.ok) {
      alert("Observação salva com sucesso!");
    } else {
      alert("Erro ao salvar observação.");
    }
  } catch (error) {
    console.error("Erro ao salvar observação:", error);
  }
}



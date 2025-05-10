const btnAgendar = document.querySelector('.btn-schedule');
const btnVoltar = document.querySelector('.btn-back');
const userData = localStorage.getItem('userData');
const paciente = JSON.parse(userData);
const usuarioName = paciente.nome;
const greeting = document.getElementById('greeting');

document.addEventListener('DOMContentLoaded', function() {
  greeting.innerText = `Olá, ${usuarioName}!`;

  btnAgendar.addEventListener('click', function(event) {
    event.preventDefault(); 

    const modalidade = document.getElementById('modalidade').value;
    const unidade = document.getElementById('unidade').value;
    const dataConsulta = document.getElementById('data').value;
    const observacoes = document.getElementById('observacoes').value;

    // Pegando o médico selecionado na tabela
    const linhaSelecionada = document.querySelector('#tabela-profissionais tbody tr.selecionado');
    if (!linhaSelecionada) {
      alert('Por favor, selecione um profissional.');
      return;
    }

    const idMedico = linhaSelecionada.getAttribute('data-id');
    
    if (!userData) {
      alert('Dados do paciente não encontrados. Por favor, faça login novamente.');
      return;
    }

    const consulta = {
      unidade: unidade,
      pacienteId: { id: parseInt(paciente.id) },
      modalidade: modalidade,
      dataConsulta: dataConsulta + "T08:00:00",
      observacoes: observacoes,
      medicoId: { id: parseInt(idMedico) }
    };

    console.log('Consulta a ser agendada:', consulta);

    agendarConsulta(consulta);
  });

  btnVoltar.addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do botão
    window.location.href = 'PortalPacienteMedico.html'; // Redireciona para a página desejada
  });
});



// Função para fazer o fetch (enviar a consulta)
async function agendarConsulta(consulta) {
  try {
    const response = await fetch('http://localhost:8080/consulta/agendamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(consulta)
    });

    if (!response.ok) {
      throw new Error('Erro ao agendar consulta');
    }

    const data = await response.json();
    console.log('Consulta agendada com sucesso:', data);
    alert('Consulta agendada com sucesso!');
    window.location.href = 'PortalPacienteMedico.html';
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao agendar consulta.');
  }
}

// Adicionando seleção de linha da tabela
document.addEventListener('click', function(e) {
  const linha = e.target.closest('#tabela-profissionais tbody tr');
  if (linha) {
    // Remove seleção anterior
    const selecionada = document.querySelector('#tabela-profissionais tbody tr.selecionado');
    if (selecionada) {
      selecionada.classList.remove('selecionado');
    }

    linha.classList.add('selecionado');
  }
});

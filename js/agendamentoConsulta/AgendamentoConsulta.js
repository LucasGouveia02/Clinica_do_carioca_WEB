document.addEventListener('DOMContentLoaded', function() {
  const btnAgendar = document.querySelector('.btn-schedule');

  btnAgendar.addEventListener('click', function(event) {
    event.preventDefault(); // Evita o submit automático do formulário

    // Pegando os campos do formulário
    const especialidade = document.getElementById('especialidade').value;
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

    const nomeMedico = linhaSelecionada.cells[0].textContent;
    const crmMedico = linhaSelecionada.cells[2].textContent;

    // Aqui você montaria o seu objeto consulta para enviar via fetch
    const consulta = {
      unidade: unidade,
      pacienteId: { id: 1 }, // Você precisa puxar o ID do paciente de algum lugar (ex: localStorage)
      modalidade: modalidade,
      dataConsulta: dataConsulta + "T08:00:00", // Mockando o horário junto
      observacoes: observacoes,
      medicoId: { id: parseInt(idMedico) }
    };

    console.log('Consulta a ser agendada:', consulta);

    // Aqui faria o fetch para enviar o agendamento:
    agendarConsulta(consulta);
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

    // Marca a nova linha como selecionada
    linha.classList.add('selecionado');
  }
});

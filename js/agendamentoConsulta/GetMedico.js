document.addEventListener('DOMContentLoaded', function() {
  const selectEspecialidade = document.getElementById('especialidade');

  selectEspecialidade.addEventListener('change', function() {
      const especialidadeSelecionada = selectEspecialidade.value;

      if (especialidadeSelecionada) {
          buscarMedicosPorEspecialidade(especialidadeSelecionada);
      }
  });
});

const tabelaBody = document.querySelector('#tabela-profissionais tbody');
function buscarMedicosPorEspecialidade(especialidade) {
  fetch(`http://localhost:8080/consulta/medicos?especialidade=${especialidade}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao buscar médicos');
          }
          return response.json();
      })
      .then(medicos => {
          atualizarTabelaProfissionais(medicos);
          console.log(medicos); // Adicionei o console.log aqui para verificar os dados recebidos
      })
      .catch(error => {
          tabelaBody.innerHTML = ''; 
          console.error('Erro na requisição:', error);
      });
}

function atualizarTabelaProfissionais(medicos) {
  
  tabelaBody.innerHTML = ''; // Limpa a tabela

  if (medicos.length === 0) {
      tabelaBody.innerHTML = '<tr><td colspan="4">Nenhum profissional encontrado.</td></tr>';
      return;
  }

  medicos.forEach(medico => {
      const horarioMocado = '08:00 às 08:45'; // Aqui você mocou o horário!

      const linha = `
          <tr data-id="${medico.id}">
              <td>${medico.nome}</td>
              <td>${medico.especialidade}</td>
              <td>${medico.crm}</td>
              <td>${horarioMocado}</td>
          </tr>
      `;
      tabelaBody.innerHTML += linha;
  });
}

const botaoHistorico = document.querySelector(".btn-historico");

botaoHistorico.addEventListener("click", function () {
    window.location.href = "HistoricoConsultas.html";
});

const btnAgendarConsulta = document.getElementById('btn-agendar-consulta');

btnAgendarConsulta.addEventListener('click', function () {
    // Redireciona para a página de AgendamentoConsulta
    window.location.href = '/AgendamentoConsulta.html';
});

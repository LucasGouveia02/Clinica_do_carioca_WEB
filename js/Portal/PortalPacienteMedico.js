const userData = JSON.parse(localStorage.getItem('userData'));
const perfil = userData.perfil;
const usuarioId = userData.id;
const usuarioName = userData.nome;

const btnAgenda = document.querySelector(".btn-1");
const btnHistorico = document.querySelector(".btn-2");
const btnUserInfo = document.querySelector(".btn-3");

const nameHeader = document.getElementById("greeting");
const userName = document.querySelector(".user-name");
const idadeOuCrm = document.querySelector(".user-item-1");
const telefoneOuEspecialidade = document.querySelector(".user-item-2");

nameHeader.innerHTML = `Olá, ${usuarioName}`;


if (perfil === "PACIENTE") {
    userName.innerHTML = usuarioName;

    btnUserInfo.addEventListener("click", function () {
        window.location.href = "AlterarPaciente.html";
    });
}
else {
    userName.innerHTML = `Dr. ${usuarioName}`;

    btnAgenda.style.display = "none";
    btnUserInfo.addEventListener("click", function () {
        window.location.href = "AlterarDoutor.html";
    });
}

btnAgenda.addEventListener("click", function () {
    window.location.href = "AgendamentoConsulta.html";
});

btnHistorico.addEventListener("click", function () {
    window.location.href = "HistoricoConsultas.html";
});


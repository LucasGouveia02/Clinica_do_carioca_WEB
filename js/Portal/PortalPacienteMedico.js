document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const perfil = userData.perfil;
    const usuarioId = userData.id;

    const elementos = {
        btnAgenda: document.querySelector(".btn-1"),
        btnHistorico: document.querySelector(".btn-2"),
        btnUserInfo: document.querySelector(".btn-3"),
        tituloPortal: document.querySelector(".portal-title"),
        nameHeader: document.getElementById("greeting"),
        userName: document.querySelector(".user-name"),
        idadeOuCrm: document.querySelector(".user-item-1"),
        telefoneOuEspecialidade: document.querySelector(".user-item-2")
    };

    buscarDadosUsuario(perfil, usuarioId, elementos);
    buscarConsutas(0, perfil, usuarioId);
});

function buscarDadosUsuario(perfil, usuarioId, elementos) {
    const apiUrlBase = "http://localhost:8080/";
    let apiUrl;

    if (perfil === "PACIENTE") {
        apiUrl = `${apiUrlBase}paciente/${usuarioId}`;
    } else {
        apiUrl = `${apiUrlBase}medico/${usuarioId}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao conectar com a API");
            }
            return response.json();
        })
        .then(data => {
            exibirDadosUsuario(data, perfil, elementos);
        })
        .catch(error => {
            console.error("Erro ao consumir a API:", error);
        });
}

function exibirDadosUsuario(dadosUsuario, perfil, elementos) {
    const {
        nameHeader,
        btnHistorico,
        tituloPortal,
        userName,
        idadeOuCrm,
        telefoneOuEspecialidade,
        btnAgenda,
        btnUserInfo
    } = elementos;

    nameHeader.innerHTML = `Olá, ${dadosUsuario.nome}`;

    btnHistorico.addEventListener("click", function () {
        window.location.href = "HistoricoConsultas.html";
    });

    if (perfil === "PACIENTE") {
        tituloPortal.innerHTML = "Portal do Paciente";
        userName.innerHTML = dadosUsuario.nome;
        idadeOuCrm.innerHTML = `${calcularIdade(dadosUsuario.dataNascimento)} anos`;
        telefoneOuEspecialidade.innerHTML = dadosUsuario.telefone;

        btnAgenda.addEventListener("click", function () {
            window.location.href = "AgendamentoConsulta.html";
        });

        btnUserInfo.addEventListener("click", function () {
            window.location.href = "AlterarPaciente.html";
        });
    } else {
        nameHeader.innerHTML = `Olá, ${dadosUsuario.name}`;

        tituloPortal.innerHTML = "Portal do Médico";
        userName.innerHTML = `Dr. ${dadosUsuario.name}`;
        idadeOuCrm.innerHTML = `CRM-SP ${dadosUsuario.crm}`;
        telefoneOuEspecialidade.innerHTML = dadosUsuario.especialidade;

        btnAgenda.style.display = "none";
        btnUserInfo.addEventListener("click", function () {
            window.location.href = "AlterarDoutor.html";
        });
    }
}

async function buscarConsutas(page = 0, perfil, usuarioId) {
    try {
        let response;
        if (perfil === 'MEDICO') {
            response = await fetch(`http://localhost:8080/consulta/historico/medico?medicoId=${usuarioId}&page=${page}`);
        } else {
            response = await fetch(`http://localhost:8080/consulta/historico/paciente?pacienteId=${usuarioId}&page=${page}`);
        }
        const result = await response.json();
        data = result.consultas;
        
        exibirConsutas(data, perfil);
        console.log(data);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function exibirConsutas(consultas, perfil) {
    const listaConsultas = document.querySelector(".consultas-itens");

    listaConsultas.innerHTML = "";

    consultas.forEach(consulta => {
        
        const consultaItem = document.createElement("p");
        consultaItem.classList.add("consultas-item");

        const [data, hora] = consulta.dataConsulta.split(" "); 
        const [ano, mes, dia] = data.split("-"); 
        const horaFormatada = hora.substring(0, 5); 

        if (perfil === "PACIENTE") {
            consultaItem.innerHTML = `
                <span class="span-blue">Consulta</span> com 
                <span class="span-black">Dr. ${consulta.medico}</span> 
                dia ${dia}/${mes}/${ano} às ${horaFormatada}
            `;
        } else {
            consultaItem.innerHTML = `
                <span class="span-blue">Consulta</span> com paciente
                <span class="span-black">${consulta.paciente}</span> 
                dia ${dia}/${mes}/${ano} às ${horaFormatada}
            `;
        }

        listaConsultas.appendChild(consultaItem);
    });
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();

    if (
        mesAtual < mesNascimento ||
        (mesAtual === mesNascimento && diaAtual < diaNascimento)
    ) {
        idade--;
    }

    return idade;
}



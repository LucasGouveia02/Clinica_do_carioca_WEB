document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('AlterarDoutorForm');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const id = userData.id; 
    const nome = userData.nome.toLowerCase();

    console.log(id); // Para depuração  
    console.log(nome); // Para depuração  
    // Função para buscar os dados do médico e preencher o formulário
    function carregarDadosMedico() {
 fix/ajustes_cadastro-alteracao
        fetch('http://localhost:8080/' + nome + '/' + id)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados do médico.');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Para depuração
                document.getElementById('nome').value = data.name || '';
                document.getElementById('especialidade').value = data.especialidade || '';
                document.getElementById('telefone').value = data.telefone || '';
                document.getElementById('email').value = data.email || '';
                document.getElementById('crm').value = data.crm || '';
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao carregar dados do médico.');
            });
    }

    // Função para enviar as alterações
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const crm = document.getElementById('crm').value.trim();
        const especialidade = document.getElementById('especialidade').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmaSenha = document.getElementById('confirmaSenha').value.trim();

        // Validação simples
        if (!nome || !crm || !especialidade || !telefone || !email) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmaSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const dadosMedico = {
            id: id, // Mantendo o id fixo para edição
            nome: nome,
            crm: crm,
            especialidade: especialidade,
            telefone: telefone,
            email: email,   
        };
        if(senha) {
            dadosMedico.senha = senha;
        }
        
        // console.log(dadosMedico);
        fetch('http://localhost:8080/alteracao/medico', {
            method: 'PATCH', // ou POST, dependendo de como seu back-end está esperando
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosMedico)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar alterações.');
            }
            return response.json();
        })
        .then(data => {
            alert('Dados atualizados com sucesso!');
            window.location.href = "PortalPacienteMedico.html"; // Redireciona para a página inicial após a atualização
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar dados.');
        });
    });
    document.getElementById('cancelar').addEventListener('click', function () {
        console.log('cancelar');
        window.location.href = 'PortalPacienteMedico.html'; 
    });
   
    carregarDadosMedico();
});

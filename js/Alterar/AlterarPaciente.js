document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('AlterarPacienteForm');

    // Função para buscar os dados do Paciente e preencher o formulário
    function carregarDadosPaciente() {
        fetch('http://localhost:8080/paciente/1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados do Paciente.');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Para depuração
                document.getElementById('nome').value = data.nome || '';
                document.getElementById('cpf').value = data.cpf || '';
                document.getElementById('telefone').value = data.telefone || '';
                document.getElementById('email').value = data.email || '';
                document.getElementById('nascimento').value = data.dataNascimento || '';
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao carregar dados do Paciente.');
            });
    }

    // Função para enviar as alterações
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmaSenha = document.getElementById('confirmaSenha').value.trim();

        // Validação simples
        if (!nome || !telefone || !email) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmaSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const dadosPaciente = {
            id: 3, // Mantendo o id fixo para edição
            nome: nome,
            telefone: telefone,
            email: email,   
        };
        if(senha) {
            dadosPaciente.senha = senha;
        }
        // console.log(dadosPaciente);
        fetch('http://localhost:8080/alteracao/paciente', {
            method: 'PATCH', // ou POST, dependendo de como seu back-end está esperando
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosPaciente)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar alterações.');
            }
            return response.json();
        })
        .then(data => {
            alert('Dados atualizados com sucesso!');
            // Você pode redirecionar para outra página se quiser
            // window.location.href = "/alguma-pagina.html";
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar dados.');
        });
    });

    // Chama a função para carregar os dados ao abrir a página
    carregarDadosPaciente();
});

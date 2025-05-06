document.getElementById('cadastroPacienteForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Captura os valores dos campos
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('nascimento').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;


    if (!nome || !cpf || !telefone || !email || !senha || !dataNascimento) {
        event.preventDefault(); // Evita o comportamento padrão do formulário
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (!validarSenha(senha)) {
        return;
    }

    // Cria o objeto para enviar
    const pacienteData = {
        nome,
        cpf,
        telefone,
        dataNascimento,
        email,
        senha
    };

    try {
        // Envia a requisição para o backend
        const response = await fetch('http://localhost:8080/cadastro/paciente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pacienteData)
        });

        if (response.ok) {
            alert('Paciente cadastrado com sucesso!');
            // Opcional: Redirecionar ou limpar o formulário
            document.getElementById('cadastroPacienteForm').reset();
            window.location.href = 'Login.html';
        } else {
            const errorData = await response.json();
            alert('Erro ao cadastrar paciente: ' + errorData.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao cadastrar paciente. Tente novamente mais tarde.');
    }
    
});

document.getElementById('cancelar').addEventListener('click', function () {
    window.location.href = 'PortalPacienteMedico.html';
    console.log('medico cancelar');
});
document.getElementById('cadastroDoutorForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Captura os valores dos campos
    const crm = document.getElementById('crm').value;
    const especialidade = document.getElementById('especialidade').value;
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    

    // Cria o objeto para enviar
    const doutorData = {
        crm,
        especialidade,
        nome,
        telefone,
        email,
        senha
    };

    if (!nome || !crm || !telefone || !email || !senha || !especialidade) {
        event.preventDefault(); // Evita o comportamento padrão do formulário
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (!validarSenha(senha)) {
        return;
    }
    

    try {
        // Envia a requisição para o backend
        const response = await fetch('http://localhost:8080/cadastro/medico', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doutorData)
        });

        if (response.ok) {
            alert('Doutor cadastrado com sucesso!');
            // Opcional: Redirecionar ou limpar o formulário
            document.getElementById('cadastroDoutorForm').reset();
            window.location.href = 'Login.html';
        } else {
            const errorData = await response.json();
            alert('Erro ao cadastrar doutor: ' + errorData.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao cadastrar doutor. Tente novamente mais tarde.');
    }
});

document.getElementById('cancelar').addEventListener('click', function () {
    window.location.href = 'PortalPacienteMedico.html'; // Redireciona para a página desejada
    console.log('cancelar');
});
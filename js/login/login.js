document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: usuario, password: senha })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login bem-sucedido:', data);
            localStorage.setItem('userData', JSON.stringify(data));
            alert('Login realizado com sucesso!');
            window.location.href = 'PortalPacienteMedico.html';
        } else {
            alert('Erro ao realizar login. Verifique suas credenciais.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
});
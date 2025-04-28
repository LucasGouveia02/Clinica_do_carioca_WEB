// Validação do campo de senha
function validarSenha(senha) {
    if (senha.length < 8 || senha.length > 24) {
        alert('A senha deve conter entre 8 e 24 caracteres.');
        return false;
    }
    return true;
}

// Aplica máscara no campo de telefone
function aplicarMascaraTelefone(event) {
    let telefone = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses no DDD
    telefone = telefone.replace(/(\d{4,5})(\d{4})$/, '$1-$2'); // Adiciona o traço
    event.target.value = telefone;
}

// Aplica máscara no campo de CPF
function aplicarMascaraCPF(event) {
    let cpf = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
    event.target.value = cpf;
}

// Adiciona os eventos de máscara nos campos de telefone e CPF
document.getElementById('telefone').addEventListener('input', aplicarMascaraTelefone);
const tabela = document.getElementById('tabela-profissionais');

tabela.querySelector('thead').addEventListener('click', () => {
  tabela.classList.toggle('active');
});


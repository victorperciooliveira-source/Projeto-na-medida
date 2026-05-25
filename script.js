
// script.js
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });

  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
    page.classList.remove('hidden');
  }

  // Atualiza título
  const titles = {
    dashboard: "Dashboard",
    cozinha: "Cozinha",
    cardapio: "Cardápio",
    relatorios: "Relatórios",
    registro: "Registro de Consumo",
    alunos: "Alunos",
    turmas: "Turmas",
    avaliacao: "Avaliação"
  };

  document.getElementById('page-title').textContent = titles[pageId] || "Na Medida";

  // Atualiza item ativo na sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('sidebar-active');
    if (item.getAttribute('onclick').includes(`'${pageId}'`)) {
      item.classList.add('sidebar-active');
    }
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  showPage('dashboard');
});

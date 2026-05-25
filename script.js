// ==================== SUPABASE CONFIG ====================

// Copie a URL completa que aparece em "URL do projeto"
const SUPABASE_URL = 'https://nxxqldlaojvmammmckvn.supabase.co'; 

// Copie o texto completo que aparece em "Chave publicável"
const SUPABASE_ANON_KEY = 'sb_publishable_JKqZl9JvQmtbryNENlPbmQ_xJMeUFqB'; // Cole o restante aqui

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Se estiver usando a versão em browser do supabase-js, a função createClient
// fica disponível globalmente como createClient
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let avaliacaoAtual = { rating: null };
let isSubmitting = false;
let lastSubmitTime = 0;

// ==================== NAVEGAÇÃO ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    document.getElementById('page-title').textContent = {
        dashboard: "Dashboard",
        cozinha: "Cozinha",
        cardapio: "Cardápio",
        relatorios: "Relatórios",
        avaliacao: "Avaliação"
    }[pageId];

    if (pageId === 'relatorios') carregarEstatisticas();
}

// ==================== AVALIAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#emoji-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#emoji-buttons button').forEach(b => b.style.transform = 'scale(1)');
            btn.style.transform = 'scale(1.3)';
            avaliacaoAtual.rating = btn.dataset.rating;
        });
    });
});

async function enviarAvaliacao() {
    if (isSubmitting) return;
    if (Date.now() - lastSubmitTime < 3000) {
        alert("Aguarde alguns segundos antes de enviar novamente.");
        return;
    }

    const comentario = document.getElementById('comentario').value.trim();

    if (!avaliacaoAtual.rating) {
        alert("Por favor, selecione uma avaliação (👍, 😐 ou 👎)");
        return;
    }

    isSubmitting = true;
    const btnText = document.getElementById('btn-text');
    btnText.textContent = "Enviando...";

    try {
        const { error } = await supabase.from('avaliacoes').insert([{
            rating: avaliacaoAtual.rating,
            comentario: comentario || null,
            cardapio: "Arroz com Feijão e Frango Grelhado",
            data: new Date().toLocaleString('pt-BR')
        }]);

        if (error) throw error;

        alert("✅ Avaliação enviada com sucesso!");
        lastSubmitTime = Date.now();
        document.getElementById('comentario').value = '';
        avaliacaoAtual.rating = null;
        document.querySelectorAll('#emoji-buttons button').forEach(b => b.style.transform = 'scale(1)');

    } catch (err) {
        console.error(err);
        alert("Erro ao enviar. Verifique sua conexão e tente novamente.");
    } finally {
        isSubmitting = false;
        btnText.textContent = "Enviar Avaliação";
    }
}

async function carregarEstatisticas() {
    const container = document.getElementById('stats-content');
    container.innerHTML = "<p class='text-center py-8'>Carregando estatísticas...</p>";

    try {
        const { data, error } = await supabase.from('avaliacoes').select('rating');
        if (error) throw error;

        const total = data.length;
        const bom = data.filter(a => a.rating === 'bom').length;
        const ruim = data.filter(a => a.rating === 'ruim').length;

        // Correção das strings de template HTML que estavam com erro no arquivo original
        container.innerHTML = `
            <div class="bg-white p-6 rounded-2xl text-center">
                <p class="text-5xl font-bold text-emerald-600">${total}</p>
                <p class="text-gray-500">Total de Avaliações</p>
            </div>
            <div class="bg-white p-6 rounded-2xl text-center">
                <p class="text-6xl">👍</p>
                <p class="text-3xl font-bold text-green-600">${bom}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl text-center">
                <p class="text-6xl">👎</p>
                <p class="text-3xl font-bold text-red-600">${ruim}</p>
            </div>
        `;
    } catch (e) {
        container.innerHTML = "<p class='text-red-500 text-center'>Erro ao carregar estatísticas.</p>";
    }
}

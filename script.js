// script.js - Versão compatível com seu HTML/CSS (opção B)
// Salva no LocalStorage para não perder ao atualizar

let vendedores = [];

// formatar número para pt-BR (R$ 1.234,56)
function formatValor(num) {
    if (isNaN(num) || num === null) return "0,00";
    return Number(num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// carregar dados do localStorage
function carregarDados() {
    const raw = localStorage.getItem('vendedoresRanking');
    if (raw) {
        try {
            vendedores = JSON.parse(raw);
        } catch (e) {
            vendedores = [];
            console.error('Erro ao parsear vendedores do localStorage', e);
        }
    } else {
        // opcional: inicializar com exemplos (comente se não quiser)
        vendedores = [
            { id: Date.now()+1, nome: "Ana", foto: "https://i.pravatar.cc/150?img=1", venda: 12000 },
            { id: Date.now()+2, nome: "Bruno", foto: "https://i.pravatar.cc/150?img=2", venda: 9000 },
            { id: Date.now()+3, nome: "Carla", foto: "https://i.pravatar.cc/150?img=3", venda: 7500 }
        ];
        salvarDados();
    }
}

// salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('vendedoresRanking', JSON.stringify(vendedores));
}

// organiza vendedores por venda desc
function ordenarVendedores() {
    vendedores.sort((a,b) => (b.venda || 0) - (a.venda || 0));
}

// renderiza o pódio
function renderPodio() {
    ordenarVendedores();
    const ids = ['primeiro','segundo','terceiro']; // não usados no HTML agora, manter compatibilidade
    const p1 = document.getElementById('primeiro');
    const p2 = document.getElementById('segundo');
    const p3 = document.getElementById('terceiro');

    // limpar
    [p1, p2, p3].forEach(el => {
        if (!el) return;
        const img = el.querySelector('img');
        const h3 = el.querySelector('h3');
        const p = el.querySelector('p');
        img.src = '';
        h3.textContent = '';
        p.textContent = '';
    });

    if (vendedores[0] && p1) {
        p1.querySelector('img').src = vendedores[0].foto || '';
        p1.querySelector('h3').textContent = vendedores[0].nome || '';
        p1.querySelector('p').textContent = `R$ ${formatValor(vendedores[0].venda || 0)}`;
    }
    if (vendedores[1] && p2) {
        p2.querySelector('img').src = vendedores[1].foto || '';
        p2.querySelector('h3').textContent = vendedores[1].nome || '';
        p2.querySelector('p').textContent = `R$ ${formatValor(vendedores[1].venda || 0)}`;
    }
    if (vendedores[2] && p3) {
        p3.querySelector('img').src = vendedores[2].foto || '';
        p3.querySelector('h3').textContent = vendedores[2].nome || '';
        p3.querySelector('p').textContent = `R$ ${formatValor(vendedores[2].venda || 0)}`;
    }
}

// renderiza a lista completa
function renderLista() {
    ordenarVendedores();
    const lista = document.getElementById('listaVendedores');
    if (!lista) return;
    lista.innerHTML = '';

    vendedores.forEach((v, index) => {
        const div = document.createElement('div');
        div.className = 'vendedor-card';

        // cria input para venda com formatação e evento
        const vendaStr = formatValor(v.venda || 0);

        div.innerHTML = `
            <span class="num-colocacao">${index+1}º</span>
            <img src="${v.foto || ''}" alt="${v.nome}" />
            <div class="vendedor-info">
                <h3>${v.nome || ''}</h3>
                <input type="text" data-id="${v.id}" class="venda-input" value="${vendaStr}">
            </div>
            <button class="delete-btn" data-id="${v.id}">Excluir</button>
        `;

        // eventos
        const input = div.querySelector('.venda-input');
        input.addEventListener('change', (e) => {
            const val = e.target.value;
            updateVendaById(v.id, val);
        });
        // evitar zoom no iOS ao focar (já no css -webkit-text-size-adjust)
        input.addEventListener('focus', (e) => {
            // nada especial aqui
        });

        const btn = div.querySelector('.delete-btn');
        btn.addEventListener('click', () => {
            delVendedorById(v.id);
        });

        lista.appendChild(div);
    });
}

// atualizar venda por id (aceita 15.000,00)
function updateVendaById(id, valorStr) {
    const clean = valorStr.replace(/\./g, '').replace(',', '.').trim();
    const num = parseFloat(clean);
    if (isNaN(num) || num < 0) {
        alert('Valor inválido');
        renderLista(); // re-render pra voltar ao valor salvo
        return;
    }
    const idx = vendedores.findIndex(x => x.id === id);
    if (idx === -1) return;
    vendedores[idx].venda = num;
    salvarDados();
    renderPodio();
    renderLista();
}

// remover vendedor por id
function delVendedorById(id) {
    if (!confirm('Deseja remover este vendedor e todas as vendas?')) return;
    vendedores = vendedores.filter(v => v.id !== id);
    salvarDados();
    renderPodio();
    renderLista();
}

// adicionar vendedor (usado pelo botão)
function addVendedor() {
    const nomeInput = document.getElementById('nome');
    const fotoInput = document.getElementById('foto');

    const nome = nomeInput.value.trim();
    if (!nome) { alert('Coloca o nome do vendedor'); return; }

    // se quiser permitir começar com 0 vendas
    const novaVenda = 0;

    // se tiver arquivo de foto, converte para dataURL
    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            const novo = { id: Date.now() + Math.floor(Math.random()*1000), nome, foto: dataUrl, venda: novaVenda };
            vendedores.push(novo);
            salvarDados();
            renderPodio();
            renderLista();
            nomeInput.value = '';
            fotoInput.value = '';
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        // sem foto: usa avatar genérico
        const novo = { id: Date.now() + Math.floor(Math.random()*1000), nome, foto: `https://i.pravatar.cc/150?u=${Date.now()}`, venda: novaVenda };
        vendedores.push(novo);
        salvarDados();
        renderPodio();
        renderLista();
        nomeInput.value = '';
    }
}

// Inicialização
carregarDados();
renderPodio();
renderLista();
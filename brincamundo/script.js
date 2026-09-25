const produtos = [
  { id: 1, nome: "Urso Aurora", categoria: "Clássicos", preco: 49.90, emoji: "🧸", tag: "Queridinho", descricao: "Um companheiro macio para grandes histórias.", avaliacao: "4.9" },
  { id: 2, nome: "Foguete Lunar", categoria: "Aventura", preco: 89.90, emoji: "🚀", tag: "Novidade", descricao: "Prepare-se para explorar o universo da imaginação.", avaliacao: "4.8" },
  { id: 3, nome: "Kit Pintura Pop", categoria: "Criatividade", preco: 39.90, emoji: "🎨", tag: "Criativo", descricao: "Cores, desenhos e possibilidades sem fim.", avaliacao: "4.9" },
  { id: 4, nome: "Quebra-Cabeça Mundo", categoria: "Jogos", preco: 34.90, emoji: "🧩", tag: "Desafio", descricao: "Monte novas ideias peça por peça.", avaliacao: "4.7" },
  { id: 5, nome: "Carrinho Turbo", categoria: "Aventura", preco: 29.90, emoji: "🏎️", tag: "Velocidade", descricao: "Uma corrida de imaginação em cada curva.", avaliacao: "4.8" },
  { id: 6, nome: "Blocos Criativos", categoria: "Criatividade", preco: 59.90, emoji: "🧱", tag: "Construa", descricao: "Crie estruturas, cidades e mundos inteiros.", avaliacao: "4.9" },
  { id: 7, nome: "Jogo de Memória", categoria: "Jogos", preco: 27.90, emoji: "🎲", tag: "Clássico", descricao: "Diversão para exercitar a atenção.", avaliacao: "4.6" },
  { id: 8, nome: "Robô Explorador", categoria: "Aventura", preco: 119.90, emoji: "🤖", tag: "Destaque", descricao: "Um parceiro robótico para missões incríveis.", avaliacao: "4.9" }
];

let categoriaAtual = "Todos";
let buscaAtual = "";
let carrinho = [];

const produtosContainer = document.querySelector("#produtos");
const contador = document.querySelector("#contador-carrinho");
const itensCarrinho = document.querySelector("#itens-carrinho");
const totalCarrinho = document.querySelector("#total-carrinho");
const painel = document.querySelector("#painel-carrinho");
const overlay = document.querySelector("#overlay");
const toast = document.querySelector("#toast");

const moeda = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function mostrarToast(texto) {
  toast.textContent = texto;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function renderizarProdutos() {
  const filtrados = produtos.filter((produto) => {
    const correspondeCategoria = categoriaAtual === "Todos" || produto.categoria === categoriaAtual;
    const correspondeBusca = `${produto.nome} ${produto.categoria}`.toLowerCase().includes(buscaAtual.toLowerCase());
    return correspondeCategoria && correspondeBusca;
  });

  document.querySelector("#sem-resultados").classList.toggle("hidden", filtrados.length > 0);

  produtosContainer.innerHTML = filtrados.map((produto) => `
    <article class="product-card">
      <div class="product-image">
        <span class="tag">${produto.tag}</span>
        ${produto.emoji}
      </div>
      <div class="product-info">
        <h3>${produto.nome}</h3>
        <div class="rating">★★★★★ <span>${produto.avaliacao} · ${produto.categoria}</span></div>
        <p class="product-desc">${produto.descricao}</p>
        <div class="product-bottom">
          <strong class="price">${moeda(produto.preco)}</strong>
          <button class="add-button" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">+</button>
        </div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".add-button").forEach((botao) => {
    botao.addEventListener("click", () => adicionarAoCarrinho(Number(botao.dataset.id)));
  });
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find((item) => item.id === id);
  const existente = carrinho.find((item) => item.id === id);

  if (existente) existente.quantidade++;
  else carrinho.push({ ...produto, quantidade: 1 });

  atualizarCarrinho();
  mostrarToast(`${produto.nome} foi adicionado ao carrinho!`);
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter((item) => item.id !== id);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const quantidadeTotal = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const valorTotal = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  contador.textContent = quantidadeTotal;
  totalCarrinho.textContent = moeda(valorTotal);

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = '<p class="empty-cart">Seu carrinho está esperando uma aventura.</p>';
    return;
  }

  itensCarrinho.innerHTML = carrinho.map((item) => `
    <div class="cart-row">
      <div class="cart-emoji">${item.emoji}</div>
      <div class="cart-row-info">
        <strong>${item.nome}</strong>
        <span>${item.quantidade} × ${moeda(item.preco)}</span>
        <button class="remove-item" data-remove="${item.id}">Remover</button>
      </div>
      <strong>${moeda(item.preco * item.quantidade)}</strong>
    </div>
  `).join("");

  document.querySelectorAll("[data-remove]").forEach((botao) => {
    botao.addEventListener("click", () => removerDoCarrinho(Number(botao.dataset.remove)));
  });
}

function alternarCarrinho(aberto) {
  painel.classList.toggle("open", aberto);
  overlay.classList.toggle("open", aberto);
  painel.setAttribute("aria-hidden", String(!aberto));
}

document.querySelectorAll(".category").forEach((botao) => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach((item) => item.classList.remove("active"));
    botao.classList.add("active");
    categoriaAtual = botao.dataset.category;
    renderizarProdutos();
  });
});

document.querySelector("#pesquisa").addEventListener("input", (evento) => {
  buscaAtual = evento.target.value;
  renderizarProdutos();
});

document.querySelector("#abrir-carrinho").addEventListener("click", () => alternarCarrinho(true));
document.querySelector("#fechar-carrinho").addEventListener("click", () => alternarCarrinho(false));
overlay.addEventListener("click", () => alternarCarrinho(false));

document.querySelector("#finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) mostrarToast("Adicione um brinquedo antes de continuar.");
  else mostrarToast("Demonstração concluída! Nenhum pagamento foi realizado.");
});

document.querySelector("#form-newsletter").addEventListener("submit", (evento) => {
  evento.preventDefault();
  document.querySelector("#newsletter-mensagem").textContent = "Cadastro demonstrativo realizado! ✨";
  evento.target.reset();
});

renderizarProdutos();
atualizarCarrinho();

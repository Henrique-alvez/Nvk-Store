// Rolagem suave ao clicar nos links do menu
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
let cart = [];

function addToCart(product, price) {
  cart.push({ product, price });
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartCount.textContent = cart.length;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
    cartTotal.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.product}</span>
        <span>R$ ${item.price.toFixed(2)} 
          <button onclick="removeItem(${index})">❌</button>
        </span>
      </div>
    `;
  });

  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function toggleCart() {
  document.getElementById("cartContent").classList.toggle("open");
}

function checkout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const phone = "5511942718355"; // Seu número do WhatsApp (com DDI)
  const items = cart.map(item => `${item.product} - R$ ${item.price.toFixed(2)}`).join("\n");
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const message = `🛍️ *Pedido Store NVK*%0A%0A${items}%0A%0A*Total:* R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/${5511942718355}?text=${message}`;
  window.open(url, "_blank");
}// Função que varre cards e aplica UI de "esgotado" quando data-stock === "0"
function applySoldOutUI(){
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const stock = Number(card.getAttribute('data-stock'));
    const addBtn = card.querySelector('.add-to-cart');

    // remove marcações antigas
    card.classList.remove('sold-out');
    const oldBadge = card.querySelector('.sold-out-badge');
    if(oldBadge) oldBadge.remove();
    const oldOverlay = card.querySelector('.sold-out-overlay');
    if(oldOverlay) oldOverlay.remove();

    if(stock <= 0){
      // marca card
      card.classList.add('sold-out');

      // adiciona selo
      const badge = document.createElement('div');
      badge.className = 'sold-out-badge';
      badge.textContent = 'ESGOTADO';
      card.querySelector('.product-image').appendChild(badge);

      // adiciona overlay semi-transparente (opcional)
      const overlay = document.createElement('div');
      overlay.className = 'sold-out-overlay';
      overlay.textContent = 'Indisponível';
      card.querySelector('.product-image').appendChild(overlay);

      // desativa botão
      if(addBtn){
        addBtn.disabled = true;
        addBtn.setAttribute('aria-disabled', 'true');
        addBtn.textContent = 'Esgotado';
      }

      // evita cliques no card (se você tiver click para abrir detalhes)
      card.addEventListener('click', preventClickWhenSoldOut, true);
    } else {
      // garante que o botão funcione normalmente
      if(addBtn){
        addBtn.disabled = false;
        addBtn.removeAttribute('aria-disabled');
        addBtn.textContent = addBtn.getAttribute('data-label') || 'Adicionar ao carrinho';
      }
      card.removeEventListener('click', preventClickWhenSoldOut, true);
    }
  });
}

function preventClickWhenSoldOut(e){
  // evita ação padrão somente em elementos marcados esgotado
  const card = e.currentTarget;
  if(card && card.classList.contains('sold-out')){
    e.stopPropagation();
    e.preventDefault();
  }
}

// função para atualizar o estoque dinamicamente (útil para painel admin)
function setProductStock(productId, newStock){
  const card = document.querySelector(.product-card[data-id="${productId}"]);
  if(!card) return false;
  card.setAttribute('data-stock', String(newStock));
  // se quiser persistir localmente (apenas exemplo), atualize localStorage:
  // let stocks = JSON.parse(localStorage.getItem('productStocks') || '{}');
  // stocks[productId] = newStock;
  // localStorage.setItem('productStocks', JSON.stringify(stocks));
  applySoldOutUI();
  return true;
}

// opcional: carregar estoques persistidos no localStorage (se usar)
function loadPersistedStocks(){
  // let stocks = JSON.parse(localStorage.getItem('productStocks') || '{}');
  // Object.keys(stocks).forEach(id => {
  //   const card = document.querySelector(.product-card[data-id="${id}"]);
  //   if(card) card.setAttribute('data-stock', stocks[id]);
  // });
}

// inicialização
document.addEventListener('DOMContentLoaded', () => {
  // loadPersistedStocks(); // se estiver usando persistência client-side
  applySoldOutUI();

  // exemplo: prevenir adicionar ao carrinho se esgotado
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.add-to-cart');
    if(!btn) return;
    const card = btn.closest('.product-card');
    if(card && Number(card.getAttribute('data-stock')) <= 0){
      e.preventDefault();
      e.stopPropagation();
      // opcional: mostrar notificação
      alert('Produto esgotado — não é possível adicionar ao carrinho.');
    } else {
      // lógica normal de adicionar ao carrinho aqui
      // addToCart(productId, quantity, ...);
    }
  });
});


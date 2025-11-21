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

  const phone = "5535999673781"; // Seu número do WhatsApp (com DDI)
  const items = cart.map(item => `${item.product} - R$ ${item.price.toFixed(2)}`).join("\n");
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const message = `🛍️ *Pedido Store NVK*%0A%0A${items}%0A%0A*Total:* R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/${5535999673781}?text=${message}`;
  window.open(url, "_blank");
}
// Filtro igual ao site NewWave
const botoes = document.querySelectorAll(".cat-btn");
const produtos = document.querySelectorAll(".produto");

botoes.forEach(btn => {
    btn.addEventListener("click", () => {

        // remove active dos outros
        botoes.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filtro = btn.getAttribute("data-filter");

        produtos.forEach(prod => {
            const categoria = prod.getAttribute("data-category");

            if (filtro === "all" || categoria === filtro) {
                prod.style.display = "block";
            } else {
                prod.style.display = "none";
            }
        });
    });
});

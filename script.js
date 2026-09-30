let booksData = [
  {
    id: 'romance',
    title: 'Entre Nós',
    author: 'Ali Hazelwood',
    category: 'romance',
    categoryLabel: 'Romance',
    price: 60.00, // Ajustado para R$ 60,00
    stock: 10,
    cover: 'livro.romance.png',
    synopsis: 'Um romance envolvente sobre ciência, amor e segundas oportunidades. Ali Hazelwood traz uma história onde às vezes o maior risco é mesmo apaixonar-se.'
  },
  {
    id: 'ficcao',
    title: 'Sereias contra Gnomos de Maldivas',
    author: 'Ray Bradbury',
    category: 'ficcao',
    categoryLabel: 'Ficção Científica',
    price: 50.00, // Ajustado para R$ 50,00
    stock: 7,
    cover: 'livro.ficcao.cientifica.png',
    synopsis: 'Um mar de mistério, criaturas lendárias e uma batalha épica que pode mudar o destino de tudo.'
  },
  {
    id: 'terror',
    title: 'Espelho Amaldiçoado',
    author: 'Stephen King',
    category: 'terror',
    categoryLabel: 'Terror',
    price: 45.00, // Ajustado para R$ 45,00
    stock: 5,
    cover: 'livro.terror.png',
    synopsis: 'Alguns reflexos não deveriam existir. Stephen King entrega um conto aterrorizante sobre segredos sombrios.'
  }
];

let cart = [];
let activeFilter = 'todos';

document.addEventListener('DOMContentLoaded', renderBooks);

function renderBooks() {
  const grid = document.getElementById('books-grid');
  grid.innerHTML = '';

  const filtered = activeFilter === 'todos' ? booksData : booksData.filter(b => b.category === activeFilter);

  filtered.forEach(book => {
    grid.innerHTML += `
      <div class="book-card">
        <div class="cover-container">
          <img src="${book.cover}" alt="${book.title}" class="cover-img">
          <span class="book-badge">${book.categoryLabel}</span>
        </div>
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">por ${book.author}</p>
          <div class="book-footer">
            <div>
              <span class="book-price">R$ ${book.price.toFixed(2).replace('.', ',')}</span>
              <span class="stock-tag ${book.stock === 0 ? 'out' : ''}">${book.stock > 0 ? `Estoque: ${book.stock}` : 'Esgotado'}</span>
            </div>
            <button class="btn-details" onclick="openDetails('${book.id}')">Ver Detalhes</button>
          </div>
        </div>
      </div>
    `;
  });
}

function filterCategory(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBooks();
}

function openDetails(id) {
  const book = booksData.find(b => b.id === id);
  if (!book) return;

  document.getElementById('product-modal-body').innerHTML = `
    <img src="${book.cover}" class="details-cover">
    <div>
      <h2>${book.title}</h2>
      <p style="color:#a78bfa; margin-bottom:1rem;">por ${book.author} (${book.categoryLabel})</p>
      <p style="font-size:0.9rem; line-height:1.5; margin-bottom:1.5rem;">${book.synopsis}</p>
      <div style="font-size:1.5rem; font-weight:bold; color:#d8b4fe; margin-bottom:0.5rem;">R$ ${book.price.toFixed(2).replace('.', ',')}</div>
      <button class="btn-add-cart" style="width:100%" ${book.stock === 0 ? 'disabled' : ''} onclick="addToCart('${book.id}')">
        ${book.stock > 0 ? 'Adicionar ao Carrinho' : 'Sem Estoque'}
      </button>
    </div>
  `;
  document.getElementById('product-modal').classList.add('active');
}

function addToCart(id) {
  const book = booksData.find(b => b.id === id);
  const item = cart.find(i => i.id === id);

  if (item) {
    if (item.qty < book.stock) item.qty++;
    else return alert('Quantidade máxima no estoque atingida!');
  } else {
    cart.push({ id, title: book.title, price: book.price, qty: 1 });
  }

  document.getElementById('cart-count').innerText = cart.reduce((acc, i) => acc + i.qty, 0);
  closeModal('product-modal');
  alert(`"${book.title}" adicionado ao carrinho!`);
}

function openCheckout() {
  const summary = document.getElementById('cart-summary');
  if (cart.length === 0) {
    summary.innerHTML = '<p style="text-align:center; color:#a78bfa;">O carrinho está vazio.</p>';
  } else {
    let total = 0;
    let html = '';
    cart.forEach(i => {
      total += i.price * i.qty;
      html += `<div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;"><span>${i.title} (x${i.qty})</span><strong>R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}</strong></div>`;
    });
    html += `<hr style="border-color:rgba(139,92,246,0.2); margin:0.5rem 0;"><div style="display:flex; justify-content:space-between; font-weight:bold;"><span>Total:</span><span>R$ ${total.toFixed(2).replace('.', ',')}</span></div>`;
    summary.innerHTML = html;
  }
  document.getElementById('checkout-modal').classList.add('active');
}

function handleCheckout(e) {
  e.preventDefault();
  if (cart.length === 0) return alert('O carrinho está vazio!');

  cart.forEach(item => {
    const book = booksData.find(b => b.id === item.id);
    if (book) book.stock -= item.qty;
  });

  alert(`Obrigado, ${document.getElementById('name').value}! Pedido confirmado e estoque atualizado.`);
  cart = [];
  document.getElementById('cart-count').innerText = 0;
  document.getElementById('order-form').reset();
  closeModal('checkout-modal');
  renderBooks();
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
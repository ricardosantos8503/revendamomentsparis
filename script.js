// Dados dos produtos
const products = [
    {
        id: 1,
        name: "412-homem",
        description: "Deo Colônia Desodorante 412 Homem – 15ml",
        price: 19.99,
        image: "images/PERFUMES_15ML/412-homem.png"
    },
    {
        id: 2,
        name: "412-Rose",
        description: "Deo Colônia Desodorante 412 Rose – 15ml",
        price: 19.99,
        image: "images/PERFUMES_15ML/412-rose.png"
    },
    {
        id: 3,
        name: "412-Sexy",
        description: "Deo Colônia Desodorante 412 Sexy – 15ml",
        price: 19.99,
        image: "images/PERFUMES_15ML/412-SEXY.png"
    },
    {
        id: 4,
        name: "412-Top",
        description: "Deo Colônia Desodorante 412 TOP – 15ml",
        price: 19.99,
        image: "images/PERFUMES_15ML/412-top.png"
    },
    {
        id: 5,
        name: "Bacarat",
        description: "Deo Colônia Desodorante Bacarat – 15ml",
        price: 19.99,
        image: "images/PERFUMES_15ML/bacarat.png"
    },
    {
        id: 6,
        name: "Best-girl",
        description: "Deo Colônia Desodorante Best-girl – 15ml",
        price: 19.99,
        image: "images/PERFUMES_15ML/best-girl.png"
    }
];
//Dados de revendedor
const resellers = [
    {
        id: 1,
        name: "Ricardo Santos",
        phone: "(11) 95701-6564",
		zap: "11957016564",
        profitPercentage: 100, // 15% de lucro
        region: "Sudeste"
    },
    {
        id: 2,
        name: "José Carlos",
        phone: "(83) 8716-8451",
		zap: "8387168451",
        profitPercentage: 100,
        region: "Sudeste"
    },

];

// Variável global
let currentReseller = null;

// Função para verificar parâmetro na URL (nova)
function checkResellerFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const resellerId = urlParams.get('r');
    
    if (resellerId) {
        const foundReseller = resellers.find(r => r.id == resellerId);
        if (foundReseller) {
            setCurrentReseller(foundReseller);
        }
    }else{
		const foundReseller = resellers.find(r => r.id == "1");
        if (foundReseller) {
            setCurrentReseller(foundReseller);
        }
	}
	
}

// Função para definir revendedor (nova)
function setCurrentReseller(reseller) {
    currentReseller = reseller;
    
    const banner = document.getElementById('reseller-banner');
    if (reseller) {
        document.getElementById('reseller-name').textContent = reseller.name;
        //document.getElementById('reseller-percentage').textContent = reseller.profitPercentage;
        banner.classList.remove('hidden');
        updatePricesOnLoad(); // ← Linha crucial que estava faltando!
    } else {
        banner.classList.add('hidden');
        resetPrices();
    }
}

// Aplicar margens aos preços (nova)
function applyResellerMargins() {
    if (!currentReseller) return;
    
    document.querySelectorAll('.product-price').forEach(priceElement => {
        const originalPrice = parseFloat(priceElement.textContent.replace('R$ ', ''));
        const newPrice = originalPrice * (1 + currentReseller.profitPercentage / 100);
        priceElement.textContent = `R$ ${newPrice.toFixed(2)}`;
        priceElement.classList.add('with-margin');
    });
}

// Resetar preços (nova)
function resetPrices() {
    document.querySelectorAll('.product-price').forEach(priceElement => {
        const originalPrice = parseFloat(priceElement.getAttribute('data-original'));
        priceElement.textContent = `R$ ${originalPrice.toFixed(2)}`;
        priceElement.classList.remove('with-margin');
    });
}



// Carrinho de compras
let cart = [];

// Elementos do DOM
const productGrid = document.getElementById('product-grid');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const sendToResellerBtn = document.getElementById('send-to-reseller');

// Exibir produtos
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price" data-original="${product.price}">R$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Adicione este evento:
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Adicionar ao carrinho
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Feedback visual
    e.target.textContent = 'Adicionado!';
    e.target.style.backgroundColor = '#2ecc71';
    setTimeout(() => {
        e.target.textContent = 'Adicionar ao Carrinho';
        e.target.style.backgroundColor = '#3498db';
    }, 1000);
}

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Salvar no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Função para obter o preço atualizado (com margem do revendedor)
function getCurrentPrice(basePrice) {
    if (!currentReseller) return basePrice;
    return basePrice * (1 + currentReseller.profitPercentage / 100);
}
// Exibir carrinho
function displayCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
		const currentPrice = getCurrentPrice(item.price);
        const itemTotal = currentPrice * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">R$ ${currentPrice.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    // Adicionar event listeners
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Aumentar quantidade
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        updateCart();
        displayCart();
    }
}

// Diminuir quantidade
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
        displayCart();
    }
}

// Remover item
function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    updateCart();
    displayCart();
}

// Atualize a função de envio para WhatsApp
function sendToReseller() {
    if (!currentReseller) {
        alert('Nenhum revendedor selecionado! Adicione ?r=ID na URL');
        return;
    }
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let message = `*Pedido para ${currentReseller.name}*\n\n`;
    let total = 0;
    
    cart.forEach(item => {
        const itemPrice = item.price * (1 + currentReseller.profitPercentage / 100);
        const itemTotal = itemPrice * item.quantity;
        total += itemTotal;
        
        message += `➡ ${item.name}\n`;
        message += `Quantidade: ${item.quantity}\n`;
        message += `Preço unitário: R$ ${itemPrice.toFixed(2)}\n`;
        message += `Subtotal: R$ ${itemTotal.toFixed(2)}\n\n`;
    });
    
    message += `*TOTAL: R$ ${total.toFixed(2)}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${currentReseller.zap}?text=${encodedMessage}`, '_blank');
}

// Na inicialização (DOMContentLoaded), adicione:
checkResellerFromUrl();

// Carregar carrinho do localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Event Listeners
cartIcon.addEventListener('click', () => {
    displayCart();
    cartModal.style.display = 'flex';
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

sendToResellerBtn.addEventListener('click', sendToReseller);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart();
});

function updatePricesOnLoad() {
    if (!currentReseller) return;
    
    // Atualizar preços dos produtos
    document.querySelectorAll('.product-card').forEach(card => {
        const priceElement = card.querySelector('.product-price');
        const originalPrice = parseFloat(priceElement.textContent.replace('R$ ', ''));
        const newPrice = originalPrice * (1 + currentReseller.profitPercentage / 100);
        priceElement.textContent = `R$ ${newPrice.toFixed(2)}`;
        priceElement.classList.add('with-margin');
    });
    
    // Atualizar preços no carrinho (se houver itens)
    if (cart.length > 0) {
        displayCart(); // Essa função já está preparada para lidar com o revendedor
    }
}
// Garanta que esta linha está no final do seu DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart();
    checkResellerFromUrl(); // ← Isso já vai chamar setCurrentReseller se houver ?r= na URL
});
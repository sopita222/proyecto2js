// Clase Producto
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// Clase Carrito
class Cart {
    constructor() {
        const storedCart = localStorage.getItem('cart');
        this.items = storedCart ? JSON.parse(storedCart) : [];
    }

    addProduct(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity; // Si el producto ya está en el carrito, aumenta la cantidad
        } else {
            this.items.push({ product, quantity }); // Si no está, lo agrega
        }
        this.updateStorage();
        this.renderCart();
    }

    viewCart() {
        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = ''; // Limpia el carrito antes de renderizarlo

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            let cartSummary = '';
            this.items.forEach(item => {
                cartSummary += `<p>${item.quantity}x ${item.product.name} - $${item.product.price * item.quantity}</p>`;
            });
            cartSummary += `<p>Total: $${this.getTotal()}</p>`;
            cartContainer.innerHTML = cartSummary;
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.updateStorage();
        this.renderCart();
    }

    updateStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    renderCart() {
        this.viewCart();
    }
}

// Clase Tienda
class Store {
    constructor() {
        this.products = [
            new Product(1, 'Paleta de Sombras NOVO', 4000),
            new Product(2, 'Tinta de labios Miss Lara', 2500),
            new Product(3, 'Polvo suelto calm white NOVO', 6500),
            new Product(4, 'Pack de Brochas x4', 4500)
        ];
    }

    getProducts() {
        return this.products;
    }
}

// Inicializa la tienda y el carrito
const store = new Store();
const cart = new Cart();

// Función para renderizar los productos en el DOM
function renderProducts() {
    const productContainer = document.getElementById('product-container');
    store.getProducts().forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('col-md-3', 'mb-4');
        productDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                </div>
            </div>
        `;
        productContainer.appendChild(productDiv);
    });

    // Añade los eventos a los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const product = store.getProducts().find(p => p.id === productId);
            cart.addProduct(product);
        });
    });
}

// Renderiza los productos al cargar la página
renderProducts();

// Eventos para ver y vaciar el carrito
document.getElementById('view-cart').addEventListener('click', () => {
    cart.renderCart();
});

document.getElementById('clear-cart').addEventListener('click', () => {
    cart.clearCart();
});

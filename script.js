// ==============================================
// 🔑 DAFTAR PENGGUNA
// ==============================================
const users = [
    { username: 'andika', password: '123456', nama: 'ANDIKA' }
];

// Data Produk
const products = [
    { id: 1, nama: 'Biskuit', harga: 5000 },
    { id: 2, nama: 'Air Mineral', harga: 3000 },
    { id: 3, nama: 'Roti', harga: 8000 },
    { id: 4, nama: 'Kopi Sachet', harga: 2500 },
    { id: 5, nama: 'Telur 1kg', harga: 28000 },
    { id: 6, nama: 'Gula 1kg', harga: 15000 },
    { id: 7, nama: 'Minyak 1L', harga: 18000 },
    { id: 8, nama: 'Sabun Mandi', harga: 7500 },
    { id: 9, nama: 'Sikat Gigi', harga: 4000 },
    { id: 10, nama: 'Tisu', harga: 12000 },
    { id: 11, nama: 'Susu Kotak', harga: 6500 },
    { id: 12, nama: 'Mie Instan', harga: 3500 }
];

let cart = [];

window.onload = function() {
    cekLogin();
    tampilProduk();
};

function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function cekLogin() {
    const isLogin = localStorage.getItem('isLogin');
    if (isLogin === 'true') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
        const nama = localStorage.getItem('namaUser') || 'ANDIKA';
        document.getElementById('namaUser').textContent = 'Selamat datang, ' + nama;
    } else {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainPage').style.display = 'none';
    }
}

function login() {
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    const foundUser = users.find(u => u.username === userInput && u.password === passInput);
    
    if (foundUser) {
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('namaUser', foundUser.nama);
        errorMsg.style.display = 'none';
        cekLogin();
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        errorMsg.style.display = 'block';
    }
}

function logout() {
    if (confirm('Yakin ingin keluar?')) {
        localStorage.setItem('isLogin', 'false');
        cart = [];
        tampilKeranjang();
        cekLogin();
    }
}

function tampilProduk() {
    const container = document.getElementById('productList');
    container.innerHTML = '';
    
    products.forEach(prod => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-name">${prod.nama}</div>
            <div class="product-price">Rp ${formatRupiah(prod.harga)}</div>
        `;
        item.onclick = () => tambahKeKeranjang(prod);
        container.appendChild(item);
    });
}

function tambahKeKeranjang(product) {
    const index = cart.findIndex(item => item.id === product.id);
    
    if (index !== -1) {
        cart[index].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    tampilKeranjang();
}

function ubahQty(index, tambah) {
    cart[index].qty += tambah;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    tampilKeranjang();
}

function tampilKeranjang() {
    const container = document.getElementById('cartList');
    const totalEl = document.getElementById('totalHarga');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Keranjang masih kosong</p>';
        totalEl.textContent = '0';
        return;
    }
    
    let total = 0;
    container.innerHTML = '';
    
    cart.forEach((item, index) => {
        const subtotal = item.harga * item.qty;
        total += subtotal;
        
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div>
                <strong>${item.nama}</strong><br>
                Rp ${formatRupiah(item.harga)}
            </div>
            <div class="qty-control">
                <button class="qty-btn" onclick="ubahQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="ubahQty(${index}, 1)">+</button>
            </div>
            <div><strong>Rp ${formatRupiah(subtotal)}</strong></div>
        `;
        container.appendChild(el);
    });
    
    totalEl.textContent = formatRupiah(total);
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Yakin ingin mengosongkan keranjang?')) {
        cart = [];
        tampilKeranjang();
    }
}

function bayar() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }
    
    const now = new Date();
    const tanggal = now.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const subtotal = item.harga * item.qty;
        total += subtotal;
        html += `
            <div class="receipt-item">
                <span>${item.nama} x${item.qty}</span>
                <span>Rp ${formatRupiah(subtotal)}</span>
            </div>
        `;
    });
    
    document.getElementById('tanggalStruk').textContent = tanggal;
    document.getElementById('isiStruk').innerHTML = html;
    document.getElementById('totalStruk').textContent = 'Rp ' + formatRupiah(total);
    
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('receipt').style.display = 'block';
}

function tutupStruk() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('receipt').style.display = 'none';
    cart = [];
    tampilKeranjang();
}

function cetakStruk() {
    window.print();
}


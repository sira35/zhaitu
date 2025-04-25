// 全局函数：显示图片模态框
function showModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const imgEl = element.querySelector('img');
    
    if (imgEl) {
        modalImg.src = imgEl.src;
        modalImg.alt = imgEl.alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

// 购物车数据
let cart = {
    items: {},
    total: 0
};

// 计算购物车总价
function calculateTotal() {
    let total = 0;
    let itemCount = 0;
    
    // 计算商品总数
    for (let id in cart.items) {
        itemCount += cart.items[id].quantity;
    }
    
    // 计算总价
    let pairs = Math.floor(itemCount / 2); // 计算可以组成多少对
    let singles = itemCount % 2; // 计算剩余单个数量
    
    total = pairs * 25 + singles * 13; // 每对25元，单个13元
    
    return total;
}

// 更新购物车显示
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let totalQuantity = 0;
    
    // 清空购物车显示
    cartItems.innerHTML = '';
    
    // 添加每个商品
    for (let id in cart.items) {
        const item = cart.items[id];
        totalQuantity += item.quantity;
        
        if (item.quantity > 0) {
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">¥${item.price} × ${item.quantity}</div>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" onclick="updateQuantity(${id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${id}, 1)">+</button>
                    </div>
                </div>
            `;
        }
    }
    
    // 更新总数和总价
    cartCount.textContent = totalQuantity;
    cartTotal.textContent = `¥${calculateTotal()}`;
}

// 更新商品数量
function updateQuantity(productId, change) {
    try {
        // 获取商品信息
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (!productCard) {
            console.error(`未找到ID为${productId}的产品卡片`);
            return;
        }
        
        const productName = productCard.querySelector('h3').textContent;
        const productImage = productCard.querySelector('img').src;
        const quantityDisplay = document.getElementById(`quantity-${productId}`);
        
        // 初始化商品在购物车中的数据
        if (!cart.items[productId]) {
            cart.items[productId] = {
                name: productName,
                price: 13,
                quantity: 0,
                image: productImage
            };
        }
        
        // 更新数量
        const newQuantity = cart.items[productId].quantity + change;
        if (newQuantity >= 0) {
            cart.items[productId].quantity = newQuantity;
            if (quantityDisplay) {
                quantityDisplay.textContent = newQuantity;
            }
            
            // 确保更新购物车显示
            updateCartDisplay();
            
            // 确保购物车图标上的数字更新
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                let totalQuantity = 0;
                for (let id in cart.items) {
                    totalQuantity += cart.items[id].quantity;
                }
                cartCount.textContent = totalQuantity;
            }
        }
    } catch (error) {
        console.error('更新商品数量时出错:', error);
    }
}

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // 产品过滤功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前按钮添加active类
            this.classList.add('active');
            
            // 获取过滤类别
            const filterValue = this.getAttribute('data-filter');
            
            // 显示或隐藏产品卡片
            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                
                // 添加动画效果
                setTimeout(() => {
                    card.classList.add('animated');
                }, 100);
            });
        });
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有导航链接的active类
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            
            // 给当前点击的导航链接添加active类
            this.classList.add('active');
            
            // 平滑滚动到目标位置
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 监听滚动位置，更新导航栏高亮
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // 购物车弹窗逻辑
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    
    // 确保元素存在再添加事件监听
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('购物车按钮被点击');
            cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    } else {
        console.error('购物车按钮或模态框元素未找到', { cartBtn, cartModal });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // 初始化购物车显示
    updateCartDisplay();

    // 图片加载优化
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // 图片加载完成后添加loaded类
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // 检查图片是否已经加载完成
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // 图片点击放大功能
    const productImages = document.querySelectorAll('.product-image');
    const modal = document.getElementById('imageModal');
    const closeModal = document.querySelector('.close-modal');
    
    // 点击产品图片，显示模态框和大图
    productImages.forEach(productImage => {
        productImage.addEventListener('click', function(e) {
            console.log("图片被点击"); // 调试信息
            const imgEl = this.querySelector('img');
            const imgSrc = imgEl.src;
            const imgAlt = imgEl.alt;
            
            modalImg.src = imgSrc;
            modalImg.alt = imgAlt;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    });
    
    // 点击关闭按钮，关闭模态框
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            console.log("关闭按钮被点击"); // 调试信息
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢复背景滚动
        });
    }
    
    // 点击模态框背景，关闭模态框
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // 恢复背景滚动
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢复背景滚动
        }
    });

    // 登录注册功能
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    // 注意：cartBtn已在上面定义过，这里不需要重复定义
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    // 注意：cartModal已在上面定义过，这里不需要重复定义
    const closeButtons = document.querySelectorAll('.close-auth, .close-cart');
    
    // 打开登录模态框
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
    
    // 打开注册模态框
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'block';
    });
    
    // 打开购物车模态框
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
    });
    
    // 关闭模态框
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            cartModal.style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === registerModal) registerModal.style.display = 'none';
        if (e.target === cartModal) cartModal.style.display = 'none';
    });
    
    // 处理登录表单提交
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        // 这里添加登录逻辑
        console.log('登录:', username, password);
        alert('登录成功！');
        loginModal.style.display = 'none';
    });
    
    // 处理注册表单提交
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        
        // 这里添加注册逻辑
        console.log('注册:', username, password);
        alert('注册成功！');
        registerModal.style.display = 'none';
    });
    
    // 处理结算按钮点击
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (Object.keys(cart.items).length === 0) {
            alert('购物车是空的！');
            return;
        }
        
        // 这里添加结算逻辑
        const total = calculateTotal();
        alert(`总计: ¥${total}\n即将跳转到支付页面...`);
    });
});
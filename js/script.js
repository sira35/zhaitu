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
});
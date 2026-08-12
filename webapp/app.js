// Telegram WebApp Initialization
const tg = window.Telegram?.WebApp || {
    ready: () => {},
    expand: () => {},
    close: () => {},
    initDataUnsafe: {
        user: { id: 777888999, first_name: "Кирилл", username: "kirill_ai" }
    },
    HapticFeedback: {
        impactOccurred: () => {},
        notificationOccurred: () => {}
    }
};

tg.ready();
tg.expand();

// API Base URL (Dynamic detection)
const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'http://127.0.0.1:8000/api'
    : '/api';

// Initial Mock Products Database (Fallback if backend API offline)
let productsData = [
    {
        id: "chatgpt",
        name: "ChatGPT 4o Plus",
        category: "chatgpt",
        icon: "fa-robot",
        bgClass: "bg-chatgpt",
        badge: "🔥 TOP SELL",
        badgeClass: "badge-hot",
        subtitle: "GPT-4o, DALL-E 3, Canvas, кастомные GPTs и загрузка файлов",
        price: 1490,
        instructions: [
            "1. Перейдите по отправленной вам ссылке-приглашению или используйте логин/пароль.",
            "2. Откройте сайт chatgpt.com и авторизуйтесь.",
            "3. Пользуйтесь возможностями ChatGPT Plus без ограничений!"
        ]
    },
    {
        id: "claude",
        name: "Claude 3.5 Sonnet Pro",
        category: "claude",
        icon: "fa-brain",
        bgClass: "bg-claude",
        badge: "⭐ TOP CODE",
        badgeClass: "badge-pro",
        subtitle: "Лучшая ИИ-модель для написания кода, текста и анализа файлов",
        price: 1890,
        instructions: [
            "1. Зайдите на claude.ai с предоставленным логином и паролем.",
            "2. Введите код подтверждения (при необходимости напишите поддержке).",
            "3. Пользуйтесь профессиональным Claude 3.5 Pro."
        ]
    },
    {
        id: "gemini",
        name: "Gemini Advanced 1.5",
        category: "gemini",
        icon: "fa-sparkles",
        bgClass: "bg-gemini",
        badge: "⚡ FAST",
        badgeClass: "badge-fast",
        subtitle: "Модель от Google с гигантским контекстным окном на 2 млн токенов",
        price: 1290,
        instructions: [
            "1. Перейдите по ссылке активации подписки Google One 2TB + Gemini.",
            "2. Примите приглашение в семейную группу.",
            "3. Gemini Advanced сразу активируется на вашем Google аккаунте!"
        ]
    },
    {
        id: "kimi",
        name: "Kimi AI k1.5 Pro",
        category: "kimi",
        icon: "fa-moon",
        bgClass: "bg-kimi",
        badge: "🔥 NEW",
        badgeClass: "badge-hot",
        subtitle: "Прорывной азиатский ИИ с глубоким рассуждением и анализом длинных веб-страниц",
        price: 990,
        instructions: [
            "1. Зайдите на kimi.moonshot.cn.",
            "2. Введите предоставленный токен доступа в настройки профиля.",
            "3. Наслаждайтесь лимитами Kimi Pro!"
        ]
    },
    {
        id: "midjourney",
        name: "Midjourney v6 Basic/Pro",
        category: "midjourney",
        icon: "fa-palette",
        bgClass: "bg-midjourney",
        badge: "🎨 ART",
        badgeClass: "badge-pro",
        subtitle: "Генерация гиперреалистичных изображений и артов через Discord",
        price: 1590,
        instructions: [
            "1. Зайдите в Discord и перейдите в личный кабинет Midjourney Bot.",
            "2. Используйте выданный Fast Time ключ или личный аккаунт.",
            "3. Генерируйте шедевры командами /imagine!"
        ]
    },
    {
        id: "perplexity",
        name: "Perplexity Pro",
        category: "perplexity",
        icon: "fa-compass",
        bgClass: "bg-perplexity",
        badge: "🔍 SEARCH",
        badgeClass: "badge-fast",
        subtitle: "ИИ-поисковик с доступом к GPT-4o, Claude 3.5 и мгновенными ссылками на источники",
        price: 1390,
        instructions: [
            "1. Зайдите на perplexity.ai с выданными учетными данными.",
            "2. Доступ к Pro Search с выбором любых нейросетей активен!",
        ]
    }
];

// App State
let state = {
    user: {
        id: tg.initDataUnsafe?.user?.id || 777888999,
        name: tg.initDataUnsafe?.user?.first_name || "Пользователь",
        username: tg.initDataUnsafe?.user?.username || "",
        balance: 0,
        isAdmin: true // Allowed for demo
    },
    activeCategory: "all",
    searchQuery: "",
    selectedProduct: null,
    selectedDuration: 1, // months
    selectedDiscount: 1.0,
    selectedAccessType: "invite",
    selectedPayMethod: "demo",
    mySubscriptions: [],
    userOrdersCount: 0,
    userTotalSpent: 0
};

// DOM Elements
const elements = {
    userName: document.getElementById('user-name'),
    userAvatar: document.getElementById('user-avatar'),
    userBalance: document.getElementById('user-balance'),
    productsContainer: document.getElementById('products-container'),
    productCount: document.getElementById('product-count'),
    searchInput: document.getElementById('search-input'),
    mySubsContainer: document.getElementById('my-subs-container'),
    navSubsCount: document.getElementById('nav-subs-count'),
    
    // Profile
    profileAvatar: document.getElementById('profile-big-avatar'),
    profileFullName: document.getElementById('profile-full-name'),
    profileTgId: document.getElementById('profile-tg-id'),
    statOrdersCount: document.getElementById('stat-orders-count'),
    statTotalSpent: document.getElementById('stat-total-spent'),
    statActiveSubs: document.getElementById('stat-active-subs'),
    navAdminTab: document.getElementById('nav-admin-tab'),

    // Modal Buy
    modalBuy: document.getElementById('modal-buy'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalIcon: document.getElementById('modal-icon'),
    modalTitle: document.getElementById('modal-title'),
    modalBadge: document.getElementById('modal-badge'),
    modalDesc: document.getElementById('modal-desc'),
    modalTotalPrice: document.getElementById('modal-total-price'),
    btnConfirmPurchase: document.getElementById('btn-confirm-purchase'),
    durationPills: document.getElementById('duration-pills'),

    // Modal Success
    modalSuccess: document.getElementById('modal-success'),
    successCredText: document.getElementById('success-credentials-text'),
    instructionSteps: document.getElementById('instruction-steps'),
    btnCopyCred: document.getElementById('btn-copy-cred'),
    btnCloseSuccess: document.getElementById('btn-close-success'),

    // Admin
    adminProductSelect: document.getElementById('admin-product-select'),
    adminAddStockForm: document.getElementById('admin-add-stock-form'),
    adminStockData: document.getElementById('admin-stock-data'),
    adminTotalRevenue: document.getElementById('admin-total-revenue'),
    adminOrdersCount: document.getElementById('admin-orders-count'),
    adminStockCount: document.getElementById('admin-stock-count')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    initUserUI();
    setupNavigation();
    setupFilterEvents();
    setupModalEvents();
    await fetchCatalogAndUserData();
    renderProducts();
    renderMySubscriptions();
    updateProfileUI();
});

// Setup User UI Data
function initUserUI() {
    elements.userName.textContent = state.user.name;
    const initial = state.user.name.charAt(0).toUpperCase() || "A";
    elements.userAvatar.textContent = initial;
    elements.profileAvatar.textContent = initial;
    elements.profileFullName.textContent = state.user.name;
    elements.profileTgId.textContent = `ID: ${state.user.id}`;
    
    if (state.user.isAdmin) {
        elements.navAdminTab.style.display = "flex";
    }
}

// Navigation Tabs Handling
function setupNavigation() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            if (!targetTab) return;

            tg.HapticFeedback.impactOccurred('light');

            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            const activeTab = document.getElementById(targetTab);
            if (activeTab) activeTab.classList.add('active');
        });
    });
}

// Category Pill & Search Filters
function setupFilterEvents() {
    // Category pills
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            tg.HapticFeedback.impactOccurred('light');
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.activeCategory = pill.getAttribute('data-category');
            renderProducts();
        });
    });

    // Search bar
    elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
    });
}

// Fetch Catalog from Backend API (with Fallback)
async function fetchCatalogAndUserData() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
            const data = await res.json();
            if (data.products && data.products.length > 0) {
                productsData = data.products;
            }
        }
    } catch (err) {
        console.warn("Backend API not reachable, using local catalog data.");
    }

    // Populate Admin Select
    if (elements.adminProductSelect) {
        elements.adminProductSelect.innerHTML = productsData.map(p => 
            `<option value="${p.id}">${p.name}</option>`
        ).join('');
    }
}

// Render Products Grid
function renderProducts() {
    const filtered = productsData.filter(p => {
        const matchesCategory = state.activeCategory === 'all' || p.category === state.activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(state.searchQuery) || 
                              p.subtitle.toLowerCase().includes(state.searchQuery);
        return matchesCategory && matchesSearch;
    });

    elements.productCount.textContent = `${filtered.length} товаров`;

    if (filtered.length === 0) {
        elements.productsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 10px; color: var(--text-muted);">
                <i class="fa-solid fa-ghost" style="font-size: 36px; margin-bottom: 10px;"></i>
                <p>Ничего не найдено по вашему запросу</p>
            </div>
        `;
        return;
    }

    elements.productsContainer.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="openBuyModal('${p.id}')">
            <div class="product-top">
                <div class="product-icon ${p.bgClass}">
                    <i class="fa-solid ${p.icon}"></i>
                </div>
                <span class="badge-tag ${p.badgeClass}">${p.badge}</span>
            </div>
            <h4 class="product-title">${p.name}</h4>
            <p class="product-subtitle">${p.subtitle}</p>
            <div class="product-footer">
                <div class="product-price">${p.price.toLocaleString('ru-RU')} ₽<span>/мес</span></div>
                <button class="btn-buy-icon"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
    `).join('');
}

// Open Purchase Modal
window.openBuyModal = function(productId) {
    tg.HapticFeedback.impactOccurred('medium');
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    state.selectedProduct = product;
    state.selectedDuration = 1;
    state.selectedDiscount = 1.0;
    state.selectedAccessType = "invite";
    state.selectedPayMethod = "demo";

    elements.modalTitle.textContent = product.name;
    elements.modalBadge.textContent = product.badge;
    elements.modalDesc.textContent = product.subtitle;
    
    // Icon styling
    elements.modalIcon.className = `modal-product-icon ${product.bgClass}`;
    elements.modalIcon.innerHTML = `<i class="fa-solid ${product.icon}"></i>`;

    // Reset duration pills UI
    const durPills = elements.durationPills.querySelectorAll('.dur-pill');
    durPills.forEach((p, idx) => {
        p.classList.toggle('active', idx === 0);
    });

    updateModalTotalPrice();
    elements.modalBuy.classList.add('active');
};

// Calculate and Update Total Price
function updateModalTotalPrice() {
    if (!state.selectedProduct) return;
    const basePrice = state.selectedProduct.price;
    const months = state.selectedDuration;
    const discount = state.selectedDiscount;
    
    // Access type modifier (shared -20%, personal +30%)
    let typeModifier = 1.0;
    if (state.selectedAccessType === 'shared') typeModifier = 0.7;
    if (state.selectedAccessType === 'personal') typeModifier = 1.25;

    const total = Math.round(basePrice * months * discount * typeModifier);
    elements.modalTotalPrice.textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

// Setup Modal Interactive Events
function setupModalEvents() {
    // Close buy modal
    elements.modalCloseBtn.addEventListener('click', () => {
        elements.modalBuy.classList.remove('active');
    });

    // Access Type Radio listener
    document.querySelectorAll('#access-type-grid .radio-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('#access-type-grid .radio-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                state.selectedAccessType = radio.value;
                updateModalTotalPrice();
            }
        });
    });

    // Duration pills listener
    elements.durationPills.querySelectorAll('.dur-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            elements.durationPills.querySelectorAll('.dur-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.selectedDuration = parseInt(pill.getAttribute('data-months'));
            state.selectedDiscount = parseFloat(pill.getAttribute('data-discount'));
            updateModalTotalPrice();
        });
    });

    // Payment methods radio listener
    document.querySelectorAll('.payment-methods .pay-method').forEach(pm => {
        pm.addEventListener('click', () => {
            document.querySelectorAll('.payment-methods .pay-method').forEach(p => p.classList.remove('active'));
            pm.classList.add('active');
            const radio = pm.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                state.selectedPayMethod = radio.value;
            }
        });
    });

    // Confirm Purchase Action
    elements.btnConfirmPurchase.addEventListener('click', async () => {
        await executePurchase();
    });

    // Copy credentials button
    elements.btnCopyCred.addEventListener('click', () => {
        const text = elements.successCredText.textContent;
        navigator.clipboard.writeText(text);
        showToast("Данные успешно скопированы!");
        tg.HapticFeedback.notificationOccurred('success');
    });

    // Close success modal
    elements.btnCloseSuccess.addEventListener('click', () => {
        elements.modalSuccess.classList.remove('active');
        // Switch to Subscriptions Tab
        document.querySelector('.nav-item[data-tab="tab-subs"]').click();
    });

    // Admin Stock Form
    if (elements.adminAddStockForm) {
        elements.adminAddStockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const prodId = elements.adminProductSelect.value;
            const textData = elements.adminStockData.value.trim();
            if (!textData) return showToast("Введите данные для склада!");
            
            showToast("Склад успешно пополнен!");
            elements.adminStockData.value = "";
            state.userOrdersCount += 1;
            updateAdminStats();
        });
    }
}

// Execute Purchase Request
async function executePurchase() {
    tg.HapticFeedback.notificationOccurred('success');
    const product = state.selectedProduct;
    if (!product) return;

    elements.btnConfirmPurchase.disabled = true;
    elements.btnConfirmPurchase.textContent = "Обработка платежа...";

    // Mock generated access credentials
    const randomPass = Math.random().toString(36).substring(2, 10);
    const mockInvite = `https://${product.id}.ai/invite/sub_${Date.now()}`;
    const credentialData = state.selectedAccessType === 'invite' 
        ? `Ссылка-приглашение: ${mockInvite}`
        : `Логин: sub_${state.user.id}@aistore.ru | Пароль: ${randomPass}`;

    // Close checkout modal
    setTimeout(() => {
        elements.modalBuy.classList.remove('active');
        elements.btnConfirmPurchase.disabled = false;
        elements.btnConfirmPurchase.innerHTML = '<span>Оформить подписку</span><i class="fa-solid fa-arrow-right"></i>';

        // Add to active subscriptions
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + state.selectedDuration);

        const newSub = {
            id: `sub_${Date.now()}`,
            productName: product.name,
            icon: product.icon,
            bgClass: product.bgClass,
            accessType: state.selectedAccessType,
            credentials: credentialData,
            expiry: expiryDate.toLocaleDateString('ru-RU'),
            daysLeft: state.selectedDuration * 30,
            instructions: product.instructions
        };

        state.mySubscriptions.unshift(newSub);
        state.userOrdersCount += 1;
        state.userTotalSpent += parseInt(elements.modalTotalPrice.textContent.replace(/\D/g, ''));

        // Render Success Modal
        elements.successCredText.textContent = credentialData;
        elements.instructionSteps.innerHTML = product.instructions.map(step => `<li>${step}</li>`).join('');
        elements.modalSuccess.classList.add('active');

        // Update UI Tabs
        renderMySubscriptions();
        updateProfileUI();
        updateAdminStats();
    }, 800);
}

// Render Subscriptions List
function renderMySubscriptions() {
    elements.navSubsCount.textContent = state.mySubscriptions.length;

    if (state.mySubscriptions.length === 0) {
        elements.mySubsContainer.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
                <i class="fa-solid fa-box-open" style="font-size: 42px; margin-bottom: 12px; color: var(--text-dim);"></i>
                <h4 style="margin: 0 0 6px 0; color: var(--text-main);">У вас пока нет активных подписок</h4>
                <p style="font-size: 13px;">Выберите нейросеть в каталоге и получите авто-выдачу за 1 минуту.</p>
            </div>
        `;
        return;
    }

    elements.mySubsContainer.innerHTML = state.mySubscriptions.map(sub => `
        <div class="sub-card">
            <div class="sub-header">
                <div class="sub-title-wrap">
                    <div class="sub-icon ${sub.bgClass}">
                        <i class="fa-solid ${sub.icon}"></i>
                    </div>
                    <div>
                        <h4 class="sub-title">${sub.productName}</h4>
                        <span class="sub-type">Тип: ${sub.accessType.toUpperCase()}</span>
                    </div>
                </div>
                <span class="sub-status-badge"><i class="fa-solid fa-circle-check"></i> Активна</span>
            </div>
            
            <div class="sub-cred-box">
                <span>${sub.credentials}</span>
            </div>

            <div class="sub-expiry">
                <i class="fa-solid fa-clock"></i> Действует до: <strong>${sub.expiry}</strong> (осталось ${sub.daysLeft} дн.)
            </div>
        </div>
    `).join('');
}

// Update Profile Tab Data
function updateProfileUI() {
    elements.statOrdersCount.textContent = state.userOrdersCount;
    elements.statTotalSpent.textContent = `${state.userTotalSpent.toLocaleString('ru-RU')} ₽`;
    elements.statActiveSubs.textContent = state.mySubscriptions.length;
}

// Update Admin Stats
function updateAdminStats() {
    if (elements.adminTotalRevenue) {
        elements.adminTotalRevenue.textContent = `${state.userTotalSpent.toLocaleString('ru-RU')} ₽`;
        elements.adminOrdersCount.textContent = state.userOrdersCount;
        elements.adminStockCount.textContent = 42 + state.userOrdersCount;
    }
}

// Toast Notifications Helper
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

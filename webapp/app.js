// Telegram WebApp SDK Initialization
const tg = window.Telegram?.WebApp || {
    ready: () => {},
    expand: () => {},
    close: () => {},
    initDataUnsafe: {
        user: { id: 777888999, first_name: "Клиент", username: "apyra_user" }
    },
    HapticFeedback: {
        impactOccurred: () => {},
        notificationOccurred: () => {}
    }
};

tg.ready();
tg.expand();

// API Endpoint
const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'http://127.0.0.1:8000/api'
    : '/api';

// Apyra Shop Catalog Database
let productsData = [
    {
        id: "chatgpt",
        name: "ChatGPT 4o Plus",
        category: "chatgpt",
        icon: "fa-robot",
        bgClass: "bg-chatgpt",
        badge: "🔥 ХИТ ПРОДАЖ",
        badgeClass: "badge-hot",
        subtitle: "Доступ к GPT-4o, DALL-E 3, Canvas и персональным ассистентам GPTs",
        price: 1490,
        instructions: [
            "1. Перейдите по выданной инвайт-ссылке или введите логин и пароль.",
            "2. Откройте chatgpt.com и начните работу в подписке Plus.",
            "3. Гарантия Apyra Shop действует на весь срок оплаты."
        ]
    },
    {
        id: "claude",
        name: "Claude 3.5 Sonnet Pro",
        category: "claude",
        icon: "fa-brain",
        bgClass: "bg-claude",
        badge: "⭐ ДЛЯ КОДА",
        badgeClass: "badge-pro",
        subtitle: "Мощная ИИ-модель Anthropic для генерации программного кода и больших текстов",
        price: 1890,
        instructions: [
            "1. Авторизуйтесь на сайте claude.ai под выданными учетными данными.",
            "2. Используйте полные преимущества тарифа Pro без ограничений.",
            "3. По всем вопросам обратитесь в службу поддержки Apyra Shop."
        ]
    },
    {
        id: "gemini",
        name: "Gemini 1.5 Advanced",
        category: "gemini",
        icon: "fa-sparkles",
        bgClass: "bg-gemini",
        badge: "⚡ 2M CONTEXT",
        badgeClass: "badge-fast",
        subtitle: "Модель от Google с невероятным окном контекста 2 000 000 токенов и Google One 2TB",
        price: 1290,
        instructions: [
            "1. Примите приглашение в семейную группу Google.",
            "2. Gemini Advanced мгновенно активируется на вашем личном аккаунте!"
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
        subtitle: "Инновационный азиатский рассуждающий ИИ с анализом длинных документов",
        price: 990,
        instructions: [
            "1. Войдите на kimi.moonshot.cn.",
            "2. Вставьте предоставленный ключ доступа Apyra в личный кабинет.",
            "3. Пользуйтесь расширенными лимитами k1.5 Pro!"
        ]
    },
    {
        id: "midjourney",
        name: "Midjourney v6 Pro",
        category: "midjourney",
        icon: "fa-palette",
        bgClass: "bg-midjourney",
        badge: "🎨 ДИЗАЙН",
        badgeClass: "badge-pro",
        subtitle: "Генерация гиперреалистичных артов и изображений высокого разрешения",
        price: 1590,
        instructions: [
            "1. Откройте Discord и войдите в личный чат с ботом Midjourney.",
            "2. Используйте Fast Time ключ активации от Apyra Shop.",
            "3. Создавайте шедевры через команду /imagine!"
        ]
    },
    {
        id: "perplexity",
        name: "Perplexity Pro",
        category: "perplexity",
        icon: "fa-compass",
        bgClass: "bg-perplexity",
        badge: "🔍 ПОИСК",
        badgeClass: "badge-fast",
        subtitle: "Интеллектуальный поисковик с возможностью переключения моделей GPT-4o и Claude 3.5",
        price: 1390,
        instructions: [
            "1. Авторизуйтесь на perplexity.ai под предоставленными данными.",
            "2. Наслаждайтесь нелимитированным Pro Search по всему интернету."
        ]
    }
];

// App State
let state = {
    user: {
        id: tg.initDataUnsafe?.user?.id || 777888999,
        name: tg.initDataUnsafe?.user?.first_name || "Клиент",
        username: tg.initDataUnsafe?.user?.username || "",
        balance: 0,
        isAdmin: true
    },
    activeCategory: "all",
    searchQuery: "",
    selectedProduct: null,
    selectedDuration: 1,
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

// App Initialization
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

function initUserUI() {
    if (elements.profileFullName) elements.profileFullName.textContent = state.user.name;
    if (elements.profileTgId) elements.profileTgId.textContent = `ID: ${state.user.id}`;
    if (state.user.isAdmin && elements.navAdminTab) {
        elements.navAdminTab.style.display = "flex";
    }
}

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

function setupFilterEvents() {
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

    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase().trim();
            renderProducts();
        });
    }
}

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
        console.warn("API offline, static catalog active.");
    }

    if (elements.adminProductSelect) {
        elements.adminProductSelect.innerHTML = productsData.map(p => 
            `<option value="${p.id}">${p.name}</option>`
        ).join('');
    }
}

function renderProducts() {
    const filtered = productsData.filter(p => {
        const matchesCategory = state.activeCategory === 'all' || p.category === state.activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(state.searchQuery) || 
                              p.subtitle.toLowerCase().includes(state.searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (elements.productCount) elements.productCount.textContent = `${filtered.length} сервисов`;

    if (filtered.length === 0) {
        elements.productsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 10px; color: var(--text-secondary);">
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
                <button class="btn-buy-icon"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>
    `).join('');
}

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
    
    elements.modalIcon.className = `modal-product-icon ${product.bgClass}`;
    elements.modalIcon.innerHTML = `<i class="fa-solid ${product.icon}"></i>`;

    const durPills = elements.durationPills.querySelectorAll('.dur-pill');
    durPills.forEach((p, idx) => {
        p.classList.toggle('active', idx === 0);
    });

    updateModalTotalPrice();
    elements.modalBuy.classList.add('active');
};

function updateModalTotalPrice() {
    if (!state.selectedProduct) return;
    const basePrice = state.selectedProduct.price;
    const months = state.selectedDuration;
    const discount = state.selectedDiscount;
    
    let typeModifier = 1.0;
    if (state.selectedAccessType === 'shared') typeModifier = 0.7;
    if (state.selectedAccessType === 'personal') typeModifier = 1.25;

    const total = Math.round(basePrice * months * discount * typeModifier);
    elements.modalTotalPrice.textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

function setupModalEvents() {
    elements.modalCloseBtn.addEventListener('click', () => {
        elements.modalBuy.classList.remove('active');
    });

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

    elements.durationPills.querySelectorAll('.dur-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            elements.durationPills.querySelectorAll('.dur-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.selectedDuration = parseInt(pill.getAttribute('data-months'));
            state.selectedDiscount = parseFloat(pill.getAttribute('data-discount'));
            updateModalTotalPrice();
        });
    });

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

    elements.btnConfirmPurchase.addEventListener('click', async () => {
        await executePurchase();
    });

    elements.btnCopyCred.addEventListener('click', () => {
        const text = elements.successCredText.textContent;
        navigator.clipboard.writeText(text);
        showToast("Данные Apyra Shop скопированы!");
        tg.HapticFeedback.notificationOccurred('success');
    });

    elements.btnCloseSuccess.addEventListener('click', () => {
        elements.modalSuccess.classList.remove('active');
        document.querySelector('.nav-item[data-tab="tab-subs"]').click();
    });

    if (elements.adminAddStockForm) {
        elements.adminAddStockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const textData = elements.adminStockData.value.trim();
            if (!textData) return showToast("Заполните складские данные!");
            
            showToast("Склад Apyra Shop пополнен!");
            elements.adminStockData.value = "";
            state.userOrdersCount += 1;
            updateAdminStats();
        });
    }
}

async function executePurchase() {
    tg.HapticFeedback.notificationOccurred('success');
    const product = state.selectedProduct;
    if (!product) return;

    elements.btnConfirmPurchase.disabled = true;
    elements.btnConfirmPurchase.textContent = "Активация подписки Apyra...";

    const randomPass = Math.random().toString(36).substring(2, 10);
    const mockInvite = `https://apyra.shop/activate/${product.id}_${Date.now()}`;
    const credentialData = state.selectedAccessType === 'invite' 
        ? `Инвайт-ссылка: ${mockInvite}`
        : `Логин: sub_${state.user.id}@apyra.shop | Пароль: ${randomPass}`;

    setTimeout(() => {
        elements.modalBuy.classList.remove('active');
        elements.btnConfirmPurchase.disabled = false;
        elements.btnConfirmPurchase.innerHTML = '<span>Оплатить и получить доступ</span><i class="fa-solid fa-arrow-right"></i>';

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

        elements.successCredText.textContent = credentialData;
        elements.instructionSteps.innerHTML = product.instructions.map(step => `<li>${step}</li>`).join('');
        elements.modalSuccess.classList.add('active');

        renderMySubscriptions();
        updateProfileUI();
        updateAdminStats();
    }, 700);
}

function renderMySubscriptions() {
    if (elements.navSubsCount) elements.navSubsCount.textContent = state.mySubscriptions.length;

    if (state.mySubscriptions.length === 0) {
        elements.mySubsContainer.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; color: var(--text-secondary);">
                <i class="fa-solid fa-box-open" style="font-size: 42px; margin-bottom: 12px; opacity: 0.5;"></i>
                <h4 style="margin: 0 0 6px 0; color: var(--text-primary);">У вас пока нет активных подписок</h4>
                <p style="font-size: 13px;">Выберите нейросеть в каталоге Apyra Shop для авто-выдачи.</p>
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
                <i class="fa-solid fa-clock"></i> Истекает: <strong>${sub.expiry}</strong> (${sub.daysLeft} дн.)
            </div>
        </div>
    `).join('');
}

function updateProfileUI() {
    if (elements.statOrdersCount) elements.statOrdersCount.textContent = state.userOrdersCount;
    if (elements.statTotalSpent) elements.statTotalSpent.textContent = `${state.userTotalSpent.toLocaleString('ru-RU')} ₽`;
    if (elements.statActiveSubs) elements.statActiveSubs.textContent = state.mySubscriptions.length;
}

function updateAdminStats() {
    if (elements.adminTotalRevenue) {
        elements.adminTotalRevenue.textContent = `${state.userTotalSpent.toLocaleString('ru-RU')} ₽`;
        elements.adminOrdersCount.textContent = state.userOrdersCount;
        elements.adminStockCount.textContent = 50 + state.userOrdersCount;
    }
}

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

// ========================
// OBSIDIAN EDGE - CRYPTO TRADING
// Professional Trading Platform
// ========================

// Crypto assets data
const CRYPTO_ASSETS = [
    { symbol: 'BTC', name: 'Bitcoin', type: 'bluechip', color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', type: 'bluechip', color: '#627EEA' },
    { symbol: 'SOL', name: 'Solana', type: 'altcoin', color: '#00FFA3' },
    { symbol: 'DOGE', name: 'Dogecoin', type: 'memecoin', color: '#C2A633' },
    { symbol: 'SHIB', name: 'Shiba Inu', type: 'memecoin', color: '#FF3B8B' },
    { symbol: 'PEPE', name: 'Pepe Coin', type: 'memecoin', color: '#00FF00' },
    { symbol: 'BONK', name: 'Bonk', type: 'memecoin', color: '#FF6B00' },
    { symbol: 'WIF', name: 'dogwifhat', type: 'memecoin', color: '#FFB6C1' }
];

// Trading portfolio
let userPortfolio = {
    balance: 10000.00,
    crypto: [
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.05, avgPrice: 42000 },
        { symbol: 'ETH', name: 'Ethereum', amount: 0.5, avgPrice: 2300 },
        { symbol: 'SOL', name: 'Solana', amount: 10, avgPrice: 100 }
    ]
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Obsidian Edge Crypto Trading Platform');
    
    // Setup all functionality
    setupNavigation();
    setupButtonHandlers();
    setupTradingButtons();
    setupCryptoFilters();
    updatePortfolioDisplay();
    
    // Start live updates
    startLiveUpdates();
});

// ========================
// NAVIGATION & UI SETUP
// ========================

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Scroll to section
                const targetId = link.getAttribute('href').substring(1);
                if (targetId) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
}

function setupButtonHandlers() {
    // Hero CTA buttons
    document.getElementById('enterMarketBtn').addEventListener('click', () => {
        showModal('signup');
    });
    
    document.getElementById('viewPerformanceBtn').addEventListener('click', () => {
        showPerformanceModal();
    });
    
    // Header buttons
    document.getElementById('loginBtn').addEventListener('click', () => {
        showModal('login');
    });
    
    document.getElementById('signupBtn').addEventListener('click', () => {
        showModal('signup');
    });
    
    // Performance section buttons
    document.querySelectorAll('.view-analytics').forEach(btn => {
        btn.addEventListener('click', () => {
            showPerformanceModal();
        });
    });
    
    document.querySelectorAll('.view-metrics').forEach(btn => {
        btn.addEventListener('click', () => {
            showMetricsModal();
        });
    });
    
    document.querySelectorAll('.view-clients').forEach(btn => {
        btn.addEventListener('click', () => {
            showClientsModal();
        });
    });
}

function setupCryptoFilters() {
    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCryptoByType(btn.getAttribute('data-filter'));
        });
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.crypto-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCryptoByType(btn.getAttribute('data-filter'));
        });
    });
}

// ========================
// TRADING FUNCTIONS
// ========================

function setupTradingButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('trade-buy') || e.target.classList.contains('trade-sell')) {
            const symbol = e.target.getAttribute('data-symbol');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const action = e.target.classList.contains('trade-buy') ? 'buy' : 'sell';
            
            showTradeModal(symbol, action, price);
        }
    });
}

function showTradeModal(symbol, action, price) {
    const asset = CRYPTO_ASSETS.find(a => a.symbol === symbol);
    const assetName = asset ? asset.name : symbol;
    const actionColor = action === 'buy' ? '#00E0A4' : '#E63946';
    const actionText = action === 'buy' ? 'Buy' : 'Sell';
    
    // Default amounts based on crypto
    const defaultAmount = symbol === 'BTC' ? 0.01 : 
                         symbol === 'ETH' ? 0.1 :
                         symbol === 'SOL' ? 1 :
                         symbol === 'DOGE' ? 1000 :
                         symbol === 'SHIB' ? 1000000 : 100;
    
    const step = symbol === 'BTC' ? '0.001' : 
                symbol === 'ETH' ? '0.01' : 
                '1';
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${actionText} ${symbol}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="background: ${asset?.color}10; border-left: 4px solid ${asset?.color}; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${asset?.color}20; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-coins" style="color: ${asset?.color}; font-size: 20px;"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: white; font-size: 18px;">${assetName}</div>
                                <div style="color: #8A8F98; font-size: 14px;">Current Price: <span style="color: white; font-weight: 600;">${formatPrice(price)}</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #8A8F98;">Amount (${symbol})</label>
                        <input type="number" id="tradeAmount" value="${defaultAmount}" step="${step}" min="0.00000001" class="modal-input">
                    </div>
                    
                    <div style="background: #0B0D10; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #2A2D36;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #8A8F98;">Total Cost</span>
                            <span id="totalCost" style="font-weight: 600; color: ${actionColor}; font-size: 18px;">
                                $${(defaultAmount * price).toFixed(2)}
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 14px;">
                            <span style="color: #8A8F98;">Available Balance</span>
                            <span style="color: white; font-weight: 600;">$${userPortfolio.balance.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" style="flex: 1;" onclick="closeModal()">Cancel</button>
                        <button onclick="executeTrade('${symbol}', '${action}', ${price})" 
                            style="flex: 1; background: ${actionColor}; color: #0B0D10; border: none; padding: 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 16px;">
                            Confirm ${actionText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Update total cost when amount changes
    document.getElementById('tradeAmount').addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        const total = amount * price;
        document.getElementById('totalCost').textContent = `$${total.toFixed(2)}`;
    });
    
    // Close modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

function executeTrade(symbol, action, price) {
    const amountInput = document.getElementById('tradeAmount');
    const amount = parseFloat(amountInput.value) || 0;
    const totalCost = amount * price;
    const asset = CRYPTO_ASSETS.find(a => a.symbol === symbol);
    const assetName = asset ? asset.name : symbol;
    
    closeModal();
    
    if (action === 'buy') {
        if (userPortfolio.balance >= totalCost) {
            userPortfolio.balance -= totalCost;
            
            const existingCrypto = userPortfolio.crypto.find(c => c.symbol === symbol);
            if (existingCrypto) {
                existingCrypto.amount += amount;
                existingCrypto.avgPrice = ((existingCrypto.avgPrice * (existingCrypto.amount - amount)) + totalCost) / existingCrypto.amount;
            } else {
                userPortfolio.crypto.push({
                    symbol: symbol,
                    name: assetName,
                    amount: amount,
                    avgPrice: price
                });
            }
            
            showNotification(`Bought ${formatAmount(amount, symbol)} ${symbol} at ${formatPrice(price)}`, 'success');
            updatePortfolioDisplay();
        } else {
            showNotification(`Insufficient balance. Need $${totalCost.toFixed(2)}`, 'error');
        }
    } else if (action === 'sell') {
        const existingCrypto = userPortfolio.crypto.find(c => c.symbol === symbol);
        
        if (existingCrypto && existingCrypto.amount >= amount) {
            userPortfolio.balance += totalCost;
            existingCrypto.amount -= amount;
            
            if (existingCrypto.amount === 0) {
                userPortfolio.crypto = userPortfolio.crypto.filter(c => c.symbol !== symbol);
            }
            
            showNotification(`Sold ${formatAmount(amount, symbol)} ${symbol} at ${formatPrice(price)}`, 'success');
            updatePortfolioDisplay();
        } else {
            const available = existingCrypto ? existingCrypto.amount : 0;
            showNotification(`Insufficient ${symbol}. Available: ${formatAmount(available, symbol)}`, 'error');
        }
    }
}

// ========================
// MODAL FUNCTIONS
// ========================

function showModal(type) {
    let title, message, buttonText;
    
    if (type === 'login') {
        title = 'Platform Login';
        message = 'Access your trading account';
        buttonText = 'Log In';
    } else {
        title = 'Create Account';
        message = 'Start trading with precision and discipline';
        buttonText = 'Create Account';
    }
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="color: #8A8F98; margin-bottom: 20px;">${message}</p>
                    <input type="email" placeholder="Email" class="modal-input">
                    ${type === 'signup' ? '<input type="text" placeholder="Full Name" class="modal-input">' : ''}
                    <input type="password" placeholder="Password" class="modal-input">
                    <button class="btn btn-primary" style="width: 100%; margin-top: 10px;" onclick="submitForm('${type}')">
                        ${buttonText}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

function showPerformanceModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Platform Performance</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 48px; color: #00E0A4; font-weight: 700; margin-bottom: 10px;">
                            +42.8%
                        </div>
                        <div style="color: #8A8F98; font-size: 14px;">Average Annual Return</div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #8A8F98;">Best Performing Asset</span>
                            <span style="color: white; font-weight: 600;">SOL (+284%)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #8A8F98;">Win Rate</span>
                            <span style="color: white; font-weight: 600;">76.4%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #8A8F98;">Sharpe Ratio</span>
                            <span style="color: white; font-weight: 600;">2.8</span>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" style="width: 100%;" onclick="closeModal(); showModal('signup')">
                        Access Full Analytics
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalClose();
}

function showMetricsModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Platform Metrics</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 25px;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(0, 224, 164, 0.1); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-bolt" style="color: #00E0A4; font-size: 20px;"></i>
                            </div>
                            <div>
                                <div style="font-size: 24px; color: white; font-weight: 600;">2.3ms</div>
                                <div style="color: #8A8F98; font-size: 14px;">Average Execution Time</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(0, 224, 164, 0.1); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-chart-line" style="color: #00E0A4; font-size: 20px;"></i>
                            </div>
                            <div>
                                <div style="font-size: 24px; color: white; font-weight: 600;">99.9%</div>
                                <div style="color: #8A8F98; font-size: 14px;">Platform Uptime</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(0, 224, 164, 0.1); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-exchange-alt" style="color: #00E0A4; font-size: 20px;"></i>
                            </div>
                            <div>
                                <div style="font-size: 24px; color: white; font-weight: 600;">150+</div>
                                <div style="color: #8A8F98; font-size: 14px;">Trading Pairs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalClose();
}

function showClientsModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Institutional Clients</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 36px; color: #00E0A4; font-weight: 700; margin-bottom: 10px;">
                            150+
                        </div>
                        <div style="color: #8A8F98; font-size: 14px;">Institutional Clients</div>
                    </div>
                    
                    <p style="color: #8A8F98; text-align: center; margin-bottom: 25px;">
                        Trusted by hedge funds, family offices, and proprietary trading firms managing over $4.2B in combined assets.
                    </p>
                    
                    <button class="btn btn-primary" style="width: 100%;" onclick="closeModal(); showModal('signup')">
                        Request Institutional Access
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalClose();
}

function setupModalClose() {
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function submitForm(type) {
    closeModal();
    showNotification(
        type === 'login' ? 'Login submitted successfully' : 'Account creation initiated',
        'success'
    );
}

// ========================
// HELPER FUNCTIONS
// ========================

function filterCryptoByType(type) {
    const rows = document.querySelectorAll('.market-table tbody tr');
    rows.forEach(row => {
        const rowType = row.getAttribute('data-type');
        if (type === 'all' || rowType === type) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updatePortfolioDisplay() {
    // Calculate total portfolio value
    let totalValue = userPortfolio.balance;
    
    userPortfolio.crypto.forEach(crypto => {
        const currentPrice = getCurrentPrice(crypto.symbol);
        totalValue += crypto.amount * currentPrice;
    });
    
    // Update portfolio value display
    const portfolioElement = document.getElementById('portfolioValue');
    if (portfolioElement) {
        portfolioElement.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

function getCurrentPrice(symbol) {
    // Simulated current prices
    const prices = {
        'BTC': 43250 + Math.random() * 1000,
        'ETH': 2350 + Math.random() * 100,
        'SOL': 108 + Math.random() * 10,
        'DOGE': 0.0814 + Math.random() * 0.005,
        'SHIB': 0.00000812 + Math.random() * 0.000001,
        'PEPE': 0.00000125 + Math.random() * 0.0000003,
        'BONK': 0.0000225 + Math.random() * 0.000005,
        'WIF': 0.325 + Math.random() * 0.05
    };
    return prices[symbol] || 1;
}

function formatPrice(price) {
    if (price < 0.0001) return `$${price.toFixed(8)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
}

function formatAmount(amount, symbol) {
    if (symbol === 'BTC') return amount.toFixed(6);
    if (symbol === 'ETH') return amount.toFixed(4);
    if (symbol === 'SOL') return amount.toFixed(2);
    if (symbol === 'DOGE' || symbol === 'SHIB') return amount.toLocaleString();
    return amount.toFixed(2);
}

function showNotification(message, type) {
    const color = type === 'success' ? '#00E0A4' : '#E63946';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #12141A;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        border-left: 4px solid ${color};
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-size: 14px;
        border: 1px solid #2A2D36;
    `;
    
    notification.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <i class="fas ${icon}" style="color:${color};"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function startLiveUpdates() {
    // Update prices every 15 seconds
    setInterval(() => {
        updateCryptoPrices();
    }, 15000);
}

function updateCryptoPrices() {
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach(row => {
        if (Math.random() > 0.7) { // 30% chance of update
            const symbol = row.cells[0].querySelector('.asset-code').textContent;
            const currentPrice = getCurrentPrice(symbol);
            const change = (Math.random() * 4 - 2).toFixed(2);
            
            // Update price
            row.cells[1].textContent = formatPrice(currentPrice);
            
            // Update change
            row.cells[2].textContent = `${parseFloat(change) > 0 ? '+' : ''}${change}%`;
            row.cells[2].className = parseFloat(change) > 0 ? 'price-up' : 'price-down';
            
            // Update button data
            const buyBtn = row.querySelector('.trade-buy');
            const sellBtn = row.querySelector('.trade-sell');
            if (buyBtn && sellBtn) {
                buyBtn.setAttribute('data-price', currentPrice);
                sellBtn.setAttribute('data-price', currentPrice);
            }
        }
    });
}

// Make functions globally available
window.executeTrade = executeTrade;
window.submitForm = submitForm;
window.closeModal = closeModal;

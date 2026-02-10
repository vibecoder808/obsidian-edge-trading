// ========================
// OBSIDIAN EDGE - CRYPTO TRADING PLATFORM
// Real-time Memecoin & Altcoin Trading
// ========================

// API Configuration - Using Finnhub for crypto
const FINNHUB_API_KEY = 'd65i7npr01qlmj2v9k10d65i7npr01qlmj2v9k1g';
const USE_REAL_DATA = true;

// Trading portfolio (crypto simulation)
let userPortfolio = {
    balance: 10000.00, // USD balance
    crypto: [
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.05, avgPrice: 42000 },
        { symbol: 'DOGE', name: 'Dogecoin', amount: 5000, avgPrice: 0.08 },
        { symbol: 'SHIB', name: 'Shiba Inu', amount: 5000000, avgPrice: 0.000008 }
    ]
};

// Crypto assets to track (memecoins, altcoins, shitcoins)
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Obsidian Edge Crypto Trading Platform - COMMERCIAL VERSION');
    console.log('Tracking memecoins & altcoins');
    
    // Set up all functionality
    setupNavigation();
    setupTradingButtons();
    setupPortfolioDisplay();
    setupCryptoFilters();
    
    // Load crypto data
    loadCryptoData();
    
    // Start live updates
    startLiveUpdates();
});

// ========================
// CRYPTO DATA FUNCTIONS
// ========================

async function loadCryptoData() {
    console.log('Loading cryptocurrency data...');
    
    try {
        // Use multiple crypto APIs
        await loadDataFromCoingecko();
        showAPIStatus('Live Crypto Data', 'success');
        
    } catch (error) {
        console.log('Using simulated crypto data:', error);
        loadSimulatedCryptoData();
        showAPIStatus('Demo Mode', 'warning');
    }
}

async function loadDataFromCoingecko() {
    // Using Coingecko API (free, no key needed)
    const cryptoIds = ['bitcoin', 'ethereum', 'solana', 'dogecoin', 'shiba-inu'];
    
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd&include_24h_change=true`
        );
        
        if (response.ok) {
            const data = await response.json();
            updateCryptoTable(data);
        } else {
            throw new Error('Coingecko API failed');
        }
    } catch (error) {
        // Fallback to simulated data
        loadSimulatedCryptoData();
    }
}

function updateCryptoTable(apiData) {
    // Map API symbols to our symbols
    const symbolMap = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'solana': 'SOL',
        'dogecoin': 'DOGE',
        'shiba-inu': 'SHIB'
    };
    
    // Update each row with real data
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach((row, index) => {
        if (index < CRYPTO_ASSETS.length) {
            const asset = CRYPTO_ASSETS[index];
            let price, change;
            
            // Check if we have real data for this asset
            const apiKey = Object.keys(symbolMap).find(key => symbolMap[key] === asset.symbol);
            
            if (apiKey && apiData[apiKey]) {
                price = apiData[apiKey].usd;
                change = apiData[apiKey].usd_24h_change;
            } else {
                // Use simulated data for memecoins not in API
                price = getSimulatedCryptoPrice(asset.symbol);
                change = (Math.random() * 20 - 10).toFixed(2); // -10% to +10%
            }
            
            // Format based on price
            const priceFormatted = price < 1 ? `$${price.toFixed(6)}` : 
                                  price < 100 ? `$${price.toFixed(4)}` : 
                                  `$${price.toFixed(2)}`;
            
            // Calculate market cap (simulated for memecoins)
            const marketCap = calculateMarketCap(asset.symbol, price);
            
            // Update row
            row.cells[0].querySelector('.asset-name').textContent = asset.name;
            row.cells[0].querySelector('.asset-code').textContent = asset.symbol;
            row.cells[1].textContent = priceFormatted;
            row.cells[2].textContent = `${parseFloat(change) > 0 ? '+' : ''}${parseFloat(change).toFixed(2)}%`;
            row.cells[2].className = parseFloat(change) > 0 ? 'price-up' : 'price-down';
            row.cells[3].textContent = `$${(Math.random() * 500 + 50).toFixed(1)}M`; // Volume
            row.cells[4].textContent = `$${(marketCap / 1000000000).toFixed(2)}B`;
            
            // Update button data
            const buyBtn = row.querySelector('.trade-buy');
            const sellBtn = row.querySelector('.trade-sell');
            if (buyBtn && sellBtn) {
                buyBtn.setAttribute('data-symbol', asset.symbol);
                buyBtn.setAttribute('data-price', price);
                sellBtn.setAttribute('data-symbol', asset.symbol);
                sellBtn.setAttribute('data-price', price);
            }
            
            // Add crypto color indicator
            row.cells[0].querySelector('.asset-icon').style.backgroundColor = asset.color + '20';
            row.cells[0].querySelector('.asset-icon i').style.color = asset.color;
        }
    });
}

function getSimulatedCryptoPrice(symbol) {
    const basePrices = {
        'BTC': 43000 + Math.random() * 2000,
        'ETH': 2300 + Math.random() * 200,
        'SOL': 100 + Math.random() * 20,
        'DOGE': 0.08 + Math.random() * 0.02,
        'SHIB': 0.000008 + Math.random() * 0.000002,
        'PEPE': 0.0000012 + Math.random() * 0.0000003,
        'BONK': 0.00002 + Math.random() * 0.000005,
        'WIF': 0.30 + Math.random() * 0.10
    };
    return basePrices[symbol] || 1.00;
}

function calculateMarketCap(symbol, price) {
    const circulatingSupplies = {
        'BTC': 19400000,
        'ETH': 120000000,
        'SOL': 433000000,
        'DOGE': 142000000000,
        'SHIB': 589000000000000,
        'PEPE': 420000000000000,
        'BONK': 100000000000000,
        'WIF': 1000000000
    };
    return price * (circulatingSupplies[symbol] || 1000000000);
}

function loadSimulatedCryptoData() {
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach((row, index) => {
        if (index < CRYPTO_ASSETS.length) {
            const asset = CRYPTO_ASSETS[index];
            const price = getSimulatedCryptoPrice(asset.symbol);
            const change = (Math.random() * 20 - 10).toFixed(2); // -10% to +10%
            const volume = (Math.random() * 500 + 50).toFixed(1);
            const marketCap = calculateMarketCap(asset.symbol, price) / 1000000000;
            
            // Format price based on value
            const priceFormatted = price < 1 ? `$${price.toFixed(6)}` : 
                                  price < 100 ? `$${price.toFixed(4)}` : 
                                  `$${price.toFixed(2)}`;
            
            row.cells[0].querySelector('.asset-name').textContent = asset.name;
            row.cells[0].querySelector('.asset-code').textContent = asset.symbol;
            row.cells[1].textContent = priceFormatted;
            row.cells[2].textContent = `${parseFloat(change) > 0 ? '+' : ''}${change}%`;
            row.cells[2].className = parseFloat(change) > 0 ? 'price-up' : 'price-down';
            row.cells[3].textContent = `$${volume}M`;
            row.cells[4].textContent = `$${marketCap.toFixed(2)}B`;
            
            // Add crypto color
            row.cells[0].querySelector('.asset-icon').style.backgroundColor = asset.color + '20';
            row.cells[0].querySelector('.asset-icon i').style.color = asset.color;
        }
    });
}

// ========================
// TRADING FUNCTIONS - CRYPTO
// ========================

function setupTradingButtons() {
    // Buy/Sell buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('trade-buy') || e.target.classList.contains('trade-sell')) {
            const symbol = e.target.getAttribute('data-symbol');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const action = e.target.classList.contains('trade-buy') ? 'buy' : 'sell';
            
            showCryptoTradeModal(symbol, action, price);
        }
        
        // Modal buttons
        if (e.target.classList.contains('btn-login')) {
            showCryptoModal('login');
        }
        if (e.target.classList.contains('btn-primary') && 
            !e.target.classList.contains('trade-btn')) {
            if (e.target.textContent.includes('Get Started') || 
                e.target.textContent.includes('Open Free Account')) {
                showCryptoModal('signup');
            }
        }
    });
    
    // Market tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCryptoByType(btn.getAttribute('data-filter'));
        });
    });
}

function showCryptoTradeModal(symbol, action, price) {
    const asset = CRYPTO_ASSETS.find(a => a.symbol === symbol);
    const assetName = asset ? asset.name : symbol;
    const actionColor = action === 'buy' ? '#00ff9d' : '#ff4757';
    const actionText = action === 'buy' ? 'Buy' : 'Sell';
    
    // Format amount based on crypto type
    const defaultAmount = symbol === 'BTC' ? 0.01 : 
                         symbol === 'ETH' ? 0.1 :
                         symbol === 'SOL' ? 1 :
                         symbol === 'DOGE' ? 1000 :
                         symbol === 'SHIB' ? 1000000 : 100;
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content crypto-modal">
                <div class="modal-header" style="border-bottom-color: ${actionColor}30;">
                    <h2 style="color: ${actionColor};">
                        <i class="fas fa-${action === 'buy' ? 'arrow-down' : 'arrow-up'}"></i>
                        ${actionText} ${symbol}
                    </h2>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="crypto-info" style="background: ${asset?.color}10; border-left: 4px solid ${asset?.color}; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 30px; height: 30px; border-radius: 50%; background: ${asset?.color}30; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-coins" style="color: ${asset?.color};"></i>
                            </div>
                            <div>
                                <div style="font-weight: bold; color: white;">${assetName} (${symbol})</div>
                                <div style="color: var(--text-secondary); font-size: 14px;">Current Price: <span style="color: white; font-weight: bold;">${formatCryptoPrice(price)}</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">
                            Amount (${symbol}):
                        </label>
                        <input type="number" id="cryptoAmount" value="${defaultAmount}" step="${symbol === 'BTC' ? '0.001' : symbol === 'ETH' ? '0.01' : '1'}" 
                            min="0.00000001" style="width: 100%; padding: 12px; background: var(--primary); border: 1px solid var(--border); color: white; border-radius: 4px; font-size: 16px;">
                    </div>
                    
                    <div style="background: var(--primary); padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: var(--text-secondary);">Total Cost:</span>
                            <span id="totalCostCrypto" style="font-weight: bold; color: ${actionColor};">
                                $${(defaultAmount * price).toFixed(2)}
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 14px;">
                            <span style="color: var(--text-secondary);">Available USD:</span>
                            <span style="color: white; font-weight: bold;">$${userPortfolio.balance.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="modal-cancel" style="flex: 1;">Cancel</button>
                        <button onclick="executeCryptoTrade('${symbol}', '${action}', ${price})" 
                            style="flex: 1; background: ${actionColor}; color: #000; border: none; padding: 12px; border-radius: 4px; font-weight: bold; cursor: pointer;">
                            Confirm ${actionText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById('cryptoAmount').addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        const total = amount * price;
        document.getElementById('totalCostCrypto').textContent = `$${total.toFixed(2)}`;
    });
    
    // Close modal events
    document.querySelector('.modal-cancel').addEventListener('click', () => {
        document.querySelector('.modal-overlay').remove();
    });
    
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.querySelector('.modal-overlay').remove();
    });
    
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            document.querySelector('.modal-overlay').remove();
        }
    });
}

function executeCryptoTrade(symbol, action, price) {
    const amountInput = document.getElementById('cryptoAmount');
    const amount = parseFloat(amountInput.value) || 0;
    const totalCost = amount * price;
    const asset = CRYPTO_ASSETS.find(a => a.symbol === symbol);
    const assetName = asset ? asset.name : symbol;
    
    // Remove modal
    document.querySelector('.modal-overlay').remove();
    
    if (action === 'buy') {
        if (userPortfolio.balance >= totalCost) {
            userPortfolio.balance -= totalCost;
            
            // Add to crypto holdings
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
            
            showCryptoNotification(`✅ Bought ${formatCryptoAmount(amount, symbol)} ${symbol} at ${formatCryptoPrice(price)}`, 'success');
            updatePortfolioDisplay();
            
        } else {
            showCryptoNotification(`❌ Insufficient USD. Need $${totalCost.toFixed(2)}, have $${userPortfolio.balance.toFixed(2)}`, 'error');
        }
    } else if (action === 'sell') {
        const existingCrypto = userPortfolio.crypto.find(c => c.symbol === symbol);
        
        if (existingCrypto && existingCrypto.amount >= amount) {
            userPortfolio.balance += totalCost;
            existingCrypto.amount -= amount;
            
            if (existingCrypto.amount === 0) {
                userPortfolio.crypto = userPortfolio.crypto.filter(c => c.symbol !== symbol);
            }
            
            showCryptoNotification(`✅ Sold ${formatCryptoAmount(amount, symbol)} ${symbol} at ${formatCryptoPrice(price)}`, 'success');
            updatePortfolioDisplay();
            
        } else {
            const available = existingCrypto ? existingCrypto.amount : 0;
            showCryptoNotification(`❌ Not enough ${symbol}. Trying to sell ${formatCryptoAmount(amount, symbol)}, have ${formatCryptoAmount(available, symbol)}`, 'error');
        }
    }
}

// ========================
// UI FUNCTIONS
// ========================

function setupCryptoFilters() {
    const filterBtns = document.querySelectorAll('.crypto-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterCryptoByType(filter);
        });
    });
}

function filterCryptoByType(type) {
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach(row => {
        const symbol = row.cells[0].querySelector('.asset-code').textContent;
        const asset = CRYPTO_ASSETS.find(a => a.symbol === symbol);
        
        if (type === 'all' || asset?.type === type) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function setupPortfolioDisplay() {
    updatePortfolioValue();
}

function updatePortfolioDisplay() {
    updatePortfolioValue();
    
    // Update portfolio breakdown
    const portfolioElement = document.querySelector('.portfolio-breakdown');
    if (portfolioElement) {
        let html = '';
        userPortfolio.crypto.forEach(crypto => {
            const currentPrice = getSimulatedCryptoPrice(crypto.symbol);
            const value = crypto.amount * currentPrice;
            const profitLoss = ((currentPrice - crypto.avgPrice) / crypto.avgPrice * 100).toFixed(2);
            
            html += `
                <div class="portfolio-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-weight: bold;">${crypto.symbol}</span>
                            <span style="color: var(--text-secondary); font-size: 14px;"> ${formatCryptoAmount(crypto.amount, crypto.symbol)}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold;">$${value.toFixed(2)}</div>
                            <div style="color: ${profitLoss >= 0 ? '#00ff9d' : '#ff4757'}; font-size: 12px;">
                                ${profitLoss >= 0 ? '+' : ''}${profitLoss}%
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        portfolioElement.innerHTML = html;
    }
}

function updatePortfolioValue() {
    // Calculate total portfolio value
    let totalValue = userPortfolio.balance;
    
    userPortfolio.crypto.forEach(crypto => {
        const currentPrice = getSimulatedCryptoPrice(crypto.symbol);
        totalValue += crypto.amount * currentPrice;
    });
    
    // Update display
    const portfolioElement = document.getElementById('portfolioValue');
    if (portfolioElement) {
        portfolioElement.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

function showCryptoModal(type) {
    const modals = {
        login: {
            title: 'Crypto Trading Login',
            message: 'Access your memecoin portfolio'
        },
        signup: {
            title: 'Start Trading Crypto',
            message: 'Join the memecoin revolution'
        }
    };
    
    const modal = modals[type];
    if (!modal) return;
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${modal.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">${modal.message}</p>
                    <input type="email" placeholder="Email" class="modal-input">
                    ${type === 'signup' ? '<input type="text" placeholder="Username" class="modal-input">' : ''}
                    <input type="password" placeholder="Password" class="modal-input">
                    <button class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                        ${type === 'login' ? 'Log In' : 'Create Account'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add close events
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.querySelector('.modal-overlay').remove();
    });
    
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            document.querySelector('.modal-overlay').remove();
        }
    });
}

function showCryptoNotification(message, type) {
    const color = type === 'success' ? '#00ff9d' : '#ff4757';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        border-left: 4px solid ${color};
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-size: 14px;
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

function showAPIStatus(status, type) {
    const apiStatus = document.getElementById('apiStatus');
    if (!apiStatus) return;
    
    const color = type === 'success' ? '#00ff9d' : '#ffb547';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    apiStatus.innerHTML = `
        <i class="fas ${icon}" style="color:${color};margin-right:8px;"></i>
        <span style="color:${color};">${status}</span> • 
        <span>Crypto Trading Platform</span>
    `;
}

function startLiveUpdates() {
    // Update crypto prices every 15 seconds
    setInterval(async () => {
        console.log('Updating crypto prices...');
        await loadCryptoData();
    }, 15000);
}

// ========================
// HELPER FUNCTIONS
// ========================

function formatCryptoPrice(price) {
    if (price < 0.0001) return `$${price.toFixed(8)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
}

function formatCryptoAmount(amount, symbol) {
    if (symbol === 'BTC') return amount.toFixed(6);
    if (symbol === 'ETH') return amount.toFixed(4);
    if (symbol === 'SOL') return amount.toFixed(2);
    if (symbol === 'DOGE') return amount.toLocaleString(undefined, {maximumFractionDigits: 0});
    if (symbol === 'SHIB') return amount.toLocaleString(undefined, {maximumFractionDigits: 0});
    return amount.toFixed(2);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

// Make functions available globally
window.executeCryptoTrade = executeCryptoTrade;

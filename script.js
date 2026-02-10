// ========================
// OBSIDIAN EDGE - COMMERCIAL VERSION
// Real Trading Platform
// ========================

// API Configuration
const FINNHUB_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual key
const USE_REAL_DATA = false; // Set to true when you have API key

// Trading portfolio (simulation)
let userPortfolio = {
    balance: 100000.00,
    holdings: [
        { symbol: 'CAT', name: 'Caterpillar', shares: 10, avgPrice: 245.80 },
        { symbol: 'DE', name: 'Deere & Co', shares: 5, avgPrice: 187.50 },
        { symbol: 'GE', name: 'General Electric', shares: 15, avgPrice: 89.40 }
    ]
};

// Real equipment company symbols
const EQUIPMENT_STOCKS = [
    { symbol: 'CAT', name: 'Caterpillar Inc.', industry: 'Industrial Equipment' },
    { symbol: 'DE', name: 'Deere & Company', industry: 'Agricultural Equipment' },
    { symbol: 'GE', name: 'General Electric', industry: 'Industrial Conglomerate' },
    { symbol: 'HON', name: 'Honeywell', industry: 'Aerospace Components' },
    { symbol: 'RTX', name: 'Raytheon Technologies', industry: 'Aerospace & Defense' }
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Obsidian Edge Trading Platform - Commercial Version');
    
    // Set up all functionality
    setupNavigation();
    setupTradingButtons();
    setupPortfolioDisplay();
    
    // Load market data
    if (USE_REAL_DATA && FINNHUB_API_KEY !== 'YOUR_API_KEY_HERE') {
        loadRealMarketData();
        showAPIStatus('Live', 'api-live');
    } else {
        loadSimulatedData();
        showAPIStatus('Demo Mode', 'api-demo');
    }
    
    // Start live updates
    startLiveUpdates();
});

// ========================
// CORE FUNCTIONS
// ========================

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Show section based on clicked link
                const section = link.textContent.toLowerCase();
                alert(`Navigating to ${section} section (would load real content)`);
            }
        });
    });
}

function setupTradingButtons() {
    // Login button
    document.querySelectorAll('.btn-login').forEach(btn => {
        if (btn.textContent.includes('Log In')) {
            btn.addEventListener('click', () => {
                showTradingModal('login');
            });
        }
        if (btn.textContent.includes('Request Demo')) {
            btn.addEventListener('click', () => {
                showTradingModal('demo');
            });
        }
    });
    
    // Get Started / Open Account buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            showTradingModal('signup');
        });
    });
    
    // Market tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMarketData(btn.textContent);
        });
    });
}

function setupPortfolioDisplay() {
    // Add portfolio summary to stats section
    const statsDiv = document.querySelector('.stats');
    if (statsDiv) {
        const portfolioStat = document.createElement('div');
        portfolioStat.className = 'stat-item';
        portfolioStat.innerHTML = `
            <div class="stat-value">$${userPortfolio.balance.toLocaleString()}</div>
            <div class="stat-label">Portfolio Value</div>
        `;
        statsDiv.appendChild(portfolioStat);
    }
}

// ========================
// MARKET DATA FUNCTIONS
// ========================

async function loadRealMarketData() {
    console.log('Loading real market data...');
    
    try {
        // Try to fetch data for each equipment stock
        for (const stock of EQUIPMENT_STOCKS) {
            const response = await fetch(
                `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${FINNHUB_API_KEY}`
            );
            
            if (response.ok) {
                const data = await response.json();
                updateStockRow(stock.symbol, data);
            } else {
                console.log(`Could not fetch ${stock.symbol}, using simulated data`);
                updateStockWithSimulatedData(stock.symbol);
            }
        }
    } catch (error) {
        console.log('API error, using simulated data:', error);
        loadSimulatedData();
    }
}

function loadSimulatedData() {
    console.log('Using simulated market data');
    
    // Update each row in the table with realistic simulated data
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach((row, index) => {
        if (index < EQUIPMENT_STOCKS.length) {
            const stock = EQUIPMENT_STOCKS[index];
            const price = getRandomPrice(50, 350);
            const change = (Math.random() * 4 - 2).toFixed(2); // -2% to +2%
            const volume = Math.floor(Math.random() * 50000000) + 10000000;
            const marketCap = Math.floor(price * (Math.random() * 10000000) + 1000000);
            
            // Update row cells
            row.cells[0].querySelector('.asset-name').textContent = stock.name;
            row.cells[0].querySelector('.asset-code').textContent = stock.symbol;
            row.cells[1].textContent = `$${price.toFixed(2)}`;
            row.cells[2].textContent = `${parseFloat(change) > 0 ? '+' : ''}${change}%`;
            row.cells[2].className = parseFloat(change) > 0 ? 'price-up' : 'price-down';
            row.cells[3].textContent = `$${(volume / 1000000).toFixed(1)}M`;
            row.cells[4].textContent = `$${(marketCap / 1000000000).toFixed(1)}B`;
            
            // Add trading buttons
            if (!row.querySelector('.trade-buttons')) {
                const buttonCell = row.insertCell(5);
                buttonCell.innerHTML = `
                    <div class="trade-buttons">
                        <button class="trade-btn trade-buy" data-symbol="${stock.symbol}" data-price="${price}">BUY</button>
                        <button class="trade-btn trade-sell" data-symbol="${stock.symbol}" data-price="${price}">SELL</button>
                    </div>
                `;
                
                // Add click events to new buttons
                buttonCell.querySelector('.trade-buy').addEventListener('click', (e) => {
                    const symbol = e.target.getAttribute('data-symbol');
                    const price = parseFloat(e.target.getAttribute('data-price'));
                    executeTrade(symbol, 'buy', 10, price);
                });
                
                buttonCell.querySelector('.trade-sell').addEventListener('click', (e) => {
                    const symbol = e.target.getAttribute('data-symbol');
                    const price = parseFloat(e.target.getAttribute('data-price'));
                    executeTrade(symbol, 'sell', 10, price);
                });
            }
        }
    });
}

function updateStockRow(symbol, realData) {
    // Find the row for this symbol and update with real data
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach(row => {
        const rowSymbol = row.cells[0].querySelector('.asset-code').textContent;
        if (rowSymbol === symbol) {
            const changePercent = ((realData.c - realData.pc) / realData.pc * 100).toFixed(2);
            const volume = realData.v || Math.floor(Math.random() * 50000000) + 10000000;
            
            row.cells[1].textContent = `$${realData.c.toFixed(2)}`;
            row.cells[2].textContent = `${parseFloat(changePercent) > 0 ? '+' : ''}${changePercent}%`;
            row.cells[2].className = parseFloat(changePercent) > 0 ? 'price-up' : 'price-down';
            row.cells[3].textContent = `$${(volume / 1000000).toFixed(1)}M`;
            
            // Update button data prices
            const buyBtn = row.querySelector('.trade-buy');
            const sellBtn = row.querySelector('.trade-sell');
            if (buyBtn && sellBtn) {
                buyBtn.setAttribute('data-price', realData.c);
                sellBtn.setAttribute('data-price', realData.c);
            }
        }
    });
}

function filterMarketData(filter) {
    console.log(`Filtering by: ${filter}`);
    // In real version, this would filter the table
    alert(`Now showing ${filter} market data`);
}

// ========================
// TRADING FUNCTIONS
// ========================

function executeTrade(symbol, action, quantity, price) {
    const totalCost = quantity * price;
    const stockName = EQUIPMENT_STOCKS.find(s => s.symbol === symbol)?.name || symbol;
    
    if (action === 'buy') {
        if (userPortfolio.balance >= totalCost) {
            userPortfolio.balance -= totalCost;
            
            // Add to holdings
            const existingHolding = userPortfolio.holdings.find(h => h.symbol === symbol);
            if (existingHolding) {
                existingHolding.shares += quantity;
                existingHolding.avgPrice = (existingHolding.avgPrice + price) / 2;
            } else {
                userPortfolio.holdings.push({
                    symbol: symbol,
                    name: stockName,
                    shares: quantity,
                    avgPrice: price
                });
            }
            
            showTradeNotification(`✅ Bought ${quantity} shares of ${symbol} at $${price.toFixed(2)}`);
            updatePortfolioDisplay();
        } else {
            showTradeNotification(`❌ Insufficient funds to buy ${quantity} shares of ${symbol}`);
        }
    } else if (action === 'sell') {
        const existingHolding = userPortfolio.holdings.find(h => h.symbol === symbol);
        
        if (existingHolding && existingHolding.shares >= quantity) {
            userPortfolio.balance += totalCost;
            existingHolding.shares -= quantity;
            
            if (existingHolding.shares === 0) {
                userPortfolio.holdings = userPortfolio.holdings.filter(h => h.symbol !== symbol);
            }
            
            showTradeNotification(`✅ Sold ${quantity} shares of ${symbol} at $${price.toFixed(2)}`);
            updatePortfolioDisplay();
        } else {
            showTradeNotification(`❌ Not enough shares to sell ${quantity} of ${symbol}`);
        }
    }
    
    // Update portfolio display
    updatePortfolioDisplay();
}

function updatePortfolioDisplay() {
    // Update portfolio value in stats
    const portfolioValueElements = document.querySelectorAll('.stat-value');
    if (portfolioValueElements.length > 0) {
        portfolioValueElements[portfolioValueElements.length - 1].textContent = 
            `$${userPortfolio.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

// ========================
// UI HELPER FUNCTIONS
// ========================

function showTradingModal(type) {
    let title, message;
    
    switch(type) {
        case 'login':
            title = 'Trade Login';
            message = 'Enter your credentials to start real trading';
            break;
        case 'signup':
            title = 'Open Trading Account';
            message = 'Fill in details to create your trading account';
            break;
        case 'demo':
            title = 'Request Platform Demo';
            message = 'Our team will contact you for a personalized demo';
            break;
    }
    
    const modalHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:1000;">
            <div style="background:var(--secondary);padding:30px;border-radius:10px;max-width:400px;width:90%;border:1px solid var(--border);">
                <h2 style="color:var(--accent);margin-bottom:15px;">${title}</h2>
                <p style="margin-bottom:20px;color:var(--text-secondary);">${message}</p>
                
                ${type === 'login' ? `
                    <input type="email" placeholder="Email" style="width:100%;padding:10px;margin-bottom:10px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;">
                    <input type="password" placeholder="Password" style="width:100%;padding:10px;margin-bottom:20px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;">
                ` : type === 'signup' ? `
                    <input type="text" placeholder="Full Name" style="width:100%;padding:10px;margin-bottom:10px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;">
                    <input type="email" placeholder="Email" style="width:100%;padding:10px;margin-bottom:10px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;">
                    <input type="tel" placeholder="Phone" style="width:100%;padding:10px;margin-bottom:20px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;">
                ` : `
                    <input type="text" placeholder="Company Name" style="width:100%;padding:10px;margin-bottom:10px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;">
                    <input type="email" placeholder="Business Email" style="width:100%;padding:10px;margin-bottom:10px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;">
                    <textarea placeholder="What are your trading needs?" style="width:100%;padding:10px;margin-bottom:20px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;height:100px;"></textarea>
                `}
                
                <div style="display:flex;gap:10px;">
                    <button onclick="this.closest('div[style*=\"position:fixed\"]').remove()" style="padding:10px 20px;background:transparent;border:1px solid var(--border);color:var(--text-primary);border-radius:4px;cursor:pointer;flex:1;">Cancel</button>
                    <button onclick="submitTradingForm('${type}')" style="padding:10px 20px;background:var(--accent);border:none;color:var(--primary);border-radius:4px;cursor:pointer;font-weight:bold;flex:1;">Submit</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function submitTradingForm(type) {
    alert(`✅ ${type === 'login' ? 'Login submitted!' : type === 'signup' ? 'Account created!' : 'Demo requested!'}\n\nIn commercial version, this would connect to backend.`);
    document.querySelector('div[style*="position:fixed"]').remove();
}

function showTradeNotification(message) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        border-left: 4px solid var(--accent);
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add animation styles if not present
    if (!document.querySelector('#trade-animations')) {
        const style = document.createElement('style');
        style.id = 'trade-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showAPIStatus(status, className) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `api-status ${className}`;
    statusDiv.innerHTML = `
        <i class="fas fa-circle" style="font-size:8px;margin-right:8px;"></i>
        ${status} • ${USE_REAL_DATA ? 'Real Data' : 'Demo Data'}
    `;
    document.body.appendChild(statusDiv);
}

function startLiveUpdates() {
    // Update prices every 10 seconds
    setInterval(() => {
        if (USE_REAL_DATA && FINNHUB_API_KEY !== 'YOUR_API_KEY_HERE') {
            // In real version, this would fetch updated prices
            console.log('Fetching updated market data...');
        } else {
            // Simulate price changes
            simulatePriceChanges();
        }
    }, 10000);
}

function simulatePriceChanges() {
    const rows = document.querySelectorAll('.market-table tbody tr');
    rows.forEach(row => {
        if (Math.random() > 0.7) { // 30% chance to change
            const priceCell = row.cells[1];
            const changeCell = row.cells[2];
            
            let currentPrice = parseFloat(priceCell.textContent.replace('$', ''));
            const change = (Math.random() * 2 - 1) * 0.5; // -0.5% to +0.5%
            
            currentPrice = currentPrice * (1 + change / 100);
            
            priceCell.textContent = `$${currentPrice.toFixed(2)}`;
            changeCell.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
            changeCell.className = change > 0 ? 'price-up' : 'price-down';
            
            // Update button data prices
            const buyBtn = row.querySelector('.trade-buy');
            const sellBtn = row.querySelector('.trade-sell');
            if (buyBtn && sellBtn) {
                buyBtn.setAttribute('data-price', currentPrice);
                sellBtn.setAttribute('data-price', currentPrice);
            }
        }
    });
}

function getRandomPrice(min, max) {
    return Math.random() * (max - min) + min;
}

// Make functions available globally for HTML onclick
window.submitTradingForm = submitTradingForm;

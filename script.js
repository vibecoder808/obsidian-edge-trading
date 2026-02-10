// ========================
// OBSIDIAN EDGE - COMMERCIAL VERSION
// Real Trading Platform with ACTUAL API
// ========================

// API Configuration - USING YOUR REAL KEY
const FINNHUB_API_KEY = 'd65i7npr01qlmj2v9k10d65i7npr01qlmj2v9k1g';
const USE_REAL_DATA = true; // Now using REAL data!

// Trading portfolio (simulation)
let userPortfolio = {
    balance: 100000.00,
    holdings: [
        { symbol: 'CAT', name: 'Caterpillar', shares: 10, avgPrice: 245.80 },
        { symbol: 'DE', name: 'Deere & Co', shares: 5, avgPrice: 387.50 },
        { symbol: 'GE', name: 'General Electric', shares: 15, avgPrice: 154.90 }
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

// Store current market data
let currentMarketData = {};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Obsidian Edge Trading Platform - COMMERCIAL VERSION');
    console.log('Using REAL Finnhub API data');
    
    // Set up all functionality
    setupNavigation();
    setupTradingButtons();
    setupPortfolioDisplay();
    
    // Load market data - NOW WITH REAL API!
    loadMarketData();
    
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
            if (btn.id === 'openAccountBtn' || btn.textContent.includes('Open Free Account')) {
                showTradingModal('signup');
            } else if (btn.classList.contains('demo-action')) {
                const action = btn.getAttribute('data-action');
                showTradingModal(action);
            } else {
                showTradingModal('signup');
            }
        });
    });
    
    // Market tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const marketType = btn.getAttribute('data-market');
            highlightMarketRows(marketType);
        });
    });
    
    // Buy/Sell buttons in table
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('trade-buy') || e.target.classList.contains('trade-sell')) {
            const symbol = e.target.getAttribute('data-symbol');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const action = e.target.classList.contains('trade-buy') ? 'buy' : 'sell';
            
            // Show trade confirmation
            showTradeModal(symbol, action, price);
        }
    });
}

function setupPortfolioDisplay() {
    updatePortfolioValue();
}

// ========================
// REAL MARKET DATA FUNCTIONS
// ========================

async function loadMarketData() {
    console.log('Loading REAL market data from Finnhub API...');
    
    try {
        // Fetch data for all equipment stocks
        const promises = EQUIPMENT_STOCKS.map(stock => 
            fetchStockData(stock.symbol)
        );
        
        const results = await Promise.allSettled(promises);
        
        // Process results
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const stock = EQUIPMENT_STOCKS[index];
                const data = result.value;
                currentMarketData[stock.symbol] = data;
                updateStockRow(stock.symbol, data);
            } else {
                console.log(`Failed to fetch ${EQUIPMENT_STOCKS[index].symbol}:`, result.reason);
                // Use simulated data as fallback
                updateStockWithSimulatedData(EQUIPMENT_STOCKS[index].symbol);
            }
        });
        
        showAPIStatus('Live Data', 'success');
        
    } catch (error) {
        console.log('API error, using simulated data:', error);
        loadSimulatedData();
        showAPIStatus('Demo Mode', 'warning');
    }
}

async function fetchStockData(symbol) {
    try {
        const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add symbol and timestamp to data
        return {
            symbol: symbol,
            price: data.c,
            change: data.d,
            changePercent: data.dp,
            high: data.h,
            low: data.l,
            open: data.o,
            previousClose: data.pc,
            timestamp: data.t,
            volume: data.v
        };
        
    } catch (error) {
        console.log(`Error fetching ${symbol}:`, error);
        throw error;
    }
}

function updateStockRow(symbol, realData) {
    // Find the row for this symbol
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach(row => {
        const rowSymbol = row.cells[0].querySelector('.asset-code').textContent;
        if (rowSymbol === symbol) {
            // Format numbers
            const price = realData.price.toFixed(2);
            const changePercent = realData.changePercent.toFixed(2);
            const change = realData.change.toFixed(2);
            const volume = realData.volume ? `$${(realData.volume / 1000000).toFixed(1)}M` : 'N/A';
            
            // Calculate market cap (rough estimate)
            const sharesOutstanding = getEstimatedShares(symbol);
            const marketCap = (realData.price * sharesOutstanding / 1000000000).toFixed(1);
            
            // Update row cells
            row.cells[1].textContent = `$${price}`;
            row.cells[2].textContent = `${parseFloat(changePercent) > 0 ? '+' : ''}${changePercent}%`;
            row.cells[2].className = parseFloat(changePercent) > 0 ? 'price-up' : 'price-down';
            row.cells[3].textContent = volume;
            row.cells[4].textContent = `$${marketCap}B`;
            
            // Update button data prices
            const buyBtn = row.querySelector('.trade-buy');
            const sellBtn = row.querySelector('.trade-sell');
            if (buyBtn && sellBtn) {
                buyBtn.setAttribute('data-price', realData.price);
                sellBtn.setAttribute('data-price', realData.price);
            }
            
            // Add tooltip with more data
            row.title = `Open: $${realData.open.toFixed(2)} | High: $${realData.high.toFixed(2)} | Low: $${realData.low.toFixed(2)}`;
        }
    });
}

function getEstimatedShares(symbol) {
    // Estimated shares outstanding for market cap calculation
    const shares = {
        'CAT': 500000000,
        'DE': 300000000,
        'GE': 1100000000,
        'HON': 650000000,
        'RTX': 1400000000
    };
    return shares[symbol] || 500000000;
}

function updateStockWithSimulatedData(symbol) {
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach(row => {
        const rowSymbol = row.cells[0].querySelector('.asset-code').textContent;
        if (rowSymbol === symbol) {
            // Generate realistic simulated data
            const basePrice = getBasePrice(symbol);
            const change = (Math.random() * 4 - 2).toFixed(2);
            const price = (basePrice * (1 + change/100)).toFixed(2);
            const volume = Math.floor(Math.random() * 50000000) + 10000000;
            const marketCap = (parseFloat(price) * getEstimatedShares(symbol) / 1000000000).toFixed(1);
            
            row.cells[1].textContent = `$${price}`;
            row.cells[2].textContent = `${parseFloat(change) > 0 ? '+' : ''}${change}%`;
            row.cells[2].className = parseFloat(change) > 0 ? 'price-up' : 'price-down';
            row.cells[3].textContent = `$${(volume / 1000000).toFixed(1)}M`;
            row.cells[4].textContent = `$${marketCap}B`;
        }
    });
}

function getBasePrice(symbol) {
    const prices = {
        'CAT': 245.80,
        'DE': 387.50,
        'GE': 154.90,
        'HON': 209.40,
        'RTX': 97.80
    };
    return prices[symbol] || 100;
}

function loadSimulatedData() {
    EQUIPMENT_STOCKS.forEach(stock => {
        updateStockWithSimulatedData(stock.symbol);
    });
}

function highlightMarketRows(marketType) {
    const rows = document.querySelectorAll('.market-table tbody tr');
    
    rows.forEach(row => {
        row.style.opacity = '0.6';
        row.style.transition = 'opacity 0.3s';
    });
    
    // Highlight matching rows (simplified - in real version would filter)
    setTimeout(() => {
        rows.forEach(row => {
            row.style.opacity = '1';
        });
    }, 300);
}

// ========================
// TRADING FUNCTIONS
// ========================

function showTradeModal(symbol, action, price) {
    const stockName = EQUIPMENT_STOCKS.find(s => s.symbol === symbol)?.name || symbol;
    const actionColor = action === 'buy' ? '#00ff9d' : '#ff4757';
    const actionText = action === 'buy' ? 'Buy' : 'Sell';
    
    const modalHTML = `
        <div class="modal-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:2000;">
            <div style="background:var(--secondary);padding:30px;border-radius:10px;max-width:400px;width:90%;border:1px solid var(--border);">
                <h2 style="color:${actionColor};margin-bottom:15px;display:flex;align-items:center;gap:10px;">
                    <i class="fas fa-${action === 'buy' ? 'shopping-cart' : 'money-bill-wave'}"></i>
                    ${actionText} ${symbol}
                </h2>
                
                <div style="background:var(--primary);padding:15px;border-radius:5px;margin-bottom:20px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span style="color:var(--text-secondary);">Current Price:</span>
                        <span style="font-weight:bold;color:var(--text-primary);">$${price.toFixed(2)}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span style="color:var(--text-secondary);">Available Balance:</span>
                        <span style="font-weight:bold;color:var(--text-primary);">$${userPortfolio.balance.toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block;margin-bottom:8px;color:var(--text-secondary);">Quantity:</label>
                    <input type="number" id="tradeQuantity" value="10" min="1" max="1000" 
                        style="width:100%;padding:10px;background:var(--primary);border:1px solid var(--border);color:white;border-radius:4px;font-size:16px;">
                </div>
                
                <div id="tradeSummary" style="background:var(--primary);padding:15px;border-radius:5px;margin-bottom:20px;border:1px solid var(--border);">
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:var(--text-secondary);">Total Cost:</span>
                        <span id="totalCost" style="font-weight:bold;color:${actionColor};">$${(10 * price).toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="display:flex;gap:10px;">
                    <button onclick="this.closest('.modal-overlay').remove()" 
                        style="padding:12px 20px;background:transparent;border:1px solid var(--border);color:var(--text-primary);border-radius:4px;cursor:pointer;flex:1;">
                        Cancel
                    </button>
                    <button onclick="executeTrade('${symbol}', '${action}', ${price})" 
                        style="padding:12px 20px;background:${actionColor};border:none;color:#000;border-radius:4px;cursor:pointer;font-weight:bold;flex:1;">
                        Confirm ${actionText}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Update total cost when quantity changes
    document.getElementById('tradeQuantity').addEventListener('input', function() {
        const quantity = parseInt(this.value) || 0;
        const total = quantity * price;
        document.getElementById('totalCost').textContent = `$${total.toFixed(2)}`;
    });
}

function executeTrade(symbol, action, price) {
    const quantityInput = document.getElementById('tradeQuantity');
    const quantity = parseInt(quantityInput.value) || 10;
    const totalCost = quantity * price;
    const stockName = EQUIPMENT_STOCKS.find(s => s.symbol === symbol)?.name || symbol;
    
    // Remove modal
    document.querySelector('.modal-overlay').remove();
    
    if (action === 'buy') {
        if (userPortfolio.balance >= totalCost) {
            userPortfolio.balance -= totalCost;
            
            // Add to holdings
            const existingHolding = userPortfolio.holdings.find(h => h.symbol === symbol);
            if (existingHolding) {
                existingHolding.shares += quantity;
                existingHolding.avgPrice = ((existingHolding.avgPrice * existingHolding.shares) + totalCost) / (existingHolding.shares + quantity);
            } else {
                userPortfolio.holdings.push({
                    symbol: symbol,
                    name: stockName,
                    shares: quantity,
                    avgPrice: price
                });
            }
            
            showTradeNotification(`✅ Successfully bought ${quantity} shares of ${symbol} at $${price.toFixed(2)}/share`);
            updatePortfolioValue();
        } else {
            showTradeNotification(`❌ Insufficient funds. Need $${totalCost.toFixed(2)}, but only have $${userPortfolio.balance.toFixed(2)}`);
        }
    } else if (action === 'sell') {
        const existingHolding = userPortfolio.holdings.find(h => h.symbol === symbol);
        
        if (existingHolding && existingHolding.shares >= quantity) {
            userPortfolio.balance += totalCost;
            existingHolding.shares -= quantity;
            
            if (existingHolding.shares === 0) {
                userPortfolio.holdings = userPortfolio.holdings.filter(h => h.symbol !== symbol);
            }
            
            showTradeNotification(`✅ Successfully sold ${quantity} shares of ${symbol} at $${price.toFixed(2)}/share`);
            updatePortfolioValue();
        } else {
            const available = existingHolding ? existingHolding.shares : 0;
            showTradeNotification(`❌ Not enough shares. Trying to sell ${quantity}, but only have ${available} shares of ${symbol}`);
        }
    }
}

function updatePortfolioValue() {
    // Update portfolio value display
    const portfolioElement = document.getElementById('portfolioValue');
    if (portfolioElement) {
        portfolioElement.textContent = `$${userPortfolio.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

// ========================
// UI HELPER FUNCTIONS
// ========================

function showTradingModal(type) {
    let title, message, formHTML;
    
    switch(type) {
        case 'login':
            title = 'Trade Login';
            message = 'Enter your credentials to access real trading';
            formHTML = `
                <input type="email" placeholder="Email" class="modal-input">
                <input type="password" placeholder="Password" class="modal-input">
            `;
            break;
        case 'signup':
            title = 'Open Trading Account';
            message = 'Start your trading journey today';
            formHTML = `
                <input type="text" placeholder="Full Name" class="modal-input">
                <input type="email" placeholder="Email" class="modal-input">
                <input type="tel" placeholder="Phone" class="modal-input">
                <select class="modal-input">
                    <option value="">Account Type</option>
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                    <option value="institutional">Institutional</option>
                </select>
            `;
            break;
        case 'demo':
            title = 'Platform Demo';
            message = 'Schedule a personalized demo with our experts';
            formHTML = `
                <input type="text" placeholder="Company Name" class="modal-input">
                <input type="email" placeholder="Business Email" class="modal-input">
                <input type="tel" placeholder="Phone Number" class="modal-input">
                <select class="modal-input">
                    <option value="">Preferred Date</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="this-week">This Week</option>
                    <option value="next-week">Next Week</option>
                </select>
            `;
            break;
        case 'support':
            title = 'Contact Support';
            message = 'Our team is available 24/7 to help you';
            formHTML = `
                <input type="text" placeholder="Subject" class="modal-input">
                <input type="email" placeholder="Your Email" class="modal-input">
                <textarea placeholder="How can we help you?" class="modal-input" style="height:100px;"></textarea>
            `;
            break;
    }
    
    const modalHTML = `
        <div class="modal-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:2000;">
            <div style="background:var(--secondary);padding:30px;border-radius:10px;max-width:450px;width:90%;border:1px solid var(--border);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                    <h2 style="color:var(--accent);margin:0;">${title}</h2>
                    <button onclick="this.closest('.modal-overlay').remove()" 
                        style="background:none;border:none;color:var(--text-secondary);font-size:24px;cursor:pointer;">&times;</button>
                </div>
                
                <p style="color:var(--text-secondary);margin-bottom:25px;">${message}</p>
                
                <div style="margin-bottom:25px;">
                    ${formHTML}
                </div>
                
                <div style="display:flex;gap:10px;">
                    <button onclick="this.closest('.modal-overlay').remove()" 
                        style="padding:12px 20px;background:transparent;border:1px solid var(--border);color:var(--text-primary);border-radius:4px;cursor:pointer;flex:1;">
                        Cancel
                    </button>
                    <button onclick="submitForm('${type}')" 
                        style="padding:12px 20px;background:var(--accent);border:none;color:var(--primary);border-radius:4px;cursor:pointer;font-weight:bold;flex:1;">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function submitForm(type) {
    const action = type === 'login' ? 'login' : 
                   type === 'signup' ? 'account creation' : 
                   type === 'demo' ? 'demo request' : 'support request';
    
    showTradeNotification(`✅ ${action.charAt(0).toUpperCase() + action.slice(1)} submitted successfully!`);
    document.querySelector('.modal-overlay').remove();
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
        max-width: 350px;
        font-size: 14px;
    `;
    
    notification.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <i class="fas fa-check-circle" style="color:var(--accent);"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
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
        <span>${USE_REAL_DATA ? 'Live Market Data' : 'Simulated Data'}</span>
    `;
}

function startLiveUpdates() {
    // Update prices every 30 seconds
    setInterval(async () => {
        if (USE_REAL_DATA) {
            console.log('Fetching updated market data...');
            await loadMarketData();
        } else {
            // Simulate price changes
            simulatePriceChanges();
        }
    }, 30000); // 30 seconds
    
    // Also update time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000); // Update every minute
}

function simulatePriceChanges() {
    EQUIPMENT_STOCKS.forEach(stock => {
        if (Math.random() > 0.5) { // 50% chance to change
            updateStockWithSimulatedData(stock.symbol);
        }
    });
}

function updateTimeDisplay() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const statusElement = document.getElementById('apiStatus');
    if (statusElement) {
        const currentHTML = statusElement.innerHTML;
        if (!currentHTML.includes('Last update')) {
            statusElement.innerHTML += ` • Last update: ${timeString}`;
        }
    }
}

// Make functions available globally
window.executeTrade = executeTrade;
window.submitForm = submitForm;

// Tab switching functionality
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // In a real implementation, this would update the table data
        // For this demo, we'll just show an alert
        alert(`Switched to ${btn.textContent} market view`);
    });
});

// Button functionality
const primaryBtns = document.querySelectorAll('.btn-primary');
primaryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.textContent.includes('Get Started') || btn.textContent.includes('Open Free Account')) {
            alert('Welcome to Obsidian Edge! Account registration would open here.\n\nThis is a class project demonstration.');
        }
    });
});

// Login button functionality
const loginBtns = document.querySelectorAll('.btn-login');
loginBtns.forEach(btn => {
    if (btn.textContent.includes('Log In')) {
        btn.addEventListener('click', () => {
            alert('Login modal would appear here in a real implementation.\n\nFor demo: username: demo@obsidianedge.com | password: demo123');
        });
    }
    
    if (btn.textContent.includes('Request Demo')) {
        btn.addEventListener('click', () => {
            alert('Thank you for your interest! A demo request form would open here.');
        });
    }
});

// Simulate live price updates
function simulateLivePrices() {
    const priceCells = document.querySelectorAll('.market-table tbody tr td:nth-child(3)');
    priceCells.forEach(cell => {
        // Only update sometimes for realism (30% chance)
        if (Math.random() > 0.7) {
            const isUp = cell.classList.contains('price-up');
            const change = (Math.random() * 2).toFixed(2);
            
            if (isUp) {
                cell.textContent = `-${change}%`;
                cell.classList.remove('price-up');
                cell.classList.add('price-down');
            } else {
                cell.textContent = `+${change}%`;
                cell.classList.remove('price-down');
                cell.classList.add('price-up');
            }
        }
    });
}

// Update prices every 5 seconds
setInterval(simulateLivePrices, 5000);

// Navigation active state
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

// Add hover effect to feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-5px)';
    });
});

// Initialize with a console message
console.log('Obsidian Edge Trading Platform loaded successfully!');
console.log('This is a class project for educational purposes.');

// DriveEasy Car Rentals - JavaScript Logic
// script.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all page functionality
    initNavigation();
    initForms();
    initBookingLogic();
    initContactForm();
    initTestimonials();
    initPriceCalculator();
    
    // Show current page in navigation
    highlightCurrentPage();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Form validation and handling
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                handleFormSubmission(this);
            }
        });
    });
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '2px';
    
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    field.style.borderColor = 'red';
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// Handle form submissions
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Handle different form types
        if (form.querySelector('#pickup-location')) {
            handleBookingSubmission(data);
        } else if (form.querySelector('#message')) {
            handleContactSubmission(data);
        }
        
        // Reset form
        form.reset();
    }, 2000);
}

// Booking form logic
function initBookingLogic() {
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    
    if (pickupDate && returnDate) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        pickupDate.min = today;
        returnDate.min = today;
        
        // Update return date when pickup date changes
        pickupDate.addEventListener('change', function() {
            const pickupValue = new Date(this.value);
            const nextDay = new Date(pickupValue);
            nextDay.setDate(pickupValue.getDate() + 1);
            
            returnDate.min = nextDay.toISOString().split('T')[0];
            
            // If return date is before new minimum, update it
            if (returnDate.value && new Date(returnDate.value) <= pickupValue) {
                returnDate.value = nextDay.toISOString().split('T')[0];
            }
            
            calculatePrice();
        });
        
        returnDate.addEventListener('change', calculatePrice);
        
        const carType = document.getElementById('car-type');
        if (carType) {
            carType.addEventListener('change', calculatePrice);
        }
    }
}

// Calculate rental price
function calculatePrice() {
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    const carType = document.getElementById('car-type');
    
    if (pickupDate && returnDate && carType && pickupDate.value && returnDate.value) {
        const pickup = new Date(pickupDate.value);
        const returnD = new Date(returnDate.value);
        const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
        
        const prices = {
            'economy': 25,
            'compact': 35,
            'midsize': 45,
            'luxury': 85,
            'suv': 55
        };
        
        const dailyRate = prices[carType.value] || 25;
        const totalPrice = days * dailyRate;
        
        // Display price if container exists
        let priceDisplay = document.getElementById('price-display');
        if (!priceDisplay) {
            priceDisplay = document.createElement('div');
            priceDisplay.id = 'price-display';
            priceDisplay.style.marginTop = '10px';
            priceDisplay.style.padding = '10px';
            priceDisplay.style.backgroundColor = '#f0f8ff';
            priceDisplay.style.border = '1px solid #ccc';
            priceDisplay.style.borderRadius = '5px';
            carType.parentNode.appendChild(priceDisplay);
        }
        
        if (days > 0) {
            priceDisplay.innerHTML = `
                <strong>Rental Summary:</strong><br>
                Duration: ${days} day${days > 1 ? 's' : ''}<br>
                Daily Rate: $${dailyRate}<br>
                <strong>Total: $${totalPrice}</strong>
            `;
        } else {
            priceDisplay.innerHTML = '<em>Please select valid dates</em>';
        }
    }
}

// Handle booking submission
function handleBookingSubmission(data) {
    const bookingId = 'DE' + Date.now().toString().slice(-6);
    
    alert(`Booking Request Submitted Successfully!\n\nBooking Reference: ${bookingId}\n\nWe will contact you within 24 hours to confirm your reservation.\n\nThank you for choosing DriveEasy!`);
    
    // Store booking in localStorage for demo purposes
    const bookings = JSON.parse(localStorage.getItem('driveEasyBookings') || '[]');
    bookings.push({
        id: bookingId,
        ...data,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    localStorage.setItem('driveEasyBookings', JSON.stringify(bookings));
}

// Contact form logic
function initContactForm() {
    const subjectSelect = document.getElementById('subject');
    const messageTextarea = document.getElementById('message');
    
    if (subjectSelect && messageTextarea) {
        subjectSelect.addEventListener('change', function() {
            const templates = {
                'reservation': 'I would like to make a new reservation for...',
                'modify': 'I need to modify my existing reservation. My booking reference is...',
                'cancel': 'I need to cancel my reservation. My booking reference is...',
                'complaint': 'I would like to report an issue regarding...',
                'compliment': 'I would like to compliment your service...',
                'general': 'I have a question about...'
            };
            
            if (templates[this.value] && !messageTextarea.value) {
                messageTextarea.value = templates[this.value];
            }
        });
    }
}

// Handle contact form submission
function handleContactSubmission(data) {
    const ticketId = 'TK' + Date.now().toString().slice(-6);
    
    alert(`Message Sent Successfully!\n\nTicket ID: ${ticketId}\n\nWe will respond to your inquiry within 24 hours.\n\nThank you for contacting DriveEasy!`);
    
    // Store contact in localStorage for demo purposes
    const contacts = JSON.parse(localStorage.getItem('driveEasyContacts') || '[]');
    contacts.push({
        ticketId: ticketId,
        ...data,
        timestamp: new Date().toISOString(),
        status: 'open'
    });
    localStorage.setItem('driveEasyContacts', JSON.stringify(contacts));
}

// Testimonials rotation (for home page)
function initTestimonials() {
    const testimonials = document.querySelectorAll('blockquote');
    
    if (testimonials.length > 1) {
        let currentIndex = 0;
        
        // Hide all testimonials except first
        testimonials.forEach((testimonial, index) => {
            if (index > 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Rotate testimonials every 5 seconds
        setInterval(() => {
            testimonials[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonials[currentIndex].style.display = 'block';
        }, 5000);
    }
}

// Price calculator for services page
function initPriceCalculator() {
    // Add price calculator to services page if it doesn't exist
    const servicesPage = document.querySelector('main');
    
    if (servicesPage && window.location.pathname.includes('services')) {
        createPriceCalculator();
    }
}

// Create interactive price calculator
function createPriceCalculator() {
    const calculatorHTML = `
        <section id="price-calculator" style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h2>Quick Price Calculator</h2>
            <div style="display: grid; gap: 10px; max-width: 400px;">
                <div>
                    <label for="calc-car-type">Vehicle Type:</label>
                    <select id="calc-car-type">
                        <option value="25">Economy - $25/day</option>
                        <option value="35">Compact - $35/day</option>
                        <option value="45">Midsize - $45/day</option>
                        <option value="85">Luxury - $85/day</option>
                        <option value="55">SUV - $55/day</option>
                    </select>
                </div>
                <div>
                    <label for="calc-days">Number of Days:</label>
                    <input type="number" id="calc-days" min="1" max="30" value="1">
                </div>
                <div>
                    <label>
                        <input type="checkbox" id="calc-insurance"> Add Insurance (+$15/day)
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" id="calc-gps"> Add GPS (+$10/day)
                    </label>
                </div>
                <div id="calc-result" style="font-size: 18px; font-weight: bold; color: #667eea;">
                    Total: $25
                </div>
            </div>
        </section>
    `;
    
    // Insert calculator after the first section
    const firstSection = document.querySelector('main section');
    if (firstSection) {
        firstSection.insertAdjacentHTML('afterend', calculatorHTML);
        
        // Add event listeners
        const carType = document.getElementById('calc-car-type');
        const days = document.getElementById('calc-days');
        const insurance = document.getElementById('calc-insurance');
        const gps = document.getElementById('calc-gps');
        const result = document.getElementById('calc-result');
        
        function updateCalculation() {
            const carPrice = parseInt(carType.value);
            const numDays = parseInt(days.value) || 1;
            let total = carPrice * numDays;
            
            if (insurance.checked) total += 15 * numDays;
            if (gps.checked) total += 10 * numDays;
            
            result.textContent = `Total: $${total} (${numDays} day${numDays > 1 ? 's' : ''})`;
        }
        
        carType.addEventListener('change', updateCalculation);
        days.addEventListener('input', updateCalculation);
        insurance.addEventListener('change', updateCalculation);
        gps.addEventListener('change', updateCalculation);
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transition: opacity 0.3s;
    `;
    
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4caf50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800';
            break;
        default:
            notification.style.backgroundColor = '#2196f3';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Emergency contact functionality
function callEmergency() {
    if (confirm('This will attempt to call our 24/7 emergency hotline. Continue?')) {
        window.location.href = 'tel:+15559911HELP';
    }
}

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add loading states for external links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && !e.target.getAttribute('href').startsWith('#') && e.target.getAttribute('href') !== '') {
        const originalText = e.target.textContent;
        e.target.textContent = 'Loading...';
        setTimeout(() => {
            e.target.textContent = originalText;
        }, 1000);
    }
});

// Console welcome message
console.log('%c🚗 Welcome to DriveEasy Car Rentals! 🚗', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('JavaScript loaded successfully. All interactive features are now available.');

// Export functions for global access if needed
window.DriveEasy = {
    showNotification,
    callEmergency,
    calculatePrice
};
/* ==========================================================================
   PadelPro Arena - Application Logic (ES6+)
   ========================================================================== */

// COURT DATA
const courtsData = [
    {
        id: 'court-1',
        name: 'Quadra 1 - Central Panorâmica VIP',
        category: 'vip',
        badge: 'Panorâmica VIP • Climatizada',
        price: 150,
        rating: 4.9,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop',
        specs: ['Piso Oficial WPT Azul', 'Vidro Panorâmico 12mm', 'Iluminação LED Pro 800W', 'Ar Climatizado']
    },
    {
        id: 'court-2',
        name: 'Quadra 2 - Coberta Master',
        category: 'coberta',
        badge: 'Coberta • Climatizada',
        price: 130,
        rating: 4.8,
        reviews: 95,
        image: 'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?q=80&w=800&auto=format&fit=crop',
        specs: ['Piso Manta Antiderrapante', 'Estrutura Anti-Eco', 'Iluminação LED 600W', 'Área de Descanso']
    },
    {
        id: 'court-3',
        name: 'Quadra 3 - Coberta Pro',
        category: 'coberta',
        badge: 'Coberta Premium',
        price: 120,
        rating: 4.7,
        reviews: 84,
        image: 'https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?q=80&w=800&auto=format&fit=crop',
        specs: ['Piso Monofio Azul', 'Vidro 10mm Temperado', 'Iluminação LED Sem Sombra', 'Placar Eletrônico']
    },
    {
        id: 'court-4',
        name: 'Quadra 4 - Descoberta Sunset',
        category: 'descoberta',
        badge: 'Descoberta • Open Air',
        price: 100,
        rating: 4.9,
        reviews: 110,
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
        specs: ['Visão Panorâmica do Pôr do Sol', 'Piso WPT Oficial', 'Rede de Alta Tensão', 'Drenagem Rápida']
    },
    {
        id: 'court-5',
        name: 'Quadra 5 - Descoberta Arena',
        category: 'descoberta',
        badge: 'Descoberta',
        price: 95,
        rating: 4.6,
        reviews: 72,
        image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
        specs: ['Piso Sintético Alta Absorção', 'Vidro Duplo Lateral', 'Arquibancada Lateral', 'Refletor Super LED']
    },
    {
        id: 'court-6',
        name: 'Quadra 6 - Panorâmica Show',
        category: 'vip',
        badge: 'Panorâmica VIP',
        price: 160,
        rating: 5.0,
        reviews: 140,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
        specs: ['Visão 360 Graus', 'Câmeras para Gravação HD', 'Piso Super Premium WPT', 'Camarote Privativo']
    }
];

let selectedCourtObj = courtsData[0];
let currentStep = 1;

// RENDER COURTS
function renderCourts(filter = 'all') {
    const grid = document.getElementById('courts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filter === 'all' 
        ? courtsData 
        : courtsData.filter(c => c.category === filter);

    filtered.forEach(court => {
        const cardHtml = `
            <div class="court-card glass-card">
                <div>
                    <div class="court-image-wrapper">
                        <img src="${court.image}" alt="${court.name}">
                        <span class="court-badge">${court.badge}</span>
                        <div class="court-rating">
                            <i class="fa-solid fa-star"></i> ${court.rating} (${court.reviews})
                        </div>
                    </div>
                    <div class="court-body">
                        <h3 class="court-title">${court.name}</h3>
                        <ul class="court-specs">
                            ${court.specs.map(s => `<li><i class="fa-solid fa-circle-check"></i> ${s}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="court-footer">
                    <div>
                        <span class="price-label">A partir de</span>
                        <span class="price-value">R$ ${court.price}<span class="price-unit">/h</span></span>
                    </div>
                    <button onclick="openBookingModal('${court.id}')" class="btn btn-neon">Reservar</button>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// FILTER COURTS LOGIC
function filterCourts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderCourts(category);
}

// MODAL CONTROLS & STEPS
function populateModalCourts() {
    const select = document.getElementById('modal-court-select');
    if (!select) return;
    select.innerHTML = courtsData.map(c => `
        <option value="${c.id}">${c.name} - R$ ${c.price}/hora</option>
    `).join('');
}

function openBookingModal(courtId = null) {
    populateModalCourts();

    if (courtId) {
        document.getElementById('modal-court-select').value = courtId;
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modal-date-select').value = today;

    updateCourtDetailsInModal();
    generateTimeSlots();
    goToStep(1);

    document.getElementById('booking-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function updateCourtDetailsInModal() {
    const courtId = document.getElementById('modal-court-select').value;
    selectedCourtObj = courtsData.find(c => c.id === courtId) || courtsData[0];
    document.getElementById('modal-court-title').innerText = selectedCourtObj.name;
    calculateTotal();
}

function generateTimeSlots() {
    const container = document.getElementById('time-slots-container');
    if (!container) return;
    container.innerHTML = '';

    const times = ["07:00", "08:30", "10:00", "11:30", "14:00", "15:30", "17:00", "18:30", "20:00", "21:30"];

    times.forEach((time, index) => {
        const isBooked = index === 2 || index === 7;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = isBooked ? 'slot-btn disabled' : 'slot-btn';
        btn.innerText = time;

        if (!isBooked) {
            btn.onclick = () => selectTimeSlot(btn, time);
        } else {
            btn.disabled = true;
        }

        container.appendChild(btn);
    });

    const firstAvailable = container.querySelector('.slot-btn:not(.disabled)');
    if (firstAvailable) firstAvailable.click();
}

function selectTimeSlot(btn, time) {
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('selected-timeslot').value = time;
    calculateTotal();
}

function calculateTotal() {
    if (!selectedCourtObj) return;

    const duration = parseFloat(document.getElementById('modal-duration').value) || 1;
    let total = selectedCourtObj.price * duration;

    if (document.getElementById('addon-racket').checked) total += 30;
    if (document.getElementById('addon-balls').checked) total += 25;
    if (document.getElementById('addon-teacher').checked) total += 90;

    document.getElementById('summary-court-name').innerText = selectedCourtObj.name;
    
    const dateVal = document.getElementById('modal-date-select').value;
    const timeVal = document.getElementById('selected-timeslot').value || 'Não selecionado';
    document.getElementById('summary-datetime').innerText = `${dateVal} às ${timeVal} (${duration}h)`;

    document.getElementById('summary-total-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function goToStep(step) {
    currentStep = step;

    [1, 2, 3].forEach(s => {
        const content = document.getElementById(`booking-step-${s}`);
        const indicator = document.getElementById(`step-btn-${s}`);
        if (content) content.classList.add('hidden');
        if (indicator) indicator.classList.remove('active');
    });

    document.getElementById(`booking-step-${step}`).classList.remove('hidden');
    
    for (let i = 1; i <= step; i++) {
        document.getElementById(`step-btn-${i}`).classList.add('active');
    }

    calculateTotal();
}

// FORM SUBMISSIONS & TOAST
function handleHeroSearch(event) {
    event.preventDefault();
    const courtType = document.getElementById('hero-type').value;
    if (courtType !== 'all') filterCourts(courtType);
    
    document.getElementById('quadras').scrollIntoView({ behavior: 'smooth' });
    showToast("Busca Aplicada!", "Filtrando as quadras com disponibilidade.");
}

function handleBookingSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('cust-name').value;
    const bookingCode = 'P-PRO-' + Math.floor(100000 + Math.random() * 900000);

    closeBookingModal();
    showToast(`Reserva #${bookingCode} Confirmada!`, `Obrigado, ${name}. Enviamos o voucher para seu e-mail.`);
    document.getElementById('booking-form').reset();
}

function selectSubscription(plan) {
    showToast(`Plano ${plan} Selecionado`, "Um de nossos consultores entrará em contato via WhatsApp.");
}

function handleNewsletter(event) {
    event.preventDefault();
    showToast("Inscrição Concluída", "Você receberá nossas novidades em primeira mão!");
    event.target.reset();
}

function showToast(title, message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-message').innerText = message;

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    renderCourts();

    const today = new Date().toISOString().split('T')[0];
    const heroDate = document.getElementById('hero-date');
    if (heroDate) heroDate.value = today;

    // Mobile Navigation Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
});
// ===== DASHBOARD PAGE LOGIC =====

let currentFilter = 'all';

function renderDashboard() {
  const bookings = getBookings();
  updateStats(bookings);
  renderBookings(bookings);
}

function updateStats(bookings) {
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statConfirmed').textContent = confirmed;
  document.getElementById('statCompleted').textContent = completed;

  // Show/hide clear button
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.style.display = total > 0 ? 'inline-flex' : 'none';

  // Update user info from latest booking
  if (bookings.length > 0) {
    const latest = bookings[bookings.length - 1];
    const userName = document.getElementById('userName');
    if (latest.customer && latest.customer.name && userName) {
      userName.textContent = latest.customer.name;
    }
  }
}

function renderBookings(bookings) {
  const list = document.getElementById('bookingList');
  if (!list) return;

  // Apply filter
  let filtered = bookings;
  if (currentFilter !== 'all') {
    filtered = bookings.filter(b => b.status.toLowerCase() === currentFilter);
  }

  // Sort by newest first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No Bookings ${currentFilter !== 'all' ? `(${currentFilter})` : 'Yet'}</h3>
        <p>${currentFilter !== 'all' 
          ? `You don't have any ${currentFilter} bookings.` 
          : 'Book your first welding service with Rainbow Welding Works!'}</p>
        <a href="booking.html" class="btn btn-primary">📅 Book a Service</a>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(booking => {
    const locationText = booking.location 
      ? `${booking.location.address || ''}, ${booking.location.city || 'Vijayawada'}` 
      : 'Vijayawada';
    const dateText = booking.schedule && booking.schedule.date 
      ? formatBookingDate(booking.schedule.date) 
      : 'Date pending';
    const timeText = booking.schedule && booking.schedule.time 
      ? booking.schedule.time 
      : '';
    const priceText = booking.pricing && booking.pricing.total > 0 
      ? formatCurrency(booking.pricing.total) 
      : 'Quote pending';

    return `
      <div class="booking-item">
        <div class="booking-info">
          <h4>🌈 ${booking.serviceType || 'Welding Service'}</h4>
          <p>📍 ${locationText}</p>
          <p>📅 ${dateText} ${timeText ? '| ' + timeText : ''}</p>
          ${booking.workDescription ? `<p style="margin-top: 4px; font-size: 0.8rem; color: var(--text-muted);">${booking.workDescription.substring(0, 80)}${booking.workDescription.length > 80 ? '...' : ''}</p>` : ''}
        </div>
        <div>
          <span class="status-badge ${booking.status.toLowerCase().replace(' ', '-')}">${booking.status}</span>
        </div>
        <div class="booking-meta">
          <div class="booking-price">${priceText}</div>
          <div class="booking-date">${new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          <div style="margin-top: 8px; display: flex; gap: 6px; justify-content: flex-end;">
            ${booking.status === 'Pending' ? `
              <button class="btn btn-sm btn-secondary" onclick="changeStatus(${booking.id}, 'Cancelled')" style="padding: 4px 10px; font-size: 0.75rem; color: var(--color-red);">Cancel</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showSection(filter, clickedLink) {
  currentFilter = filter;

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  if (clickedLink) clickedLink.classList.add('active');

  // Update title
  const titles = {
    'all': '📋 All Bookings',
    'pending': '⏳ Pending Bookings',
    'confirmed': '✅ Confirmed Bookings',
    'completed': '🏆 Completed Bookings'
  };
  document.getElementById('bookingListTitle').textContent = titles[filter] || titles['all'];

  renderDashboard();
}

function changeStatus(bookingId, newStatus) {
  updateBookingStatus(bookingId, newStatus);
  showToast(`Booking ${newStatus.toLowerCase()}!`, newStatus === 'Cancelled' ? 'error' : 'success');
  renderDashboard();
}

function clearAllBookings() {
  if (confirm('Are you sure you want to clear all bookings? This cannot be undone.')) {
    localStorage.removeItem('weldBookings');
    showToast('All bookings cleared', 'info');
    renderDashboard();
  }
}

function formatBookingDate(dateStr) {
  if (!dateStr) return 'N/A';
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// Initialize
document.addEventListener('DOMContentLoaded', renderDashboard);

// ===== WORKERS PAGE LOGIC =====

let currentWorkers = [...workersData];

function renderWorkers(workers) {
  const grid = document.getElementById('workersGrid');
  const count = document.getElementById('resultsCount');
  
  if (!grid) return;

  if (workers.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3>No Workers Found</h3>
        <p>Try adjusting your search filters to find more workers</p>
        <button class="btn btn-primary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    count.textContent = 'No workers found';
    return;
  }

  count.textContent = `Showing ${workers.length} worker${workers.length > 1 ? 's' : ''}`;

  grid.innerHTML = workers.map((worker, index) => `
    <div class="worker-card" style="animation-delay: ${index * 0.1}s">
      <div class="worker-card-image">
        <img src="${worker.photo}" alt="${worker.name}" loading="lazy">
        <span class="worker-badge ${worker.availability === 'Available' ? '' : 'offline'}">
          ${worker.availability}
        </span>
      </div>
      <div class="worker-card-body">
        <div class="worker-card-header">
          <h3 class="worker-card-name">${worker.name}</h3>
          <div class="worker-card-rating">
            ★ ${worker.rating} <span style="color: var(--text-muted);">(${worker.reviews})</span>
          </div>
        </div>
        <div class="worker-card-specialization">${worker.specialization}</div>
        <div class="worker-card-details">
          <div class="worker-detail">
            <span class="detail-icon">📍</span>
            <span>${worker.location}</span>
          </div>
          <div class="worker-detail">
            <span class="detail-icon">🔧</span>
            <span>${worker.skills.join(', ')}</span>
          </div>
          <div class="worker-detail">
            <span class="detail-icon">📅</span>
            <span>${worker.experience} years experience</span>
          </div>
        </div>
        <div class="worker-card-footer">
          <div class="worker-price">
            ${formatCurrency(worker.hourlyRate)} <span>/hour</span>
          </div>
          <a href="booking.html?worker=${worker.id}" class="btn btn-primary btn-sm">Book Now</a>
        </div>
      </div>
    </div>
  `).join('');
}

function filterWorkers() {
  const location = document.getElementById('filterLocation').value.toLowerCase().trim();
  const type = document.getElementById('filterType').value;
  const maxPrice = parseInt(document.getElementById('filterPrice').value) || Infinity;

  currentWorkers = workersData.filter(worker => {
    const matchLocation = !location || worker.location.toLowerCase().includes(location);
    const matchType = !type || worker.specialization.toLowerCase().includes(type.toLowerCase()) || worker.skills.some(s => s.toLowerCase().includes(type.toLowerCase()));
    const matchPrice = worker.hourlyRate <= maxPrice;
    return matchLocation && matchType && matchPrice;
  });

  renderWorkers(currentWorkers);
}

function sortWorkers(sortBy, btn) {
  // Update active button
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const sorted = [...currentWorkers];
  
  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'price-low':
      sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
    case 'experience':
      sorted.sort((a, b) => b.experience - a.experience);
      break;
  }

  renderWorkers(sorted);
}

function resetFilters() {
  document.getElementById('filterLocation').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('filterPrice').value = '';
  currentWorkers = [...workersData];
  renderWorkers(currentWorkers);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderWorkers(workersData);

  // Live search on location input
  const locationInput = document.getElementById('filterLocation');
  if (locationInput) {
    locationInput.addEventListener('input', () => {
      filterWorkers();
    });
  }

  // Filter on select change
  const filterType = document.getElementById('filterType');
  const filterPrice = document.getElementById('filterPrice');
  if (filterType) filterType.addEventListener('change', filterWorkers);
  if (filterPrice) filterPrice.addEventListener('change', filterWorkers);
});

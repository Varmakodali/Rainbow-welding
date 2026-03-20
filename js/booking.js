// ===== BOOKING PAGE LOGIC =====

let selectedWorker = null;

function initBookingPage() {
  // Set minimum date to today
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  // Populate worker dropdown
  const workerSelect = document.getElementById('workerSelect');
  if (workerSelect) {
    workersData.forEach(worker => {
      const option = document.createElement('option');
      option.value = worker.id;
      option.textContent = `${worker.name} — ${worker.specialization} (${formatCurrency(worker.hourlyRate)}/hr)`;
      workerSelect.appendChild(option);
    });
  }

  // Check if worker is pre-selected via URL params
  const params = new URLSearchParams(window.location.search);
  const workerId = params.get('worker');
  if (workerId && workerSelect) {
    workerSelect.value = workerId;
    onWorkerSelect();
  }
}

function onWorkerSelect() {
  const workerId = document.getElementById('workerSelect').value;
  selectedWorker = getWorkerById(workerId);

  if (selectedWorker) {
    document.getElementById('summaryWorkerImg').src = selectedWorker.photo;
    document.getElementById('summaryWorkerName').textContent = selectedWorker.name;
    document.getElementById('summaryWorkerSpec').textContent = selectedWorker.specialization;
    document.getElementById('summaryWorkerRating').textContent = `★ ${selectedWorker.rating} (${selectedWorker.reviews} reviews)`;
    updatePrice();
  } else {
    document.getElementById('summaryWorkerName').textContent = 'Select a worker';
    document.getElementById('summaryWorkerSpec').textContent = 'Choose from the list';
    document.getElementById('summaryWorkerRating').textContent = '';
    resetPrice();
  }
}

function getMaterialsCost() {
  const materials = document.getElementById('materialsNeeded').value;
  const costs = { 'no': 0, 'basic': 500, 'standard': 1500, 'premium': 3000 };
  return costs[materials] || 0;
}

function updatePrice() {
  if (!selectedWorker) return;

  const hours = parseInt(document.getElementById('estimatedHours').value) || 1;
  const materialsCost = getMaterialsCost();
  const laborCost = selectedWorker.hourlyRate * hours;
  const travelFee = selectedWorker.travelFee;
  const total = Math.max(laborCost + travelFee + materialsCost, selectedWorker.minCharge);

  document.getElementById('priceRate').textContent = formatCurrency(selectedWorker.hourlyRate) + '/hr';
  document.getElementById('priceHours').textContent = hours;
  document.getElementById('priceLabor').textContent = formatCurrency(laborCost);
  document.getElementById('priceTravel').textContent = formatCurrency(travelFee);
  document.getElementById('priceMaterials').textContent = formatCurrency(materialsCost);
  document.getElementById('priceTotal').textContent = formatCurrency(total);
}

function resetPrice() {
  ['priceRate', 'priceLabor', 'priceTravel', 'priceMaterials', 'priceTotal'].forEach(id => {
    document.getElementById(id).textContent = '₹0';
  });
  document.getElementById('priceHours').textContent = '0';
}

function confirmBooking() {
  // Validate required fields
  const requiredFields = [
    { id: 'workerSelect', label: 'Worker' },
    { id: 'serviceType', label: 'Service Type' },
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'pincode', label: 'Pincode' },
    { id: 'bookingDate', label: 'Date' },
    { id: 'bookingTime', label: 'Time' },
    { id: 'customerName', label: 'Name' },
    { id: 'customerPhone', label: 'Phone' }
  ];

  for (const field of requiredFields) {
    const el = document.getElementById(field.id);
    if (!el || !el.value.trim()) {
      showToast(`Please fill in: ${field.label}`, 'error');
      el.focus();
      el.style.borderColor = 'var(--color-red)';
      setTimeout(() => el.style.borderColor = '', 2000);
      return;
    }
  }

  // Validate pincode
  const pincode = document.getElementById('pincode').value;
  if (!/^\d{6}$/.test(pincode)) {
    showToast('Please enter a valid 6-digit pincode', 'error');
    return;
  }

  // Build booking object
  const hours = parseInt(document.getElementById('estimatedHours').value) || 1;
  const materialsCost = getMaterialsCost();
  const laborCost = selectedWorker.hourlyRate * hours;
  const total = Math.max(laborCost + selectedWorker.travelFee + materialsCost, selectedWorker.minCharge);

  const booking = {
    workerId: selectedWorker.id,
    workerName: selectedWorker.name,
    workerPhoto: selectedWorker.photo,
    workerSpecialization: selectedWorker.specialization,
    serviceType: document.getElementById('serviceType').value,
    workDescription: document.getElementById('workDescription').value,
    estimatedHours: hours,
    location: {
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      pincode: pincode,
      landmark: document.getElementById('landmark').value
    },
    schedule: {
      date: document.getElementById('bookingDate').value,
      time: document.getElementById('bookingTime').value
    },
    customer: {
      name: document.getElementById('customerName').value,
      phone: document.getElementById('customerPhone').value,
      email: document.getElementById('customerEmail').value
    },
    pricing: {
      hourlyRate: selectedWorker.hourlyRate,
      laborCost: laborCost,
      travelFee: selectedWorker.travelFee,
      materialsCost: materialsCost,
      total: total
    }
  };

  // Save booking
  saveBooking(booking);

  // Show success modal
  const modal = document.getElementById('successModal');
  if (modal) {
    document.getElementById('modalMessage').textContent = 
      `Your ${booking.serviceType} service with ${booking.workerName} has been booked for ${formatDate(booking.schedule.date)} at ${formatTime(booking.schedule.time)}. Total: ${formatCurrency(total)}`;
    modal.classList.add('active');
  }
}

function formatDate(dateStr) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-IN', options);
}

function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', initBookingPage);

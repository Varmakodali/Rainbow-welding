// ===== SAMPLE WORKER DATA =====
const workersData = [
  {
    id: 1,
    name: "Rajesh Kumar",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=ff6b35",
    specialization: "MIG & TIG Welding",
    rating: 4.9,
    reviews: 127,
    experience: 12,
    location: "Hyderabad, Telangana",
    hourlyRate: 500,
    minCharge: 1000,
    travelFee: 200,
    availability: "Available",
    skills: ["MIG Welding", "TIG Welding", "Pipe Welding"],
    certifications: ["AWS Certified", "ASME IX"],
    about: "Expert welder with 12 years of experience in MIG and TIG welding. Specialized in structural and pipe welding for industrial projects.",
    phone: "+91 98765 43210"
  },
  {
    id: 2,
    name: "Suresh Patel",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh&backgroundColor=4361ee",
    specialization: "Structural Welding",
    rating: 4.8,
    reviews: 98,
    experience: 8,
    location: "Mumbai, Maharashtra",
    hourlyRate: 600,
    minCharge: 1200,
    travelFee: 300,
    availability: "Available",
    skills: ["Structural Welding", "MIG Welding", "Stick Welding"],
    certifications: ["AWS Certified"],
    about: "Specialized in structural welding for buildings, bridges, and heavy fabrication work.",
    phone: "+91 87654 32109"
  },
  {
    id: 3,
    name: "Mohammed Irfan",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Irfan&backgroundColor=22c55e",
    specialization: "Pipe Welding",
    rating: 4.7,
    reviews: 85,
    experience: 15,
    location: "Chennai, Tamil Nadu",
    hourlyRate: 700,
    minCharge: 1500,
    travelFee: 250,
    availability: "Busy",
    skills: ["Pipe Welding", "TIG Welding", "Orbital Welding"],
    certifications: ["AWS Certified", "ASME IX", "API 1104"],
    about: "15 years of experience in pipe welding for oil & gas and petrochemical industries.",
    phone: "+91 76543 21098"
  },
  {
    id: 4,
    name: "Vikram Singh",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=eab308",
    specialization: "Stick Welding",
    rating: 4.6,
    reviews: 64,
    experience: 6,
    location: "Delhi, Delhi",
    hourlyRate: 400,
    minCharge: 800,
    travelFee: 150,
    availability: "Available",
    skills: ["Stick Welding", "MIG Welding"],
    certifications: ["AWS Certified"],
    about: "Reliable stick welding professional for general fabrication and repair work.",
    phone: "+91 65432 10987"
  },
  {
    id: 5,
    name: "Arjun Reddy",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=ef4444",
    specialization: "TIG Welding",
    rating: 4.9,
    reviews: 142,
    experience: 10,
    location: "Bangalore, Karnataka",
    hourlyRate: 650,
    minCharge: 1300,
    travelFee: 200,
    availability: "Available",
    skills: ["TIG Welding", "Aluminum Welding", "Stainless Steel"],
    certifications: ["AWS Certified", "CWI"],
    about: "TIG welding specialist for precision work on aluminum and stainless steel structures.",
    phone: "+91 54321 09876"
  },
  {
    id: 6,
    name: "Prakash Sharma",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prakash&backgroundColor=a855f7",
    specialization: "MIG Welding",
    rating: 4.5,
    reviews: 52,
    experience: 5,
    location: "Pune, Maharashtra",
    hourlyRate: 450,
    minCharge: 900,
    travelFee: 180,
    availability: "Available",
    skills: ["MIG Welding", "Spot Welding", "Flux Core"],
    certifications: ["NSQF Level 5"],
    about: "Skilled MIG welder for automotive, fabrication, and manufacturing applications.",
    phone: "+91 43210 98765"
  },
  {
    id: 7,
    name: "Deepak Yadav",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak&backgroundColor=06b6d4",
    specialization: "Underwater Welding",
    rating: 4.8,
    reviews: 34,
    experience: 7,
    location: "Visakhapatnam, AP",
    hourlyRate: 1200,
    minCharge: 5000,
    travelFee: 500,
    availability: "Available",
    skills: ["Underwater Welding", "Stick Welding", "Cutting"],
    certifications: ["AWS D3.6", "Commercial Diver"],
    about: "Certified underwater welder for marine and offshore structural repairs.",
    phone: "+91 32109 87654"
  },
  {
    id: 8,
    name: "Karthik Nair",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik&backgroundColor=f97316",
    specialization: "Robotic Welding",
    rating: 4.7,
    reviews: 45,
    experience: 9,
    location: "Coimbatore, Tamil Nadu",
    hourlyRate: 800,
    minCharge: 2000,
    travelFee: 300,
    availability: "Busy",
    skills: ["Robotic Welding", "MIG Welding", "Programming"],
    certifications: ["AWS Certified", "FANUC Programming"],
    about: "Expert in robotic welding setup and automation for manufacturing plants.",
    phone: "+91 21098 76543"
  }
];

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '★';
  if (hasHalf) stars += '½';
  return stars;
}

function getBookings() {
  return JSON.parse(localStorage.getItem('weldBookings') || '[]');
}

async function saveBooking(booking) {
  const bookings = getBookings();
  booking.id = Date.now();
  booking.status = 'Pending';
  booking.createdAt = new Date().toISOString();
  bookings.push(booking);
  localStorage.setItem('weldBookings', JSON.stringify(bookings));

  // Connect to Firebase if initialized
  if (window.firebaseDb && window.firebaseAddDoc && window.firebaseCollection) {
    try {
      await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDb, "bookings"), booking);
      console.log("Booking successfully added to Firestore database!");
    } catch (error) {
      console.error("Error saving booking to Firestore: ", error);
    }
  }

  return booking;
}

function updateBookingStatus(bookingId, status) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    localStorage.setItem('weldBookings', JSON.stringify(bookings));
  }
}

function getWorkerById(id) {
  return workersData.find(w => w.id === parseInt(id));
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || '✅'}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== NAVIGATION =====
function initNavigation() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = toggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ===== SPARK PARTICLES =====
function createSparks(container, count = 20) {
  const sparkContainer = document.createElement('div');
  sparkContainer.className = 'spark-container';
  
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = Math.random() * 100 + '%';
    spark.style.animationDuration = (Math.random() * 4 + 3) + 's';
    spark.style.animationDelay = Math.random() * 5 + 's';
    spark.style.width = (Math.random() * 3 + 1) + 'px';
    spark.style.height = spark.style.width;
    sparkContainer.appendChild(spark);
  }

  container.appendChild(sparkContainer);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .step-card, .service-card, .testimonial-card, .worker-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  
  // Add sparks to hero section if exists
  const hero = document.querySelector('.hero');
  if (hero) {
    createSparks(hero, 25);
  }
});

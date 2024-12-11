function openModal(modalId) {
  console.log('Modal button clicked:', modalId);
  var modal = document.getElementById(modalId);
  if (modal) {
    console.log('Modal found:', modal);
    modal.style.display = "block";
  } else {
    console.error('Modal not found:', modalId);
  }
}

function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Get all close buttons
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = "none";
    }
  });

  // Close modal when clicking outside
  window.onclick = function(event) {
    if (event.target.className === "modal") {
      event.target.style.display = "none";
    }
  }
}); 
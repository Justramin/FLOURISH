 // Check if userData exists in localStorage and set the input values accordingly
 document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const { name, email, phone, password } = JSON.parse(userData);
        document.getElementById('name').value = name;
        document.getElementById('email').value = email;
        document.getElementById('phone').value = phone;
        document.getElementById('password').value = password;
    }
});

// Save input values to localStorage when the form is submitted
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
    };
    localStorage.setItem('userData', JSON.stringify(formData));
    event.target.submit(); // Manually submit the form after saving data to localStorage
});
const validateName = (name) => {
    // Name should be at least 4 characters long and can contain letters and spaces
    const nameRegex = /^[a-zA-Z\s]{4,}$/;
    name=name.trim()
    return nameRegex.test(name);
  };
  
  const validateEmail = (email) => {
    // Basic email validation using a regular expression
    const emailRegex =/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // Password should be at least 6 characters long, containing at least one uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phoneNumber) => {
    // Phone number should contain exactly 10 digits
    const phoneNumberRegex =/^[0-9]{10}$/
    return phoneNumberRegex.test(phoneNumber);
};
  
  module.exports = {
    validateName,
    validateEmail,
    validatePassword,
    validatePhoneNumber
  };


  
  
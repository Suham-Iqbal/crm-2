document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('loggedInUser')) {
    window.location.href = 'index.html';
  }

  const loginCard = document.getElementById('login-card');
  const signupCard = document.getElementById('signup-card');
  const showSignupLink = document.getElementById('show-signup');
  const showLoginLink = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  const showAlert = (alertElementId, message, type = 'danger') => {
    const alertPlaceholder = document.getElementById(alertElementId);
    alertPlaceholder.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  };

  // Function to save signup record to JSON file via server
  const saveSignupToJson = async (userData) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Signup record saved to JSON file:', userData);
        return true;
      } else {
        console.error('Failed to save signup record:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Error saving signup record:', error);
      return false;
    }
  };

  // Function to save login record to JSON file via server
  const saveLoginToJson = async (userData) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Login record saved to JSON file:', userData);
        return true;
      } else {
        console.error('Failed to save login record:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Error saving login record:', error);
      return false;
    }
  };

  // Function to get users from JSON file for authentication
  const getUsersFromJson = async () => {
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      return result.users || [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.add('d-none');
    signupCard.classList.remove('d-none');
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupCard.classList.add('d-none');
    loginCard.classList.remove('d-none');
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const userType = document.getElementById('signup-userType').value;

    if (!userType) {
      showAlert('signup-alert', 'Please select a user type.');
      return;
    }

    try {
      // Get existing users from JSON file
      const existingUsers = await getUsersFromJson();

      if (existingUsers.find(user => user.email === email)) {
        showAlert('signup-alert', 'An account with this email already exists.');
        return;
      }

      // Create new user data
      const newUser = {
        username,
        email,
        password,
        userType
      };

      // Save to JSON file via server
      const success = await saveSignupToJson(newUser);
      
      if (success) {
        console.log('=== SIGNUP COMPLETED ===');
        console.log('User data saved to signup.json file');
        
        showAlert('signup-alert', 'Account created successfully! Please log in.', 'success');
        signupForm.reset();
        showLoginLink.click();
      } else {
        showAlert('signup-alert', 'Error creating account. Please try again.');
      }
    } catch (error) {
      showAlert('signup-alert', 'Error creating account. Please try again.');
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      // Get users from JSON file
      const users = await getUsersFromJson();

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Save login record to JSON file
        const loginData = {
          email: user.email,
          username: user.username,
          password: user.password,
          userType: user.userType
        };

        const loginSuccess = await saveLoginToJson(loginData);
        
        if (loginSuccess) {
          console.log('=== LOGIN COMPLETED ===');
          console.log('Login record saved to login.json file');
          
          sessionStorage.setItem('loggedInUser', JSON.stringify(user));
          sessionStorage.setItem('login_success', 'true'); 
          window.location.href = 'index.html';
        } else {
          showAlert('login-alert', 'Error logging in. Please try again.');
        }
      } else {
        showAlert('login-alert', 'Invalid email or password.');
      }
    } catch (error) {
      showAlert('login-alert', 'Error logging in. Please try again.');
    }
  });
});
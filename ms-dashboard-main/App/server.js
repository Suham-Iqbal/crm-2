const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Function to read JSON file
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return default structure
    if (filename.includes('login')) {
      return { loginRecords: [] };
    } else if (filename.includes('signup')) {
      return { signupRecords: [] };
    }
    return { users: [] };
  }
}

// Function to write JSON file
async function writeJsonFile(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

// API endpoint to save signup record
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    
    // Read existing signup records
    const signupData = await readJsonFile('signup.json');
    
    // Create new signup record
    const newSignupRecord = {
    //  id: signupData.signupRecords.length + 1,
      username,
      email,
      password,
      userType,
      signupDate: new Date().toISOString()
    };
    
    // Add to signup records
    signupData.signupRecords.push(newSignupRecord);
    
    // Write back to file
    const success = await writeJsonFile('signup.json', signupData);
    
    if (success) {
      res.json({ success: true, message: 'Signup record saved to JSON file' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save signup record' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to save login record
app.post('/api/login', async (req, res) => {
  try {
    const { email, username, password, userType } = req.body;
    
    // Read existing login records
    const loginData = await readJsonFile('login.json');
    
    // Create new login record
    const newLoginRecord = {
     // id: loginData.loginRecords.length + 1,
      email,
      username,
      password,
      userType,
      loginTime: new Date().toISOString()
    };
    
    // Add to login records
    loginData.loginRecords.push(newLoginRecord);
    
    // Write back to file
    const success = await writeJsonFile('login.json', loginData);
    
    if (success) {
      res.json({ success: true, message: 'Login record saved to JSON file' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save login record' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to get all users for authentication
app.get('/api/users', async (req, res) => {
  try {
    const signupData = await readJsonFile('signup.json');
    res.json({ users: signupData.signupRecords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('JSON files will be updated automatically when users sign up or log in');
});

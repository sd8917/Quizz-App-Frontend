import {
  Quiz as QuizIcon,
  Leaderboard as LeaderboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Terminal
} from '@mui/icons-material';

/**
 * Performance Optimization Utilities
 * Helper functions for optimizing React and Material-UI applications
 */

// Debounce function for search inputs, resize events, etc.
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events, mouse moves, etc.
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy load images
export const lazyLoadImage = (imageSrc, placeholder = '') => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(imageSrc);
    img.onerror = () => reject(placeholder);
  });
};

// Local storage with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Format numbers with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Validate email (used across Login, Register, UserManagement)
export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password (minimum 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate username (minimum 3 characters)
export const isValidUsername = (username) => {
  return username && username.length >= 3;
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !value) {
      errors[field] = rule.requiredMessage || `${field} is required`;
    } else if (value && rule.validator && !rule.validator(value)) {
      errors[field] = rule.errorMessage || `Invalid ${field}`;
    } else if (value && rule.match && formData[rule.match] !== value) {
      errors[field] = rule.matchMessage || `${field} does not match`;
    }
  });
  
  return errors;
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Deep clone object (for immutable updates)
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text with ellipsis
export const truncate = (str, maxLength) => {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

// Format date
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MMM', months[d.getMonth()])
    .replace('DD', d.getDate().toString().padStart(2, '0'));
};

// Retry async function with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

// Memoize expensive function results
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const  getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Creator':
        return 'warning';
      default:
        return 'default';
    }
};

export const getStatusColor = (status) => {
  return status === 'true' || status === "N/A" ? 'error' : 'success';
};


export const getActiveColor=(value)=>{

  if(value.toLowerCase()==="online"){
    return "success";
  }

  if(value.toLowerCase().includes("minutes") || value.toLowerCase().includes("min")){
    return "warning";
  }

}

/*
 Get welcome message based on role

 */
export const getWelcomeMessage = (userRole , name) => {
    if (userRole === 'admin') return `Welcome back, ${name ? name : "Admin"}! 👨‍💼`;
    if (userRole === 'creator') return `Welcome back, ${name ? name : "Creator"}! 🎨`;
    return `Welcome back, ${name ? name : "User"}! 👋`;
};

/*
  Add more card Admin dashboard and its route
*/
export const AdminDashboardRoutes = [
  {
    title: 'Leaderboard',
    description: ' Check your rank and compete with other players',
    icon: <LeaderboardIcon />,
    iconBg: 'warning.main',
    navigateTo: '/leaderboard',
  },
  {
    title: 'User Management',
    description: 'Manage users, roles, and permissions',
    icon: <PersonIcon />,
    iconBg: 'info.main',
    navigateTo: '/user-management',
  },
  {
    title: 'Quiz Management',
    description: 'Create and manage quiz questions',
    icon: <QuizIcon />,
    iconBg: 'success.main',
    navigateTo: '/quiz-management',
  },
  {
    title: 'Server Logs',
    description: 'View and manage server logs',
    icon: <Terminal />,
    iconBg: 'warning.main',
    navigateTo: '/server-logs',
  },
];

export const categories = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Getting Started',
      description: 'Learn the basics of using QuizApp',
      color: '#667eea',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Account & Privacy',
      description: 'Manage your account and privacy settings',
      color: '#10b981',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      title: 'Billing & Plans',
      description: 'Information about pricing and payments',
      color: '#f59e0b',
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      title: 'Features & Settings',
      description: 'Explore features and customize settings',
      color: '#ec4899',
    },
];

export  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on the "Get Started" button on the homepage and fill in your details. You\'ll receive a confirmation email to verify your account.',
    },
    {
      question: 'Is TriviaVerse free to use?',
      answer: 'Yes! TriviaVerse offers a free plan with access to thousands of quizzes. We also have premium plans with additional features for power users.',
    },
    {
      question: 'How do I create my own quiz?',
      answer: 'After logging in, please drop an email to update your role to "Creator" then navigate to the Dashboard and click on "Create Quiz". Follow the step-by-step wizard to add questions, set time limits, and publish your quiz. More details will be available in the Tutorial footer menu!',
    },
    {
      question: 'Can I track my progress?',
      answer: 'Absolutely! Your Dashboard provides detailed analytics including scores, time spent, improvement trends, and areas for improvement.',
    },
    {
      question: 'How does the leaderboard work?',
      answer: 'The leaderboard ranks users based on their quiz performance, including accuracy, speed, and consistency. Points are calculated using our proprietary algorithm.',
    },
    {
      question: 'What if I encounter a technical issue?',
      answer: 'Please contact our support team through the Contact page or email us at triviaverse.contact@gmail.com. We typically respond within 24 hours.',
    },
];

# Quizz App Frontend

A modern, responsive Quiz application built with React and Material-UI featuring custom theming and optimizations.

## 🚀 Features

- **Custom Material-UI Theme**: Beautiful gradient-based design with custom colors, typography, and component styles
- **Responsive Design**: Works seamlessly across all devices
- **Authentication**: Login and Registration pages with validation
- **Dashboard**: User statistics and available quizzes with quick actions
- **Leaderboard**: Competitive rankings with player statistics and trends
- **User Management**: Admin panel to manage users, roles, and permissions
- **Quiz Management**: Create and manage quizzes (Admin)
- **User Profile**: View and edit user information
- **Footer Navigation**: Comprehensive footer with links to About Us, Contact, and more
- **Static Pages**: About Us and Contact Us pages with detailed information
- **Performance Optimized**: 
  - React lazy loading for code splitting
  - Optimized Material-UI component imports
  - Efficient routing with React Router v6

## 🎨 Custom Theme

The application uses a custom Material-UI theme with:
- **Primary Color**: Indigo (#6366f1)
- **Secondary Color**: Pink (#ec4899)
- **Custom Typography**: Roboto font family with custom weights
- **Gradient Backgrounds**: Beautiful gradient effects throughout the app
- **Custom Shadows**: Soft, modern shadow system
- **Rounded Corners**: Consistent border-radius for a modern look

## 📦 Tech Stack

- React 18.2.0
- Material-UI (MUI) 5.14.19
- React Router DOM 6.20.0
- Emotion (for styled components)
- Material-UI Icons

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ProtectedRoute.js
│   └── Footer.js
├── pages/              # Page components
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── Leaderboard.js
│   ├── UserManagement.js
│   ├── Profile.js
│   ├── QuizManagement.js
│   ├── About.js
│   └── Contact.js
├── theme/              # Material-UI theme configuration
│   └── theme.js
├── utils/              # Utility functions
│   ├── auth.js
│   └── themeProvider.js
├── App.js              # Main app component with routing
├── index.js            # Entry point
└── index.css           # Global styles
```

## 🔐 Demo Credentials

- **Email**: admin@example.com
- **Password**: admin123

## 🎯 Key Features Explained

### Custom Theming
The `theme.js` file contains all customizations:
- Color palette with primary, secondary, and semantic colors
- Typography settings with custom font sizes and weights
- Component-level customizations for buttons, text fields, cards, etc.
- Custom shadow system for depth

### Optimization Techniques
1. **Code Splitting**: Using React.lazy() for route-based code splitting
2. **Tree Shaking**: Only importing required MUI components
3. **Memoization**: Potential for React.memo() on heavy components
4. **Lazy Loading**: All routes are lazy-loaded for better initial load time

### Material-UI Best Practices
- Using `sx` prop for styling (better performance than styled-components for simple styles)
- Consistent use of theme tokens throughout the app
- Responsive design using MUI's Grid system
- Proper use of MUI's component variants and props

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📝 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## 🎨 Customization

To customize the theme, edit `src/theme/theme.js`:
- Change primary/secondary colors
- Adjust typography settings
- Modify component styles
- Update shadows and borders

## 📱 Responsive Breakpoints

Material-UI's default breakpoints:
- xs: 0px
- sm: 600px
- md: 900px
- lg: 1200px
- xl: 1536px

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

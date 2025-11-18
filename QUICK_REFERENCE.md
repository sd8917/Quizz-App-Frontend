# Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🔐 Demo Login

```
Email: admin@example.com
Password: admin123
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/theme/theme.js` | Custom Material-UI theme configuration |
| `src/App.js` | Main app with routing and lazy loading |
| `src/pages/Login.js` | Login page with MUI components |
| `src/pages/Dashboard.js` | Main dashboard |
| `package.json` | Dependencies and scripts |

## 🎨 Theme Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #6366f1 | Buttons, links, primary actions |
| Secondary | #ec4899 | Accent elements |
| Success | #10b981 | Success messages, positive actions |
| Error | #ef4444 | Error messages, delete actions |
| Warning | #f59e0b | Warning messages |
| Info | #3b82f6 | Info messages |

## 🛠️ Material-UI Components Used

- `Box` - Layout container
- `Container` - Responsive container
- `Grid` - Responsive grid layout
- `Paper` - Elevated surface
- `Card` - Content card
- `Button` - Action buttons
- `TextField` - Input fields
- `AppBar` - Top navigation
- `Toolbar` - AppBar content
- `Typography` - Text elements
- `IconButton` - Icon buttons
- `Avatar` - User avatars
- `Chip` - Small labels
- `Alert` - Alert messages
- `Dialog` - Modal dialogs
- `Menu` - Dropdown menus
- `CircularProgress` - Loading spinner

## 🎯 Optimization Techniques

1. **Code Splitting**: React.lazy() for all routes
2. **Tree Shaking**: Individual MUI imports
3. **Theme Caching**: Single theme instance
4. **sx Prop**: Compiled styling
5. **Lazy Loading**: Suspense boundaries

## 📱 Responsive Breakpoints

```javascript
sx={{
  width: { 
    xs: '100%',    // 0-600px
    sm: '75%',     // 600-900px
    md: '50%',     // 900-1200px
    lg: '33%',     // 1200-1536px
    xl: '25%'      // 1536px+
  }
}}
```

## 🎨 Common Styling Patterns

### Gradient Background
```javascript
sx={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}}
```

### Centered Content
```javascript
sx={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
}}
```

### Rounded Card
```javascript
sx={{
  borderRadius: 3,
  p: 3,
  boxShadow: 2
}}
```

## 🔄 Routing Structure

```
/ → redirects to /login
/login → Login page
/register → Register page
/dashboard → Dashboard (protected)
/profile → Profile (protected)
/quiz-management → Quiz Management (protected)
* → redirects to /login
```

## 📦 Project Dependencies

### Core
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0

### Material-UI
- @mui/material: ^5.14.19
- @mui/icons-material: ^5.14.19
- @emotion/react: ^11.11.1
- @emotion/styled: ^11.11.0

### Build Tools
- react-scripts: 5.0.1

## 🐛 Common Issues & Solutions

### Issue: Port 3000 in use
**Solution:**
```bash
# Windows
set PORT=3001 && npm start
```

### Issue: Module not found
**Solution:**
```bash
npm install
```

### Issue: Theme not applied
**Solution:** Check ThemeProvider in App.js

### Issue: Build fails
**Solution:**
```bash
rm -rf node_modules
npm install
npm run build
```

## 📊 Performance Targets

- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
- Bundle Size: < 300KB (gzipped)

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Material-UI](https://mui.com)
- [React Router](https://reactrouter.com)
- [MDN Web Docs](https://developer.mozilla.org)

## 💡 Pro Tips

1. Always use theme tokens for colors
2. Use sx prop for one-off styles
3. Import MUI components individually
4. Keep components small and focused
5. Use TypeScript for larger projects
6. Test on multiple devices
7. Monitor bundle size
8. Use React DevTools for debugging

## 🔥 Next Features to Add

- [x] Backend API integration
- [x] Real authentication with JWT
- [ ] Quiz taking functionality
- [ ] Timer for quizzes
- [ ] Score tracking
- [ ] Leaderboard
- [ ] User avatars
- [ ] Email verification
- [ ] Password reset
- [ ] Social login (Google, Facebook)
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Analytics integration
- [ ] PWA features
- [ ] Offline support

## 📝 Code Snippets

### Creating a new page
```javascript
// src/pages/NewPage.js
import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const NewPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4">New Page</Typography>
    </Container>
  );
};

export default NewPage;
```

### Adding a route
```javascript
// src/App.js
const NewPage = React.lazy(() => import('./pages/NewPage'));

// In <Routes>
<Route path="/new" element={<NewPage />} />
```

### Using theme colors
```javascript
<Button 
  sx={{ 
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    '&:hover': {
      bgcolor: 'primary.dark'
    }
  }}
>
  Click Me
</Button>
```

## 🎯 Accessibility Tips

- Use semantic HTML
- Add alt text to images
- Ensure keyboard navigation
- Use ARIA labels where needed
- Maintain color contrast ratios
- Test with screen readers

## 📱 URL Structure

```
Development: http://localhost:3000
Production: https://your-domain.com

Routes:
- /login
- /register
- /dashboard
- /profile
- /quiz-management
```

## 🔒 Security Best Practices

1. Validate all inputs
2. Sanitize user data
3. Use HTTPS in production
4. Implement CSRF protection
5. Store tokens securely
6. Use environment variables
7. Regular dependency updates
8. Implement rate limiting

---

**Happy Coding! 🚀**

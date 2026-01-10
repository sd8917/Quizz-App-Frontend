# Dashboard Views Documentation

## Overview
The Quiz App features three distinct dashboard views tailored to different user roles: **User**, **Creator**, and **Admin**. Each view displays relevant information and actions specific to that role.

## 🎯 Role-Based Views

### 1. **User Dashboard** (Regular User View)

#### Purpose
For learners who want to take quizzes, track their progress, and compete with others.

#### Key Features:
- **Statistics Cards**:
  - Quizzes Taken: Total number of quizzes completed
  - Highest Score: Best score achieved
  - Average Score: Mean score across all quizzes
  - Global Rank: Position on the leaderboard

- **Available Quizzes Section**:
  - Browse all available quizzes
  - View quiz details (questions count, difficulty, time limit, category)
  - Quick "Start Quiz" action button
  - Color-coded difficulty levels (Easy=Green, Medium=Yellow, Hard=Red)

- **Recent Activity**:
  - Last 3 completed quizzes
  - Score for each quiz
  - Progress bars showing performance
  - Completion dates

#### Navigation Menu:
- Profile
- Leaderboard
- Logout

---

### 2. **Creator Dashboard** (Content Creator View)

#### Purpose
For users who create quizzes and want to track their content's performance.

#### Key Features:
- **Statistics Cards**:
  - Quizzes Created: Total number of quizzes authored
  - Total Attempts: How many times users have taken their quizzes
  - Average Rating: User satisfaction rating (out of 5 stars)
  - Active Users: Number of users engaging with their content

- **Quiz Performance Section**:
  - List of created quizzes
  - Performance metrics for each quiz:
    - Total attempts
    - Average score
    - User rating
  - Quick actions: View Analytics, Edit Quiz

- **Quick Actions**:
  - **Create New Quiz Channel**: Design new quiz channel content
  - **View Analytics**: Track detailed performance metrics
  - **Community**: See user engagement and feedback

#### Navigation Menu:
- Profile
- Quiz Management (Create/Edit quizzes)
- Leaderboard
- Logout

---

### 3. **Admin Dashboard** (Administrator View)

#### Purpose
For platform administrators who need to monitor overall system performance and manage users.

#### Key Features:
- **Statistics Cards**:
  - Total Users: Platform-wide user count
  - Total Quizzes: All quizzes in the system
  - Active Today: Users active in the last 24 hours
  - Completion Rate: Percentage of started quizzes that are completed

- **Available Quizzes Section**:
  - Quick overview of popular quizzes
  - Monitor quiz availability and status

- **Quick Actions**:
  - **Leaderboard**: View top performers
  - **User Management**: Manage users, roles, and permissions
  - **Quiz Management**: Oversee all platform quizzes

#### Navigation Menu:
- Profile
- Quiz Management (Admin access)
- Leaderboard
- User Management (Admin only)
- Logout

---

## 🎨 Visual Differences

### Role Badge
Each dashboard displays a role badge in the app bar:
- **USER**: Blue/Primary color
- **CREATOR**: Orange/Warning color  
- **ADMIN**: Red/Error color

### Welcome Messages
- User: "Welcome back, User! 👋"
- Creator: "Welcome back, Creator! 🎨"
- Admin: "Welcome back, Admin! 👨‍💼"

### Subtitle Text
- User: "Continue your learning journey and compete with others"
- Creator: "Track your quiz performance and create new content"
- Admin: "Manage your platform and monitor performance"

---

## 🔄 Demo Mode (Development Only)

The current implementation includes a **Role Switcher** at the top of the dashboard that allows you to switch between roles instantly. This is for demonstration purposes and should be removed in production.

**To test different views:**
1. Click on "USER", "CREATOR", or "ADMIN" toggle buttons
2. The dashboard will instantly update to show that role's view

---

## 🔐 Production Implementation

In a production environment:

1. **Remove the Role Switcher**:
   ```javascript
   // Remove the Paper component with ToggleButtonGroup
   ```

2. **Get user role from authentication**:
   ```javascript
   // Instead of:
   const [userRole, setUserRole] = useState('admin');
   
   // Use:
   const { user } = useAuth(); // From your auth context
   const userRole = user.role; // 'user', 'creator', or 'admin'
   ```

3. **Add route protection**:
   - Use ProtectedRoute component
   - Verify role permissions server-side
   - Redirect unauthorized users

---

## 📊 Data Flow

### User View
```
User Login → Fetch user stats → Display personal quizzes → Show recent activity
```

### Creator View
```
Creator Login → Fetch created quizzes → Get performance metrics → Display analytics
```

### Admin View
```
Admin Login → Fetch platform stats → Display system overview → Show management tools
```

---

## 🎯 Use Cases

### User Scenario:
*"Sarah is a student who wants to test her knowledge and improve her ranking."*
- Views available quizzes
- Sees her progress and recent scores
- Competes on the leaderboard

### Creator Scenario:
*"Mike is a teacher who creates educational quizzes for students."*
- Monitors how students perform on his quizzes
- Sees which quizzes are most popular
- Gets feedback through ratings

### Admin Scenario:
*"Alex manages the platform and ensures quality content."*
- Monitors overall platform health
- Manages users and their permissions
- Oversees all quiz content

---

## 🚀 Future Enhancements

1. **User Dashboard**:
   - Achievements and badges
   - Recommended quizzes based on interests
   - Friends and social features

2. **Creator Dashboard**:
   - Detailed analytics graphs
   - Revenue tracking (if monetized)
   - A/B testing for quiz versions

3. **Admin Dashboard**:
   - Real-time monitoring charts
   - Content moderation queue
   - System health metrics
   - Report generation

---

## 🛠️ Technical Details

### File Location
`src/pages/Dashboard.js`

### Dependencies
- Material-UI components
- React Router for navigation
- Role-based conditional rendering

### State Management
```javascript
const [userRole, setUserRole] = useState('admin');
```

### Role Detection Logic
```javascript
const stats = userRole === 'admin' ? adminStats 
            : userRole === 'creator' ? creatorStats 
            : userStats;
```

---

## 📝 Summary

The role-based dashboard system provides tailored experiences for different user types:

| Feature | User | Creator | Admin |
|---------|------|---------|-------|
| Take Quizzes | ✅ | ❌ | ✅ |
| Create QuizzesChannel | ❌ | ✅ | ✅
| View Analytics | Personal Only | Own Quizzes | All |
| Manage Users | ❌ | ❌ | ✅ |
| Platform Stats | ❌ | Limited | ✅ |

This approach ensures each user sees only the information and actions relevant to their role, improving usability and security.

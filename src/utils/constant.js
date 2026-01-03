import {
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Public as PublicIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

// FAQ for Landing Page
export const faqs = [
    {
      question: 'Is TriviaVerse really free to use?',
      answer: 'Yes! TriviaVerse is completely free to use. You can take unlimited quizzes, create your own, and compete on leaderboards without any charges.',
    },
    {
      question: 'Can I create my own quizzes?',
      answer: 'Absolutely! Once you register, you can become a creator and design custom quizzes with your own questions, time limits, and difficulty levels.',
    },
    {
      question: 'How does the leaderboard work?',
      answer: 'Your performance on each quiz contributes to your overall score. Points are awarded based on accuracy, speed, and difficulty. The leaderboard updates in real-time.',
    },
    {
      question: 'Can I use TriviaVerse for my classroom or business?',
      answer: 'Yes! TriviaVerse is perfect for educational institutions and businesses. You can create private quizzes, track student/employee progress, and generate reports.',
    },
    {
      question: 'What types of quizzes are available?',
      answer: 'We offer quizzes in various categories including Technology, Science, History, Languages, Business, Entertainment, and more. New quizzes are added daily!',
    },
];

// Statistics for Landing Page
export const stats = [
    { number: '1M+', label: 'Active Users', icon: <PeopleIcon /> },
    { number: '50K+', label: 'Quizzes Created', icon: <QuizIcon /> },
    { number: '10M+', label: 'Tests Taken', icon: <AssessmentIcon /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <StarIcon /> },
];
// Testimonials for Landing Page
export const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Student',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      comment: 'This platform helped me ace my certification exam! The practice quizzes were spot-on and the explanations were clear.',
    },
    {
      name: 'Michael Chen',
      role: 'Corporate Trainer',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      comment: 'We use this for employee training and the results have been fantastic. Easy to create custom quizzes and track progress.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Quiz Enthusiast',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      comment: 'Addictive and fun! I love competing with my friends on the leaderboard. The variety of topics is impressive.',
    },
];

  // How it works steps
export const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your free account in seconds. No credit card required.',
      icon: <CheckIcon />,
      color: '#6366f1',
    },
    {
      number: '02',
      title: 'Choose a Quiz',
      description: 'Browse our extensive library and select a quiz that interests you.',
      icon: <QuizIcon />,
      color: '#10b981',
    },
    {
      number: '03',
      title: 'Take the Test',
      description: 'Answer questions within the time limit. Use hints if you need help.',
      icon: <TimerIcon />,
      color: '#f59e0b',
    },
    {
      number: '04',
      title: 'Get Results',
      description: 'Receive instant feedback with detailed analytics and explanations.',
      icon: <AssessmentIcon />,
      color: '#ec4899',
    },
    {
      number: '05',
      title: 'Track Progress',
      description: 'Monitor your improvement over time and compete on leaderboards.',
      icon: <TrendingIcon />,
      color: '#8b5cf6',
    },
];

  // Features data
export const features = [
    {
      icon: <QuizIcon sx={{ fontSize: 48 }} />,
      title: 'Diverse Quiz Library',
      description: 'Access thousands of quizzes across multiple categories and difficulty levels',
      color: '#6366f1',
    },
    {
      icon: <TrophyIcon sx={{ fontSize: 48 }} />,
      title: 'Real-time Leaderboards',
      description: 'Compete with players worldwide and climb the rankings',
      color: '#f59e0b',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Instant Results',
      description: 'Get immediate feedback and detailed performance analytics',
      color: '#10b981',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with comprehensive statistics',
      color: '#ec4899',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Secure & Fair',
      description: 'Anti-cheating measures ensure a level playing field',
      color: '#8b5cf6',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      title: 'Community Driven',
      description: 'Join millions of learners and creators worldwide',
      color: '#06b6d4',
    },
];

// Services/Use Cases
export const services = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Education',
      description: 'Perfect for students preparing for exams, certifications, or just learning new topics',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      title: 'Corporate Training',
      description: 'Assess employee knowledge and conduct training programs efficiently',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    },
    {
      icon: <PublicIcon sx={{ fontSize: 40 }} />,
      title: 'Entertainment',
      description: 'Challenge friends with fun trivia and general knowledge quizzes',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    },
];

  // Palette for channel cards (used when channel.color not provided)
export const channelColors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#06b6d4', '#8b5cf6'];



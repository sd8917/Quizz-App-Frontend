# 🚀 React Profiler & Performance Debugging Guide

## What You Have

### 1. **Performance Monitoring Hooks** (`src/utils/performanceHook.js`)
- `usePerformanceMetrics()` - Track component render time
- `useApiPerformance()` - Measure API call duration
- `useLifecycleLogger()` - Log mount/unmount
- `observeLongTasks()` - Detect tasks blocking UI (>50ms)
- `logCoreWebVitals()` - Track LCP, FID, CLS
- `getAllPerformanceMetrics()` - Get complete page metrics

### 2. **React Profiler Component** (`src/components/RenderProfiler.js`)
- Wraps components to measure render phases
- Logs render duration and base duration
- Identifies slow renders (> 50ms by default)
- Shows interaction details

### 3. **Performance Dashboard** (`src/components/PerformanceDashboard.js`)
- Live performance metrics UI
- Shows DNS, TCP, TTFB, Download times
- Memory usage monitoring
- Paint timing (FP, FCP)
- Toggle with **Ctrl+Shift+P**

### 4. **Web Worker** (`public/workers/dataProcessor.worker.js`)
- Offload heavy tasks to background thread
- Scoring, filtering, sorting, CSV parsing
- Zero UI blocking

### 5. **useWebWorker Hook** (`src/hooks/useWebWorker.js`)
- Easy integration of worker tasks
- Pre-built methods for common tasks
- Automatic task ID management

---

## 🎯 How to Use

### Option 1: Monitor Specific Component

```javascript
import { usePerformanceMetrics } from '../utils/performanceHook';

function MyComponent() {
  const { renderCount, logCustomMetric } = usePerformanceMetrics('MyComponent', []);
  
  useEffect(() => {
    logCustomMetric('Data fetched', 150); // Logs: 📊 [MyComponent] Data fetched: 150
  }, [logCustomMetric]);

  return <div>Component renders: {renderCount}</div>;
}
```

### Option 2: Wrap Component with Profiler

```javascript
import RenderProfiler from '../components/RenderProfiler';

export default function Page() {
  return (
    <RenderProfiler id="MyPage" logSlowRenders={50}>
      <div>Page content</div>
    </RenderProfiler>
  );
}
```

**Console Output:**
```
📊 React Profiler: MyPage
Phase: mount
Actual duration: 25.50ms
Base duration: 85.20ms
Start time: 100.00ms
Commit time: 150.20ms
```

### Option 3: Track API Performance

```javascript
import { useApiPerformance } from '../utils/performanceHook';

function DataComponent() {
  const { measureApi } = useApiPerformance('FetchQuizzes');

  const loadData = async () => {
    const result = await measureApi(async () => {
      const response = await fetch('/api/quizzes');
      return response.json();
    });
  };

  return <button onClick={loadData}>Load Data</button>;
}
```

**Console Output:**
```
⏱️  [API] FetchQuizzes completed in 245.50ms
```

### Option 4: Use Web Worker for Heavy Tasks

```javascript
import { useWebWorker } from '../hooks/useWebWorker';

function LeaderboardPage() {
  const { calculateLeaderboard } = useWebWorker();
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    // This runs in background thread, UI stays responsive!
    calculateLeaderboard(users, 'totalScore')
      .then(result => {
        console.log('✅ Leaderboard calculated:', result);
        setRanking(result.leaderboard);
      })
      .catch(error => console.error('❌ Error:', error));
  }, [users, calculateLeaderboard]);

  return <div>{/* Render leaderboard */}</div>;
}
```

### Option 5: View Performance Dashboard

**In development mode**, press **Ctrl+Shift+P** to toggle the dashboard:

```
📊 Performance Dashboard
├── Navigation Timing
│   ├── DNS: 25ms
│   ├── TCP: 15ms
│   ├── TTFB: 85ms
│   └── Download: 200ms
├── Page Timing
│   ├── DOM Interactive: 1250ms
│   ├── DCL: 1300ms
│   └── Load: 1500ms
├── Paint Timing
│   ├── FP: 450ms
│   └── FCP: 520ms
└── Memory
    ├── Used: 45.32MB
    ├── Total: 60.50MB
    └── Limit: 512.00MB
```

---

## 📊 Console Commands (DevTools)

When the app loads, you can access:

```javascript
// View all performance metrics
window.__PERFORMANCE__.getMetrics()

// Log metrics as table
window.__PERFORMANCE__.logMetrics()

// Example output:
// {
//   dns: 25,
//   tcp: 15,
//   ttfb: 85,
//   download: 200,
//   domInteractive: 1250,
//   domContentLoaded: 1300,
//   loadComplete: 1500,
//   firstPaint: 450,
//   firstContentfulPaint: 520,
//   memory: {
//     usedJSHeapSize: "45.32MB",
//     totalJSHeapSize: "60.50MB",
//     jsHeapSizeLimit: "512.00MB"
//   }
// }
```

---

## 🎯 Web Worker Examples

### Example 1: Calculate Quiz Score

```javascript
const { calculateScore } = useWebWorker();

const answers = [
  { selectedOption: 'A' },
  { selectedOption: 'B' },
  { selectedOption: 'C' }
];

const questions = [
  { id: 1, correctAnswer: 'A', points: 10 },
  { id: 2, correctAnswer: 'B', points: 10 },
  { id: 3, correctAnswer: 'D', points: 10 }
];

const result = await calculateScore(answers, questions);
// Returns: { totalScore: 20, percentage: 66.67, details: [...] }
```

### Example 2: Filter Large Quiz List

```javascript
const { filterQuizzes } = useWebWorker();

const result = await filterQuizzes(
  largeQuizList,
  'javascript', // search term
  {
    category: 'programming',
    difficulty: 'intermediate',
    sortBy: 'popularity'
  }
);
// Returns: { results: [...], count: 45, originalCount: 1000 }
```

### Example 3: Sort Leaderboard

```javascript
const { calculateLeaderboard } = useWebWorker();

const result = await calculateLeaderboard(
  users,
  'totalScore'
);
// Returns sorted users with rank and percentile
```

### Example 4: Parse CSV

```javascript
const { parseCSV } = useWebWorker();

const result = await parseCSV(csvText, true); // true = has header
// Returns: { data: [...], rowCount: 500, columnCount: 5 }
```

---

## 📈 Performance Tips

### ✅ DO:
- Wrap heavy computations with `useWebWorker()`
- Profile routes before/after using `RenderProfiler`
- Check memory usage regularly
- Monitor Long Tasks (> 50ms blocks UI)
- Use `usePerformanceMetrics` on expensive components

### ❌ DON'T:
- Don't process large datasets on main thread
- Don't ignore slow API calls (> 1s)
- Don't render thousands of items without virtualization
- Don't create workers for trivial tasks (overhead > benefit)

---

## 🔍 Real-World Scenario

**Leaderboard page is slow:**

```javascript
// BEFORE (blocking UI):
function Leaderboard() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const sorted = users.sort((a, b) => b.score - a.score); // Blocks UI!
    setUsers(sorted);
  }, [users]);
}

// AFTER (non-blocking):
function Leaderboard() {
  const { calculateLeaderboard } = useWebWorker();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    calculateLeaderboard(users)
      .then(result => setRanking(result.leaderboard));
  }, [users, calculateLeaderboard]);
}
```

---

## 📊 Debugging Checklist

- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Check for ⚠️  warnings about slow renders
- [ ] Press Ctrl+Shift+P to open Performance Dashboard
- [ ] Run `window.__PERFORMANCE__.logMetrics()` in console
- [ ] Check Network tab for slow API calls
- [ ] Check Memory tab for memory leaks
- [ ] Use React DevTools Profiler to find re-render issues

---

## 🚀 Next Steps

1. **Profile your slowest pages** - Use RenderProfiler
2. **Identify heavy tasks** - Check for > 50ms operations
3. **Move to workers** - Use useWebWorker for sorting, filtering, scoring
4. **Monitor in production** - Consider sending metrics to analytics service

Your app is now instrumented for performance debugging! 🎯

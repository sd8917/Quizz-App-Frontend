/**
 * IndexedDB utility for offline quiz storage
 * Handles storing and retrieving quiz answers when offline
 */

const DB_NAME = 'QuizAppDB';
const DB_VERSION = 1;
const QUIZ_ANSWERS_STORE = 'quizAnswers';

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store for quiz answers
      if (!db.objectStoreNames.contains(QUIZ_ANSWERS_STORE)) {
        const store = db.createObjectStore(QUIZ_ANSWERS_STORE, { keyPath: 'id' });
        store.createIndex('channelId', 'channelId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Store quiz answers for offline submission
export const storeQuizAnswers = async (channelId, answers, quizData = {}) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([QUIZ_ANSWERS_STORE], 'readwrite');
    const store = transaction.objectStore(QUIZ_ANSWERS_STORE);

    const quizEntry = {
      id: `${channelId}_${Date.now()}`, // Unique ID combining channelId and timestamp
      channelId,
      answers,
      quizData,
      timestamp: Date.now(),
      status: 'pending', // pending, submitted, failed
    };

    await new Promise((resolve, reject) => {
      const request = store.add(quizEntry);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    db.close();
    return quizEntry.id;
  } catch (error) {
    console.error('Error storing quiz answers:', error);
    throw error;
  }
};

// Retrieve pending quiz submissions
export const getPendingSubmissions = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([QUIZ_ANSWERS_STORE], 'readonly');
    const store = transaction.objectStore(QUIZ_ANSWERS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const submissions = request.result.filter(item => item.status === 'pending');
        resolve(submissions);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error retrieving pending submissions:', error);
    throw error;
  }
};

// Update submission status
export const updateSubmissionStatus = async (submissionId, status) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([QUIZ_ANSWERS_STORE], 'readwrite');
    const store = transaction.objectStore(QUIZ_ANSWERS_STORE);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(submissionId);
      getRequest.onsuccess = () => {
        const submission = getRequest.result;
        if (submission) {
          submission.status = status;
          const updateRequest = store.put(submission);
          updateRequest.onsuccess = () => resolve(updateRequest.result);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Submission not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    throw error;
  }
};

// Delete submission after successful upload
export const deleteSubmission = async (submissionId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([QUIZ_ANSWERS_STORE], 'readwrite');
    const store = transaction.objectStore(QUIZ_ANSWERS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(submissionId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
};

// Check if user has pending submissions for a specific channel
export const hasPendingSubmission = async (channelId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([QUIZ_ANSWERS_STORE], 'readonly');
    const store = transaction.objectStore(QUIZ_ANSWERS_STORE);
    const index = store.index('channelId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(channelId);
      request.onsuccess = () => {
        const submissions = request.result.filter(item => item.status === 'pending');
        resolve(submissions.length > 0);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error checking pending submissions:', error);
    throw error;
  }
};

// Clear all data (for testing or reset)
export const clearAllData = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([QUIZ_ANSWERS_STORE], 'readwrite');
    const store = transaction.objectStore(QUIZ_ANSWERS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

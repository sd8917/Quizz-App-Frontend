import { useState, useEffect, useCallback } from 'react';
import quizService from '../services/quizService';

/**
 * Custom hook for managing offline quiz functionality
 * Handles online/offline detection, pending submissions, and automatic processing
 */
const useOfflineQuiz = (quizId) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingSubmission, setHasPendingSubmission] = useState(false);
  const [offlineSnackbar, setOfflineSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Check for pending submissions
  const checkPendingSubmissions = useCallback(async () => {
    if (quizId) {
      try {
        const hasPending = await quizService.hasPendingSubmissions(quizId);
        setHasPendingSubmission(hasPending);
      } catch (error) {
        console.error('Error checking pending submissions:', error);
      }
    }
  }, [quizId]);

  // Process pending submissions when back online
  const processPendingSubmissions = useCallback(async () => {
    try {
      const results = await quizService.processPendingSubmissions();
      if (results.length > 0) {
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        if (successCount > 0) {
          setOfflineSnackbar({
            open: true,
            message: `Successfully submitted ${successCount} quiz(es) that were pending offline.`,
            severity: 'success'
          });
        }
        if (failCount > 0) {
          setOfflineSnackbar({
            open: true,
            message: `${failCount} submission(s) failed. Please try again.`,
            severity: 'warning'
          });
        }
      }
    } catch (error) {
      console.error('Error processing pending submissions:', error);
      setOfflineSnackbar({
        open: true,
        message: 'Failed to process pending submissions. Please try submitting manually.',
        severity: 'error'
      });
    }
  }, []);

  // Handle going online
  const handleOnline = useCallback(async () => {
    setIsOnline(true);
    setOfflineSnackbar({
      open: true,
      message: 'You are back online! Processing any pending submissions...',
      severity: 'success'
    });

    // Process pending submissions
    await processPendingSubmissions();

    // Check if current quiz has pending submission
    if (quizId) {
      const hasPending = await quizService.hasPendingSubmissions(quizId);
      setHasPendingSubmission(hasPending);
    }
  }, [quizId, processPendingSubmissions]);

  // Handle going offline
  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setOfflineSnackbar({
      open: true,
      message: 'You are offline. Quiz answers will be stored locally and submitted when you are back online.',
      severity: 'warning'
    });
  }, []);

  // Set up online/offline event listeners
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Check for pending submissions on mount and when quizId changes
  useEffect(() => {
    checkPendingSubmissions();
  }, [checkPendingSubmissions]);

  // Submit quiz with offline support
  const submitQuiz = useCallback(async (answers, onSuccess, onError) => {
    try {
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, answerIndex]) => ({
        questionId: questionId,
        selectedOption: answerIndex !== undefined ? answerIndex.toString() : ''
      }));

      // Try to submit to API
      const response = await quizService.submitQuiz(quizId, formattedAnswers);

      // Success callback
      if (onSuccess) {
        onSuccess(response);
      }

      return { success: true, data: response };
    } catch (error) {
      console.error('Error submitting quiz:', error);

      // Check if it's a network error (offline)
      if (!navigator.onLine || error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
        try {
          // Store in IndexedDB for offline submission
          const formattedAnswers = Object.entries(answers).map(([questionId, answerIndex]) => ({
            questionId: questionId,
            selectedOption: answerIndex !== undefined ? answerIndex.toString() : ''
          }));

          await quizService.storeQuizAnswers(quizId, formattedAnswers);

          setOfflineSnackbar({
            open: true,
            message: 'Quiz answers saved offline. They will be submitted when you are back online.',
            severity: 'info'
          });

          setHasPendingSubmission(true);

          return { success: true, offline: true };
        } catch (storageError) {
          console.error('Error storing quiz offline:', storageError);
          setOfflineSnackbar({
            open: true,
            message: 'Failed to save quiz answers offline. Please try again when online.',
            severity: 'error'
          });

          if (onError) {
            onError(storageError);
          }

          return { success: false, error: storageError };
        }
      } else {
        // Other error (not network related)
        if (onError) {
          onError(error);
        }

        return { success: false, error };
      }
    }
  }, [quizId]);

  // Close snackbar
  const closeSnackbar = useCallback(() => {
    setOfflineSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    isOnline,
    hasPendingSubmission,
    offlineSnackbar,
    submitQuiz,
    closeSnackbar,
    checkPendingSubmissions
  };
};

export default useOfflineQuiz;

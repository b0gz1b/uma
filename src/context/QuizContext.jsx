import { createContext, useContext, useState, useEffect } from "react";

// Create context
const QuizContext = createContext();

// Create provider component
export function QuizProvider({ children }) {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participantName, setParticipantName] = useState("");

  // Load quiz data on app start
  useEffect(() => {
    loadQuizzes();
  }, []);
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/quizzes");
      if (!response.ok) {
        throw new Error("Failed to load quizzes");
      }
      const data = await response.json();

      // Transform backend data to match frontend structure
      const quizzesArray = data.map((quiz) => ({
        metadata: {
          id: quiz.metadata.id,
          title: quiz.metadata.title,
          author: quiz.metadata.author,
          category: quiz.metadata.category,
          difficulty: quiz.metadata.difficulty,
          description: quiz.metadata.description,
          nb_questions: quiz.metadata.nb_questions,
        },
        questions: quiz.questions || [],
      }));

      setQuizzes(quizzesArray);
      setError(null);
    } catch (err) {
      console.error("Error loading quizzes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const selectQuiz = async (quizId) => {
    try {
      // Fetch full quiz with questions from API
      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to load quiz");
      }
      const quizData = await response.json();

      // Transform backend data
      const quiz = {
        metadata: {
          id: quizData.metadata.id,
          title: quizData.metadata.title,
          author: quizData.metadata.author,
          category: quizData.metadata.category,
          difficulty: quizData.metadata.difficulty,
          description: quizData.metadata.description,
          nb_questions: quizData.metadata.nb_questions,
        },
        questions: quizData.questions || [],
      };

      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
    } catch (err) {
      setError(err.message);
    }
  };

  const submitAnswer = (questionId, answer) => {
    if (!currentQuiz) return;

    const question = currentQuiz.questions.find((q) => q.id === questionId);
    if (!question) return;

    // Check if answer is correct
    const isCorrect = question.acceptableAnswers.some(
      (acceptable) => acceptable.toLowerCase() === answer.toLowerCase(),
    );

    // Calculate points (full points for now, can add time-based deduction later)
    const maxPoints = question.questionSegments.reduce(
      (sum, seg) => sum + seg.points,
      0,
    );
    const pointsEarned = isCorrect ? maxPoints : 0;

    // Store answer
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        answer,
        isCorrect,
        pointsEarned,
        timestamp: new Date().toISOString(),
      },
    });

    return { isCorrect, pointsEarned };
  };

  const moveToNextQuestion = () => {
    if (
      currentQuiz &&
      currentQuestionIndex < currentQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return true;
    }
    return false;
  };

  const getCurrentQuestion = () => {
    if (currentQuiz && currentQuiz.questions[currentQuestionIndex]) {
      return currentQuiz.questions[currentQuestionIndex];
    }
    return null;
  };

  const getQuizResults = () => {
    if (!currentQuiz) return null;

    const totalScore = Object.values(userAnswers).reduce(
      (sum, answer) => sum + answer.pointsEarned,
      0,
    );

    const totalPoints = currentQuiz.questions.reduce(
      (sum, question) =>
        sum + question.questionSegments.reduce((s, seg) => s + seg.points, 0),
      0,
    );

    const correctAnswers = Object.values(userAnswers).filter(
      (answer) => answer.isCorrect,
    ).length;

    return {
      quizId: currentQuiz.metadata.id,
      quizTitle: currentQuiz.metadata.title,
      participantName,
      totalScore,
      totalPoints,
      questionsAnswered: Object.keys(userAnswers).length,
      totalQuestions: currentQuiz.questions.length,
      correctAnswers,
      userAnswers,
      completedAt: new Date().toISOString(),
    };
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setParticipantName("");
  };
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const startQuizSession = async (quizId, participantName) => {
    try {
      const response = await fetch("http://localhost:5000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, participantName }),
      });
      if (!response.ok) throw new Error("Failed to start session");
      const session = await response.json();
      setCurrentSessionId(session.id);
      return session.id;
    } catch (err) {
      console.error("Error starting session:", err);
      setError(err.message);
      return null;
    }
  };

  const submitAnswerToBackend = async (questionId, answer) => {
    if (!currentSessionId) return { isCorrect: false, pointsEarned: 0 };

    try {
      // First check answer locally
      const result = submitAnswer(questionId, answer);

      // Then save to backend
      const response = await fetch(
        `http://localhost:5000/api/sessions/${currentSessionId}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId,
            userAnswer: answer,
            isCorrect: result.isCorrect,
            pointsEarned: result.pointsEarned,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to submit answer");
      return result;
    } catch (err) {
      console.error("Error submitting answer:", err);
      return { isCorrect: false, pointsEarned: 0 };
    }
  };

  const completeQuizSession = async (totalScore) => {
    if (!currentSessionId) return null;

    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${currentSessionId}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totalScore }),
        },
      );

      if (!response.ok) throw new Error("Failed to complete session");
      const session = await response.json();
      return session;
    } catch (err) {
      console.error("Error completing session:", err);
      return null;
    }
  };

  const getSessionResults = async () => {
    if (!currentSessionId) return null;

    try {
      const response = await fetch(
        `http://localhost:5000/api/sessions/${currentSessionId}/results`,
      );
      if (!response.ok) throw new Error("Failed to fetch results");
      return await response.json();
    } catch (err) {
      console.error("Error fetching results:", err);
      return null;
    }
  };

  const value = {
    // State
    quizzes,
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    loading,
    error,
    participantName,
    currentSessionId,

    // Actions
    loadQuizzes,
    selectQuiz,
    submitAnswer,
    submitAnswerToBackend,
    moveToNextQuestion,
    getCurrentQuestion,
    getQuizResults,
    resetQuiz,
    setParticipantName,
    startQuizSession,
    completeQuizSession,
    getSessionResults,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// Custom hook to use context
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
}

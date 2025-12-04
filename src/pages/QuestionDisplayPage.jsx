import {
  Container,
  Button,
  Card,
  Grid,
  Flex,
  Badge,
  TextInput,
  QuestionDisplay,
  ScoreDisplay,
} from "@components/index";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "@context/QuizContext";

export default function QuestionDisplayPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const {
    quizzes,
    selectQuiz,
    currentQuiz,
    currentQuestionIndex,
    submitAnswerToBackend,
    moveToNextQuestion,
    getCurrentQuestion,
    participantName,
    userAnswers,
    completeQuizSession,
  } = useQuiz();

  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);

  // Load quiz when component mounts or quizId changes
  useEffect(() => {
    const loadQuiz = async () => {
      const quiz = quizzes.find((q) => q.metadata.id === parseInt(quizId));
      if (quiz) {
        await selectQuiz(quiz.metadata.id);
      }
    };
    loadQuiz();
  }, [quizId, quizzes]);

  const currentQuestion = getCurrentQuestion();
  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    const result = await submitAnswerToBackend(
      currentQuestion.id,
      userAnswer || "NO_ANSWER",
    );
    setShowAnswerReview(true);
  };
  // Timer countdown
  useEffect(() => {
    if (showAnswerReview || quizComplete || !currentQuestion) return;

    setTimeRemaining(currentQuestion.timeLimit || 30);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitAnswer();
          return currentQuestion.timeLimit || 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const handleNextQuestion = () => {
    if (!currentQuiz) return;

    if (moveToNextQuestion()) {
      setShowAnswerReview(false);
      setUserAnswer("");
    } else {
      setQuizComplete(true);
    }
  };

  if (!currentQuiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center">
            <p className="text-lg text-gray-600">Loading quiz...</p>
          </Card>
        </Container>
      </div>
    );
  }
  const handleQuizComplete = async () => {
    const totalScore = Object.values(userAnswers).reduce(
      (sum, answer) => sum + answer.pointsEarned,
      0,
    );

    await completeQuizSession(totalScore);
    setQuizComplete(true);
  };
  if (quizComplete) {
    const totalScore = Object.values(userAnswers).reduce(
      (sum, answer) => sum + answer.pointsEarned,
      0,
    );
    const correctAnswers = Object.values(userAnswers).filter(
      (answer) => answer.isCorrect,
    ).length;
    const maxPoints = currentQuiz.questions.reduce(
      (sum, q) =>
        sum + q.questionSegments.reduce((s, seg) => s + seg.points, 0),
      0,
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container size="md" className="py-12">
          <ScoreDisplay
            score={totalScore}
            totalPoints={maxPoints}
            questionsAnswered={currentQuiz.questions.length}
            totalQuestions={currentQuiz.questions.length}
            correctAnswers={correctAnswers}
          />

          <div className="mt-8 text-center">
            <Button
              size="lg"
              onClick={() => navigate(`/results/${quizId}`)}
              className="mr-4"
            >
              View Full Results
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const currentAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="lg" className="py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of{" "}
              {currentQuiz.questions.length}
            </span>
            <span
              className={`text-sm font-bold ${timeRemaining <= 5 ? "text-red-600" : "text-gray-700"
                }`}
            >
              ⏱️ {timeRemaining}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Grid cols={3} gap="lg">
          {/* Question Display */}
          <div className="col-span-2">
            
            <QuestionDisplay question={currentQuestion } mode="all" />
          </div>

          {/* Sidebar */}
          <div className="col-span-1">
            {/* Stats Card */}
            <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-bold text-gray-900 mb-4">Quiz Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Participant</p>
                  <p className="text-lg font-bold text-blue-600 truncate">
                    {participantName || "Anonymous"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Current Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Object.values(userAnswers).reduce(
                      (sum, a) => sum + a.pointsEarned,
                      0,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      Object.values(userAnswers).filter((a) => a.isCorrect)
                        .length
                    }
                    /{Object.keys(userAnswers).length}
                  </p>
                </div>
              </div>
            </Card>

            {/* Answer Form */}
            {!showAnswerReview ? (
              <Card>
                <h3 className="font-bold text-gray-900 mb-4">Your Answer</h3>
                <TextInput
                  placeholder="Type your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="mb-4"
                />
                <Button
                  variant="primary"
                  fullWidth
                  disabled={!userAnswer.trim()}
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer
                </Button>
              </Card>
            ) : (
              <Card
                className={
                  currentAnswer?.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }
              >
                <div className="text-center mb-4">
                  <p className="text-4xl mb-2">
                    {currentAnswer?.isCorrect ? "✅" : "❌"}
                  </p>
                  <p className="font-bold text-gray-900">
                    {currentAnswer?.isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Correct Answer:</strong>{" "}
                  {currentQuestion.correctAnswer}
                </p>
                {!currentAnswer?.isCorrect && (
                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Your Answer:</strong> {currentAnswer?.answer}
                  </p>
                )}
                <p className="text-sm font-bold text-green-600 mb-4">
                  +{currentAnswer?.pointsEarned} points
                </p>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    if (
                      currentQuestionIndex <
                      currentQuiz.questions.length - 1
                    ) {
                      handleNextQuestion();
                    } else {
                      handleQuizComplete();
                    }
                  }}
                >
                  {currentQuestionIndex < currentQuiz.questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </Button>
              </Card>
            )}
          </div>
        </Grid>
      </Container>
    </div>
  );
}

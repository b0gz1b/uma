import {
  Container,
  Button,
  Card,
  Grid,
  Flex,
  Badge,
  ScoreDisplay,
} from "@components/index";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "@context/QuizContext";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { getQuizResults, getSessionResults } = useQuiz();
  const [showDetails, setShowDetails] = useState(false);

  const quizResults = getQuizResults();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const backendResults = await getSessionResults();
      if (backendResults) {
        setResults(backendResults);
      }
    };

    fetchResults();
  }, []);

  // Then use results || quizResults as fallback
  const displayResults = results || quizResults;
  if (!quizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center">
            <p className="text-lg text-gray-600">No results available</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>
          </Card>
        </Container>
      </div>
    );
  }

  const detailedResults = Object.entries(quizResults.userAnswers).map(
    ([questionId, answer]) => {
      const question = quizResults.questions?.find((q) => q.id === questionId);
      return {
        questionId,
        question: question?.title || "Unknown Question",
        userAnswer: answer.answer,
        correctAnswer: question?.correctAnswer || "N/A",
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        maxPoints:
          question?.questionSegments?.reduce((s, seg) => s + seg.points, 0) ||
          0,
        difficulty: question?.difficulty || "medium",
      };
    },
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Container size="lg" className="py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎉 Quiz Complete!
          </h1>
          <p className="text-lg text-gray-600">
            {quizResults.quizTitle} - {quizResults.participantName}
          </p>
        </section>

        {/* Score Display */}
        <section className="mb-12">
          <ScoreDisplay
            score={quizResults.totalScore}
            totalPoints={quizResults.totalPoints}
            questionsAnswered={quizResults.questionsAnswered}
            totalQuestions={quizResults.totalQuestions}
            correctAnswers={quizResults.correctAnswers}
          />
        </section>

        {/* Quiz Info */}
        <Grid cols={2} gap="md" className="mb-12">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {new Date(quizResults.completedAt).toLocaleString()}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Score Percentage</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {Math.round(
                  (quizResults.totalScore / quizResults.totalPoints) * 100,
                )}
                %
              </p>
            </div>
          </Card>
        </Grid>

        {/* Detailed Results */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Detailed Results
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "➖ Hide" : "➕ Show"} Details
            </Button>
          </div>

          {showDetails && (
            <div className="space-y-3">
              {detailedResults.map((result, idx) => (
                <Card
                  key={result.questionId}
                  className={
                    result.isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {result.isCorrect ? "✅" : "❌"}
                        </span>
                        <div>
                          <p className="font-bold text-gray-900">
                            {idx + 1}. {result.question}
                          </p>
                          <Badge
                            variant={result.difficulty}
                            size="sm"
                            className="mt-1"
                          >
                            {result.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm ml-11 space-y-1">
                        <p>
                          <strong>Your Answer:</strong> {result.userAnswer}
                        </p>
                        {!result.isCorrect && (
                          <p>
                            <strong>Correct Answer:</strong>{" "}
                            {result.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Points</p>
                      <p className="text-2xl font-bold">
                        <span className="text-green-600">
                          {result.pointsEarned}
                        </span>
                        <span className="text-gray-400">
                          /{result.maxPoints}
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <Flex justify="center" gap="md" className="mt-12">
          <Button variant="primary" size="lg" onClick={() => navigate("/join")}>
            Take Another Quiz
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </Flex>
      </Container>
    </div>
  );
}

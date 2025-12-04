import {
  Container,
  Button,
  Card,
  Grid,
  Flex,
  Badge,
  TextInput,
} from "@components/index";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@context/QuizContext";

export default function ParticipantJoinPage() {
  const navigate = useNavigate();
  const { quizzes, loading, error, setParticipantName, startQuizSession } = useQuiz();
  const [pseudonym, setPseudonym] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [joinedSuccessfully, setJoinedSuccessfully] = useState(false);
  const handleJoinQuiz = async () => {
    const newErrors = {};

    if (!pseudonym.trim()) {
      newErrors.pseudonym = "Pseudonym is required";
    } else if (pseudonym.length < 3) {
      newErrors.pseudonym = "Pseudonym must be at least 3 characters";
    } else if (pseudonym.length > 20) {
      newErrors.pseudonym = "Pseudonym must not exceed 20 characters";
    }

    if (!selectedQuizId) {
      newErrors.quiz = "Please select a quiz";
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // Store participant name in context
    setParticipantName(pseudonym);

    // Start session on backend
    const sessionId = await startQuizSession(selectedQuizId, pseudonym);

    if (sessionId) {
      setJoinedSuccessfully(true);
      setTimeout(() => {
        navigate(`/quiz/${selectedQuizId}`, {
          state: { participantName: pseudonym, sessionId },
        });
      }, 2000);
    } else {
      setFormErrors({ quiz: "Failed to start quiz session" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center">
            <p className="text-lg text-gray-600">Loading quizzes...</p>
          </Card>
        </Container>
      </div>
    );
  }

  if (joinedSuccessfully) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {pseudonym}!
            </h2>
            <p className="text-gray-600 mb-6">
              Preparing your quiz experience...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Container size="lg" className="py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎯 Join a Quiz
          </h1>
          <p className="text-lg text-gray-600">
            Enter your pseudonym and select a quiz to participate
          </p>
        </section>

        {/* Participant Info */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Information
          </h2>
          <TextInput
            label="Pseudonym"
            placeholder="Enter a pseudonym for this quiz"
            value={pseudonym}
            onChange={(e) => {
              setPseudonym(e.target.value);
              if (formErrors.pseudonym) {
                setFormErrors({ ...formErrors, pseudonym: "" });
              }
            }}
            error={formErrors.pseudonym}
            required
            maxLength={20}
          />
          <p className="text-sm text-gray-500 mt-2">
            {pseudonym.length}/20 characters
          </p>
        </Card>

        {/* Available Quizzes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Quizzes ({quizzes.length})
          </h2>

          {formErrors.quiz && (
            <Card className="mb-6 bg-red-50 border-red-200">
              <p className="text-red-700">{formErrors.quiz}</p>
            </Card>
          )}

          {quizzes.length === 0 ? (
            <Card className="text-center bg-yellow-50 border-yellow-200">
              <p className="text-yellow-700">No quizzes available</p>
            </Card>
          ) : (
            <Grid cols={2} gap="lg">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.metadata.id}
                  hoverable
                  onClick={() => {
                    setSelectedQuizId(quiz.metadata.id);
                    if (formErrors.quiz) {
                      setFormErrors({ ...formErrors, quiz: "" });
                    }
                  }}
                  className={`cursor-pointer transition-all ${selectedQuizId === quiz.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {quiz.metadata.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {quiz.metadata.author || "Quiz Master"}
                      </p>
                    </div>
                    <Flex gap="sm" wrap>
                      <Badge variant={quiz.metadata.difficulty || "medium"}>
                        {quiz.metadata.difficulty || "medium"}
                      </Badge>
                    </Flex>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {quiz.metadata.description || "Test your knowledge"}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Questions</p>
                      <p className="font-bold text-lg text-gray-900">
                        {quiz.questions.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Category</p>
                      <p className="font-bold text-lg text-blue-600">
                        {quiz.metadata.category || "General"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Duration</p>
                      <p className="font-bold text-lg text-green-600">
                        {Math.ceil(
                          quiz.questions.reduce(
                            (sum, q) => sum + (q.timeLimit || 30),
                            0,
                          ) / 60,
                        )}
                        m
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={
                      selectedQuizId === quiz.metadata.id
                        ? "primary"
                        : "outline"
                    }
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuizId(quiz.metadata.id);
                    }}
                  >
                    {selectedQuizId === quiz.metadata.id
                      ? "✅ Selected"
                      : "Select Quiz"}
                  </Button>
                </Card>
              ))}
            </Grid>
          )}
        </section>

        {/* Action Buttons */}
        <Flex justify="center" gap="md" className="mt-12">
          <Button
            variant="primary"
            size="lg"
            onClick={handleJoinQuiz}
            disabled={!selectedQuizId}
          >
            Join Quiz 🚀
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
            Go Back
          </Button>
        </Flex>
      </Container>
    </div>
  );
}

import { Container, Button, Card, Grid, Flex, Badge } from "@components/index";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@context/QuizContext";
export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const { quizzes, loading, error } = useQuiz();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center">
            <p className="text-lg text-gray-600">Loading quizzes...</p>
          </Card>
        </Container>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center bg-red-50 border-red-200">
            <p className="text-lg text-red-700">
              Error loading quizzes: {error}
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Card>
        </Container>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Container size="lg" className="py-12">
        {/* Header Section */}
        <section className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              🎯 Quiz Master
            </h1>
            <p className="text-xl text-gray-600">
              Create engaging quizzes with multimedia content and real-time
              scoring
            </p>
          </div>
        </section>

        {/* Role Selection */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Get Started</h2>
          <Grid cols={2} gap="lg">
            {/* Admin Card */}
            <Card
              hoverable
              onClick={() => setSelectedRole("admin")}
              className={`cursor-pointer transition-all ${selectedRole === "admin"
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
                }`}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">👨‍💼</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Admin Panel
                </h3>
                <p className="text-gray-600 mb-6">
                  Create and manage quiz questions with multimedia content
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-sm text-gray-700">✅ Create questions</li>
                  <li className="text-sm text-gray-700">
                    ✅ Add images & audio
                  </li>
                  <li className="text-sm text-gray-700">✅ Manage segments</li>
                  <li className="text-sm text-gray-700">
                    ✅ Set scoring rules
                  </li>
                </ul>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate("/admin")}
                >
                  Go to Admin
                </Button>
              </div>
            </Card>

            {/* Participant Card */}
            <Card
              hoverable
              onClick={() => setSelectedRole("participant")}
              className={`cursor-pointer transition-all ${selectedRole === "participant"
                  ? "ring-2 ring-green-500 bg-green-50"
                  : ""
                }`}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Join Quiz
                </h3>
                <p className="text-gray-600 mb-6">
                  Answer questions and compete with other participants
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="text-sm text-gray-700">
                    ✅ Join with pseudonym
                  </li>
                  <li className="text-sm text-gray-700">✅ Answer questions</li>
                  <li className="text-sm text-gray-700">✅ Earn points</li>
                  <li className="text-sm text-gray-700">✅ View live scores</li>
                </ul>
                <Button
                  variant="success"
                  fullWidth
                  onClick={() => navigate("/join")}
                >
                  Join Quiz
                </Button>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Available Quizzes */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Available Quizzes ({quizzes.length})
          </h2>

          {quizzes.length === 0 ? (
            <Card className="text-center bg-yellow-50 border-yellow-200">
              <p className="text-yellow-700">No quizzes available yet</p>
            </Card>
          ) : (
            <Grid cols={3} gap="md">
              {quizzes.map((quiz) => (
                <Card key={quiz.metadata.id} hoverable>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {quiz.metadata.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {quiz.metadata.author || "Quiz Master"}
                      </p>
                    </div>
                    <Badge variant={quiz.difficulty || "medium"}>
                      {quiz.metadata.difficulty || "medium"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>📚 Category: {quiz.metadata.category || "General"}</p>
                    <p>📝 Questions: {quiz.questions.length}</p>
                  </div>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate("/join")}
                  >
                    Join Quiz
                  </Button>
                </Card>
              ))}
            </Grid>
          )}
        </section>
      </Container>
    </div>
  );
}

import {
  Container,
  Button,
  Card,
  Grid,
  Flex,
  Badge,
  TextInput,
  QuestionDisplay,
} from "@components/index";
import { useState } from "react";
import { useQuiz } from "@context/QuizContext";

export default function AdminDashboard() {
  const { quizzes, loading, error } = useQuiz();
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes;

  const filteredQuestions =
    selectedQuiz?.questions.filter(
      (q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.category?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center">
            <p className="text-lg text-gray-600">Loading admin panel...</p>
          </Card>
        </Container>
      </div>
    );
  }

  if (error || !selectedQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center bg-red-50 border-red-200">
            <p className="text-lg text-red-700">
              {error || "No quizzes found"}
            </p>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="xl" className="py-8">
        {/* Header */}
        <section className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">
              📋 Admin Dashboard
            </h1>
            <Flex gap="md">
              <Button
                variant="primary"
                onClick={() => setShowNewQuestionForm(!showNewQuestionForm)}
              >
                {showNewQuestionForm ? "❌ Cancel" : "➕ New Question"}
              </Button>
              <Button variant="success">💾 Save Quiz</Button>
            </Flex>
          </div>
        </section>

        {/* Quiz Selection */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">Select Quiz</h2>
          <Grid cols={quizzes.length} gap="md">
            {quizzes.map((quiz) => (
              <Button
                key={quiz.id}
                variant={selectedQuizId === quiz.id ? "primary" : "outline"}
                onClick={() => {
                  setSelectedQuizId(quiz.id);
                  setSelectedQuestion(null);
                  setSearchTerm("");
                }}
              >
                {quiz.title}
              </Button>
            ))}
          </Grid>
        </Card>

        {/* New Question Form */}
        {showNewQuestionForm && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <h3 className="text-xl font-bold mb-4">Create New Question</h3>
            <Grid cols={2} gap="md">
              <TextInput
                label="Question Title"
                placeholder="Enter question title"
                required
              />
              <TextInput label="Category" placeholder="e.g., Geography" />
              <TextInput
                label="Time Limit (seconds)"
                type="number"
                placeholder="30"
              />
              <TextInput label="Difficulty" placeholder="easy, medium, hard" />
            </Grid>
            <div className="mt-4 flex gap-3">
              <Button variant="primary">Create Question</Button>
              <Button
                variant="secondary"
                onClick={() => setShowNewQuestionForm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <Grid cols={3} gap="lg">
          {/* Questions List */}
          <div className="col-span-1">
            <Card>
              <h2 className="text-xl font-bold mb-4">
                Questions ({filteredQuestions.length})
              </h2>

              <TextInput
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedQuestion?.id === question.id
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-100 hover:bg-gray-200 border-2 border-transparent"
                      }`}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {question.order}. {question.title}
                        </p>
                        <Badge
                          variant={question.difficulty}
                          size="sm"
                          className="mt-1"
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                      <Flex gap="sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Delete logic here
                          }}
                        >
                          🗑️
                        </Button>
                      </Flex>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Question Preview */}
          <div className="col-span-2">
            {selectedQuestion ? (
              <div className="space-y-4">
                <Card>
                  <h2 className="text-xl font-bold mb-4">Question Preview</h2>
                  <QuestionDisplay question={selectedQuestion} mode="all" />
                </Card>

                {/* Edit Buttons */}
                <Flex gap="md">
                  <Button variant="outline" fullWidth>
                    ✏️ Edit Question
                  </Button>
                  <Button variant="outline" fullWidth>
                    ➕ Add Segment
                  </Button>
                  <Button variant="danger" fullWidth>
                    🗑️ Delete
                  </Button>
                </Flex>
              </div>
            ) : (
              <Card className="text-center">
                <p className="text-gray-500">Select a question to preview</p>
              </Card>
            )}
          </div>
        </Grid>
      </Container>
    </div>
  );
}

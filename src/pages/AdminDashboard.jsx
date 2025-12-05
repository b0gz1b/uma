import { Container, Button, Card, Badge, TextInput } from "@components/index";
import { useState } from "react";
import { useQuiz } from "@context/QuizContext";

export default function AdminDashboard() {
  const { quizzes, loading, error } = useQuiz();
  const [activeTab, setActiveTab] = useState("live"); // "live" or "quiz"

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Container size="sm">
          <Card className="text-center bg-red-50 border-red-200">
            <p className="text-lg text-red-700">{error}</p>
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
          <h1 className="text-4xl font-bold text-gray-900">
            📋 Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage live games and quiz content
          </p>
        </section>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-300">
            <nav className="flex gap-8" aria-label="Dashboard tabs">
              <button
                onClick={() => setActiveTab("live")}
                className={`pb-4 px-2 font-semibold text-lg transition-all ${activeTab === "live"
                    ? "border-b-4 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                🎮 Live Game Management
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                className={`pb-4 px-2 font-semibold text-lg transition-all ${activeTab === "quiz"
                    ? "border-b-4 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                📝 Quiz Management
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "live" ? (
            <LiveGameManagement quizzes={quizzes} />
          ) : (
            <QuizManagement quizzes={quizzes} />
          )}
        </div>
      </Container>
    </div>
  );
}

// Live Game Management Tab Component
function LiveGameManagement({ quizzes }) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Live Game Management
          </h2>
          <p className="text-gray-600 mb-6">
            Start and monitor live quiz sessions with participants
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">
              🚀 Start New Game
            </Button>
            <Button variant="outline" size="lg">
              📊 View Active Games
            </Button>
          </div>
        </div>
      </Card>

      {/* Placeholder for future content */}
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Coming Soon:</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Active game sessions list</li>
          <li>• Real-time participant tracking</li>
          <li>• Live question control</li>
          <li>• Session results and analytics</li>
        </ul>
      </Card>
    </div>
  );
}

// Quiz Management Tab Component
function QuizManagement({ quizzes }) {
  const [view, setView] = useState("home"); // "home", "browse", "edit"
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleBrowseQuizzes = () => {
    setView("browse");
    setSelectedQuiz(null);
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setView("edit");
  };

  const handleBackToHome = () => {
    setView("home");
    setSelectedQuiz(null);
    setSearchTerm("");
  };

  const handleBackToBrowse = () => {
    setView("browse");
    setSelectedQuiz(null);
  };

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter((quiz) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quiz.metadata.title?.toLowerCase().includes(searchLower) ||
      quiz.metadata.author?.toLowerCase().includes(searchLower) ||
      quiz.metadata.category?.toLowerCase().includes(searchLower)
    );
  });

  // Render based on current view
  if (view === "edit") {
    return <QuizEditor quiz={selectedQuiz} onBack={handleBackToBrowse} />;
  }

  if (view === "browse") {
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              📚 Browse Quizzes
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredQuizzes.length} quiz
              {filteredQuizzes.length !== 1 ? "zes" : ""} available
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToHome}>
            ← Back
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <TextInput
            placeholder="Search by title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-600">
              {searchTerm ? "No quizzes match your search" : "No quizzes found"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onSelect={() => handleSelectQuiz(quiz)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default home view
  return (
    <div className="space-y-6">
      <Card>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quiz Management
          </h2>
          <p className="text-gray-600 mb-6">
            Create, edit, and organize your quiz content
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">
              ➕ Create New Quiz
            </Button>
            <Button variant="outline" size="lg" onClick={handleBrowseQuizzes}>
              📚 Browse Quizzes ({quizzes.length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Placeholder for future content */}
      <Card className="bg-green-50 border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">Coming Soon:</h3>
        <ul className="text-green-800 space-y-1 text-sm">
          <li>• Quiz list with search and filters</li>
          <li>• Question editor with segments</li>
          <li>• Image and audio upload</li>
          <li>• Quiz import/export</li>
          <li>• Quiz duplication and templates</li>
        </ul>
      </Card>
    </div>
  );
}

// Quiz Card Component
function QuizCard({ quiz, onSelect }) {
  const metadata = quiz.metadata || {};
  const questionCount = metadata.nb_questions || 0;

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 truncate">
          {metadata.title || "Untitled Quiz"}
        </h3>

        {/* Description */}
        {metadata.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {metadata.description}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2">
          {metadata.category && (
            <Badge variant="primary" size="sm">
              {metadata.category}
            </Badge>
          )}
          {metadata.difficulty && (
            <Badge variant={metadata.difficulty} size="sm">
              {metadata.difficulty}
            </Badge>
          )}
          <Badge variant="default" size="sm">
            {questionCount} {questionCount === 1 ? "question" : "questions"}
          </Badge>
        </div>

        {/* Author */}
        {metadata.author && (
          <p className="text-sm text-gray-500">👤 {metadata.author}</p>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button variant="outline" fullWidth size="sm">
            ✏️ Edit Quiz
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Quiz Editor Component (Empty for now)
function QuizEditor({ quiz, onBack }) {
  const metadata = quiz.metadata || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ✏️ Editing: {metadata.title || "Untitled Quiz"}
          </h2>
          <p className="text-gray-600 mt-1">
            Quiz ID: {quiz.id} • {metadata.nb_questions} questions
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          ← Back to Browse
        </Button>
      </div>

      {/* Editor Placeholder */}
      <Card>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Editor</h3>
          <p className="text-gray-600 mb-6">Editor interface coming soon...</p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary">💾 Save Changes</Button>
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor Features Preview */}
      <Card className="bg-purple-50 border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">
          Editor Features (Coming Soon):
        </h3>
        <ul className="text-purple-800 space-y-1 text-sm">
          <li>• Edit quiz metadata (title, description, settings)</li>
          <li>• Add, edit, delete questions</li>
          <li>• Manage question segments (text, image, sound)</li>
          <li>• Reorder questions with drag & drop</li>
          <li>• Preview quiz as participant would see it</li>
          <li>• Publish/unpublish quiz</li>
        </ul>
      </Card>
    </div>
  );
}

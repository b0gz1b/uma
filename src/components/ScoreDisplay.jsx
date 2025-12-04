import Card from '@components/Card';
import Badge from '@components/Badge';
import { useState, useEffect } from 'react';

export default function ScoreDisplay({
  score,
  totalPoints,
  questionsAnswered,
  totalQuestions,
  correctAnswers,
  showPercentage = true,
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const percentage = ((score / totalPoints) * 100).toFixed(1);
  const accuracy = ((correctAnswers / questionsAnswered) * 100).toFixed(1);

  // Animate score counting up
  useEffect(() => {
    if (displayScore < score) {
      const timer = setTimeout(() => {
        setDisplayScore(displayScore + Math.ceil((score - displayScore) / 10));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayScore, score]);

  const getGrade = (pct) => {
    if (pct >= 90) return { label: 'A', color: 'success' };
    if (pct >= 80) return { label: 'B', color: 'success' };
    if (pct >= 70) return { label: 'C', color: 'warning' };
    if (pct >= 60) return { label: 'D', color: 'warning' };
    return { label: 'F', color: 'danger' };
  };

  const grade = getGrade(parseFloat(percentage));

  return (
    <Card className="bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm mb-2">Final Score</p>
        <p className="text-5xl font-bold text-blue-600">
          {Math.min(displayScore, score)}
        </p>
        <p className="text-gray-600">out of {totalPoints} points</p>
      </div>

      {showPercentage && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Percentage</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
              <Badge variant={grade.color}>{grade.label}</Badge>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Correct Answers</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {correctAnswers}/{questionsAnswered}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Accuracy</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {accuracy}%
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Question {questionsAnswered + 1} of {totalQuestions}
        </p>
      </div>
    </Card>
  );
}


import Card from '@components/Card';
import Badge from '@components/Badge';

export default function AnswerDisplay({
  answer,
  userAnswer,
  isCorrect,
  pointsEarned,
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card className={isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <div className="flex gap-4">
          <div className="text-4xl">
            {isCorrect ? '✅' : '❌'}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>
            <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
              Correct Answer: <strong>{answer.content}</strong>
            </p>
            {userAnswer && !isCorrect && (
              <p className="text-red-700 mt-2">
                Your Answer: <strong>{userAnswer}</strong>
              </p>
            )}
            {pointsEarned !== undefined && (
              <p className="text-lg font-bold mt-3">
                Points Earned: <span className="text-green-600">{pointsEarned}</span>
              </p>
            )}
          </div>
        </div>
      </Card>

      {answer.explanation && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-2">Explanation</h4>
          <p className="text-gray-700 leading-relaxed">{answer.explanation}</p>
        </Card>
      )}

      {answer.imageUrl && (
        <div className="rounded-lg overflow-hidden border-2 border-gray-200">
          <img 
            src={answer.imageUrl} 
            alt="Answer illustration"
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}


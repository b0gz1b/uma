import { useState, useEffect } from 'react';
import TextSegment from '@components/segments/TextSegment';
import ImageSegment from '@components/segments/ImageSegment';
import SoundSegment from '@components/segments/SoundSegment';
import Card from '@components/Card';
import Badge from '@components/Badge';

function SegmentRenderer({ segment }) {
  switch (segment.type) {
    case 'text':
      return <TextSegment {...segment} />;
    case 'image':
      return <ImageSegment {...segment} />;
    case 'sound':
      return <SoundSegment {...segment} />;
    default:
      return <p>Unknown segment type</p>;
  }
}

export default function QuestionDisplay({
  question,
  mode = 'all', // 'all' | 'progressive'
  onSegmentComplete,
}) {
  const [visibleSegments, setVisibleSegments] = useState(
    mode === 'all' ? question.questionSegments : [question.questionSegments]
  );
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  useEffect(() => {
    if (mode === 'progressive' && currentSegmentIndex < question.questionSegments.length - 1) {
      const timer = setTimeout(() => {
        const nextIndex = currentSegmentIndex + 1;
        setCurrentSegmentIndex(nextIndex);
        setVisibleSegments(question.questionSegments.slice(0, nextIndex + 1));
        onSegmentComplete?.(nextIndex);
      }, question.questionSegments[currentSegmentIndex].duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentSegmentIndex, question, mode, onSegmentComplete]);

  const totalDuration = question.questionSegments.reduce((sum, seg) => sum + seg.duration, 0);
  const totalPoints = question.questionSegments.reduce((sum, seg) => sum + seg.points, 0);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {question.title}
            </h2>
            {question.category && (
              <Badge variant="primary">{question.category}</Badge>
            )}
            {question.difficulty && (
              <Badge variant={question.difficulty} className="ml-2">
                {question.difficulty}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Max Points</p>
            <p className="text-2xl font-bold text-green-600">{totalPoints}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {visibleSegments.map((segment) => (
          <div key={segment.id}>
            <SegmentRenderer segment={segment} />
          </div>
        ))}
      </div>

      {mode === 'progressive' && currentSegmentIndex < question.questionSegments.length - 1 && (
        <Card className="bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-700">
            Next segment in {question.questionSegments[currentSegmentIndex].duration}s...
          </p>
        </Card>
      )}
    </div>
  );
}


import Badge from '@components/Badge';

export default function TextSegment({
  content,
  duration,
  points,
  showMetadata = true,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
        <p className="text-lg text-gray-800 leading-relaxed">
          {content}
        </p>
      </div>
      
      {showMetadata && (
        <div className="flex gap-3 flex-wrap">
          <Badge variant="primary">
            ⏱️ {duration}s
          </Badge>
          <Badge variant="success">
            ⭐ {points} pts
          </Badge>
        </div>
      )}
    </div>
  );
}


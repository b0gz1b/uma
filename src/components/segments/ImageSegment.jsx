import Badge from '@components/Badge';

export default function ImageSegment({
  contentUrl,
  contentAlt,
  duration,
  points,
  showMetadata = true,
}) {
  console.log(contentUrl);
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 aspect-video">
        <img 
          src={contentUrl} 
          alt={contentAlt}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%239ca3af%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      
      <p className="text-sm text-gray-600 italic">{contentAlt}</p>
      
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


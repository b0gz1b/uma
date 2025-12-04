import { useState } from 'react';
import Badge from '@components/Badge';
import Button from '@components/Button';

export default function SoundSegment({
  contentUrl,
  duration,
  points,
  showMetadata = true,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  const handlePlay = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🔊</div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 mb-2">Audio Content</p>
            <audio
              ref={setAudioRef}
              onEnded={handleAudioEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full"
            >
              <source src={contentUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
        <Button 
          onClick={handlePlay}
          variant={isPlaying ? 'danger' : 'success'}
          size="md"
          className="mt-4"
        >
          {isPlaying ? '⏸️ Stop' : '▶️ Play'}
        </Button>
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


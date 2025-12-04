import { Container, Button, Card } from '@components/index';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <Container size="sm">
        <Card className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}


import { Link, useLocation } from 'react-router-dom';
import { Container, Flex } from '@components/index';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <Container size="xl" className="py-4">
        <Flex justify="between" align="center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🎯 Quiz Master
          </Link>
          <Flex gap="lg">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/') ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/admin') ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Admin
            </Link>
            <Link
              to="/join"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/join') ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Join Quiz
            </Link>
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
}

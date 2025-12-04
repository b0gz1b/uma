import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import AdminDashboard from '@pages/AdminDashboard';
import ParticipantJoinPage from '@pages/ParticipantJoinPage';
import QuestionDisplayPage from '@pages/QuestionDisplayPage';
import ResultsPage from '@pages/ResultsPage';
import NotFoundPage from '@pages/NotFoundPage';
import RootLayout from '@layouts/RootLayout';
import TestImagePage from '@pages/TestImagePage'
import TestImage from '@/pages/TestImagePage';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },{
        path: 'test',
        element: <TestImagePage />,
      },
      {
        path: 'join',
        element: <ParticipantJoinPage />,
      },
      {
        path: 'quiz/:quizId',
        element: <QuestionDisplayPage />,
      },
      {
        path: 'results/:quizId',
        element: <ResultsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);


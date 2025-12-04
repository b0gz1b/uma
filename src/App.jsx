import { RouterProvider } from 'react-router-dom';
import { QuizProvider } from '@context/QuizContext';
import { router } from '@router/routes';

export default function App() {
  return (
    <QuizProvider>
      <RouterProvider router={router} />
    </QuizProvider>
  );
}

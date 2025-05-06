import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      // Store JWT token in localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decode token to get user info (role and id)
      const decoded: { role: string; id: string } = jwtDecode(token);

      // Redirect based on role
      if (decoded.role === 'admin') {
        router.push('/'); // Admin goes to the dashboard
      } else {
        router.push(`/users/${decoded.id}`); // Regular user goes to their profile
      }
    } catch (err: any) {
      if (err.response) {
        // If the error has a response from the server, set that message
        setError(err.response.data.message || 'Something went wrong. Please try again.');
      } else {
        // If no response from the server, display a generic error
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
          Don&apos;t have an account?{' '}
          <a href="/auth/register" className="text-indigo-600 hover:text-indigo-700">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  profilePhoto?: string; // Optional property
};

type DecodedToken = {
  id: string;
  role: 'admin' | 'user';
};

const ViewUser = () => {
  const router = useRouter();
  const { id } = router.query; // Get user ID from URL params
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  useEffect(() => {
    if (typeof id !== 'string') return;
  
    const controller = new AbortController();
  
    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/auth/login');
        return;
      }
  
      try {
        const res = await fetch(`/api/users/${id}`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || 'Failed to fetch user');
        }
  
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Fetch was aborted — do not set error state
          console.log('Fetch aborted');
          return;
        }
  
        if (err instanceof Error) {
          console.error(err);
          setError(err.message || 'Unexpected error occurred');
        } else {
          console.error('An unknown error occurred');
          setError('Unexpected error occurred');
        }
  
        setUser(null);
      }
    };
  
    fetchUser();
  
    return () => controller.abort();
  }, [id, router]);  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" className="opacity-25" />
            <path d="M4 12a8 8 0 0116 0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-75" />
          </svg>
          <p className="mt-2">Loading user...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <p>{error || 'User not found.'}</p>
      </div>
    );
  }

  // Decode the token and get the current user's ID for comparison
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const decodedToken: DecodedToken = jwtDecode(token || '');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Info message for non-admins */}
        {decodedToken?.role !== 'admin' && (
          <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-md text-sm">
            You are not an admin, so you can only view your own profile.
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={user?.profilePhoto || '/default-avatar.jpg'}
            alt={user.name}
            fill
            className="rounded-full object-cover border-4 border-indigo-500"
          />
        </div>
          <div className="min-w-0">
            <h2 className="text-3xl font-bold truncate">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 break-words text-sm sm:text-base">
              {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Role</p>
            <p className="font-semibold capitalize">{user.role}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800'
                  : 'bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800'
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        {/* Back button only for admin */}
        {decodedToken?.role === 'admin' && (
          <div className="pt-4">
            <button
              onClick={() => router.back()}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-5 py-2 rounded-lg transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}

        {/* Logout button */}
        {decodedToken?.role !== 'admin' && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUser;

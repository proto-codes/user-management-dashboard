import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  profilePhoto?: string;
};

const Dashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      router.push('/auth/login');
      return;
    }
  
    try {
      const decoded: { role: string; id: string } = jwtDecode(token);
  
      if (decoded.role !== 'admin') {
        router.push(`/users/${decoded.id}`);
        return;
      }
    } catch (err) {
      console.error('Invalid token:', err);
      router.push('/auth/login');
      return;
    }
  
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
  
        const data = await res.json();
        setUsers(data.users);
        setTotalUsers(data.total);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [router, page]);  

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
  
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to delete user');
      }
  
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };  

  const statusClass = (status: string) =>
    status === 'active'
      ? 'bg-green-100 text-green-700 dark:bg-green-200 dark:text-green-800'
      : 'bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-800';

  const totalPages = Math.ceil(totalUsers / 10);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 text-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-indigo-600 dark:text-indigo-500 mb-4 sm:mb-0">
            User Management
          </h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => router.push('/add')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition ease-in-out duration-200 text-center"
            >
              + Add User
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition ease-in-out duration-200 text-center"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                <tr>
                  {['Photo', 'Name', 'Email', 'Role', 'Status', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-4 font-medium text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map(user => (
                  <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={user.profilePhoto || '/default-avatar.jpg'}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 space-y-2">
                      <button
                        onClick={() => router.push(`/users/${user._id}`)}
                        className="text-sm px-4 py-1 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/edit/${user._id}`)}
                        className="text-sm px-4 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-sm px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-lg hover:bg-gray-400 disabled:opacity-50 transition"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-gray-700">{page} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-lg hover:bg-gray-400 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

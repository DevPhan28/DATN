import Header from '@/components/layoutAdmin/header/header';
import { useFetchUsers } from '@/data/auth/useUserList';
import { Adjustments, ArrowUpTray } from '@medusajs/icons';
import { Button, Input, StatusBadge, Table } from '@medusajs/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';

export const Route = createFileRoute('/dashboard/_layout/users/')({
  component: UserList,
});

function UserList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch users data
  const { data, error, isLoading } = useFetchUsers();
  const [users, setUsers] = useState(data?.users || []);

  // Update users state when fetching data changes
  useEffect(() => {
    if (data?.users) {
      setUsers(data.users);
    }
  }, [data]);

  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage]);

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to toggle user status
  const toggleUserStatus = (userId: string) => {
    setUsers((prevUsers: any[]) =>
      prevUsers.map((user) =>
        user._id === userId
          ? { ...user, status: user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }
          : user
      )
    );
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <Header title="Users" pathname="" />
      <div className="relative flex justify-between px-6 py-4 border-b bg-white shadow-sm">
        <div className="relative w-80">
          <Input
            className="bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search Users"
            id="search-input"
            size="small"
            type="search"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="flex items-center gap-2">
            <Adjustments className="text-gray-600" />
            <span className="hidden md:inline">Filter</span>
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <ArrowUpTray className="text-gray-600" />
            <span className="hidden md:inline">Export List</span>
          </Button>
        </div>
      </div>

      <div className="border-gray-200 mx-6 mt-6 rounded-lg bg-white shadow-sm">
        {isLoading && (
          <p className="text-center py-6 text-gray-500">Loading users...</p>
        )}
        {error && (
          <p className="text-center py-6 text-red-500">Error loading users</p>
        )}
        {users.length > 0 ? (
          <Table className="w-full">
            <Table.Row className="bg-gray-200 text-gray-700 font-semibold">
              <Table.HeaderCell className="px-4 py-3">Username</Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3">Image</Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3">Email</Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3">Role</Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3">Status</Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3 text-center">Action</Table.HeaderCell>
            </Table.Row>
            <Table.Body>
              {users.map((user: any) => (
                <Table.Row key={user._id} className="hover:bg-gray-100 transition-colors">
                  <Table.Cell className="px-4 py-3 text-gray-900">{user.username}</Table.Cell>
                  <Table.Cell className="px-4 py-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3 text-gray-600">{user.email}</Table.Cell>
                  <Table.Cell className="px-4 py-3 text-gray-600">{user.role}</Table.Cell>
                  <Table.Cell className="px-4 py-3">
                    <StatusBadge color={user.status === 'ACTIVE' ? 'red' : 'green'}>
                      {user.status}
                    </StatusBadge>
                  </Table.Cell>
                  <Table.Cell className="px-4 py-3 text-center">
                    <Button
                      variant={user.status === 'ACTIVE' ? 'danger' : 'success'}
                      className={`text-xs ${
                        user.status === 'ACTIVE' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                      onClick={() => toggleUserStatus(user._id)}
                    >
                      {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p className="text-center py-6 text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}

export default UserList;

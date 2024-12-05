import React from 'react';
import { User } from '../types';
import UserCard from './UserCard';

interface UserListProps {
  users: (User & { distance: number })[];
  onSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onSelect }) => {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          distance={user.distance}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default UserList;
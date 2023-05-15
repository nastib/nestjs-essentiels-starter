import { Expense } from '@prisma/client';
import { Role } from '../../auth/enums';

const date = new Date();
export const UserStub = () => ({
  id: 1,
  email: 'test@gmail.com',
  hash: 'secret',
  currentBalance: 2000,
  initialBalance: 2000,
  roles: [Role.USER],
  createdAt: date,
  updatedAt: date,
});

export const UsersWithExpensesStub = () => [
  {
    id: 1,
    email: 'test@gmail.com',
    hash: 'secret',
    currentBalance: 2000,
    initialBalance: 2000,
    roles: [Role.USER, Role.MANAGER],
    createdAt: date,
    updatedAt: date,
    expenses: [
      {
        id: 1,
        amount: '100',
      },
      {
        id: 2,
        amount: '20',
      },
      {
        id: 3,
        amount: '-50',
      },
    ] as Expense[],
  },
];

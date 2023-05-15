import { Expense } from '@prisma/client';

const date = new Date();
export const expenseStub1 = () => {
  return {
    title: 'First expense',
    description: 'Description of the first expense',
    amount: '50',
    date,
  } as unknown as Expense;
};

export const expenseStub2 = () => {
  return {
    title: 'Second expense',
    description: 'Description of the second expense',
    amount: '40',
    date,
  } as unknown as Expense;
};

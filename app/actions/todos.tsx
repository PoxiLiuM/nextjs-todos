'use server';

import { prisma } from '@/config';
import { Todo } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './users';
import { FormActionReturnType } from '@/components/Form';

export async function getTodosCountByUser(): Promise<number> {
  const user = await getCurrentUser();

  return await prisma.todo.count({
    where: {
      authorId: user?.id,
    },
  });
}

export async function addTodoAction(formData: FormData): Promise<FormActionReturnType> {
  const title = formData.get('title');

  if (!title) return { error: `Todo's content is required` };

  const user = await getCurrentUser();

  if (!user) return { error: 'Unauthorized' };

  const count = await getTodosCountByUser();

  if (count >= 10) {
    return { error: 'Unable to add more than 10 todos' };
  }

  await prisma.todo.create({
    data: {
      authorId: user.id,
      title: String(title),
    },
  });

  revalidatePath('/');
}

export async function getTodos(): Promise<Todo[]> {
  const user = await getCurrentUser();

  if (!user || !user.settings) return [];

  if (user.settings.autoDelete) {
    await prisma.todo.deleteMany({
      where: {
        checked: true,
      },
    });
  }

  const todos = await prisma.todo.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      ...(user.settings.autoSort
        ? {
            checked: 'asc',
          }
        : {
            createdAt: 'asc',
          }),
    },
  });

  return todos;
}

export async function checkTodoAction(todo: Todo) {
  await prisma.todo.update({
    where: {
      id: todo.id,
    },
    data: {
      checked: !todo.checked,
    },
  });

  revalidatePath('/');
}

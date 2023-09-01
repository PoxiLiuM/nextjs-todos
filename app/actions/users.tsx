'use server';

import { FormActionReturnType } from '@/components/Form';
import { prisma, COOKIE_USER_KEY } from '@/config';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function setUserAction(formData: FormData): Promise<FormActionReturnType> {
  const username = formData.get('username');

  if (!username) return { error: 'Username is required' };

  let user = await prisma.user.findUnique({
    where: {
      username: String(username),
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username: String(username),
      },
    });
    await prisma.settings.create({
      data: {
        userId: user.id,
      },
    });
  }

  cookies().set(COOKIE_USER_KEY, user.id);
}

export async function getCurrentUser() {
  const userId = cookies().get(COOKIE_USER_KEY)?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: String(userId),
    },
    include: {
      settings: {
        select: {
          autoSort: true,
          autoDelete: true,
        },
      },
    },
  });

  return user;
}

export async function logoutAction(): Promise<void> {
  cookies().delete(COOKIE_USER_KEY);

  revalidatePath('/');
}

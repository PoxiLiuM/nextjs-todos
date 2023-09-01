'use server';

import { prisma } from '@/config';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './users';

export async function setAutoSortAction() {
  const user = await getCurrentUser();

  await prisma.settings.update({
    data: {
      autoSort: !user?.settings?.autoSort,
    },
    where: {
      userId: user?.id,
    },
  });

  revalidatePath('/');
}

export async function setAutoDeleteAction() {
  const user = await getCurrentUser();

  await prisma.settings.update({
    data: {
      autoDelete: !user?.settings?.autoDelete,
    },
    where: {
      userId: user?.id,
    },
  });

  revalidatePath('/');
}

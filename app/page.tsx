import { Todo } from '@prisma/client';

import Show from '@/components/Show';
import TodoElement from '@/components/TodoElement';
import {
  addTodoAction,
  checkTodoAction,
  getTodos,
  getTodosCountByUser,
} from '@/actions/todos';
import { getCurrentUser, logoutAction, setUserAction } from '@/actions/users';

import styles from './page.module.scss';
import Button from './components/Button';
import { setAutoDeleteAction, setAutoSortAction } from './actions/settings';
import Form from './components/Form';

export default async function Home() {
  const user = await getCurrentUser();
  const todos: Todo[] = user ? await getTodos() : [];
  const nbTodos: number = user ? await getTodosCountByUser() : 0;

  return (
    <main className={styles.main}>
      <Show when={!!user}>
        <h1 className={styles.textCenter}>Hello, {user?.username} !</h1>
      </Show>
      <Show when={!user}>
        <h1 className={styles.textCenter}>Hello World !</h1>
      </Show>
      <h2 className={styles.textCenter}>
        This is a simple todo list powered by NextJS
      </h2>

      <Show when={!user}>
        <Form className={styles.form} action={setUserAction}>
          <label>
            <input placeholder="Username" name="username" />
          </label>
          <button type="submit">Access Todos</button>
        </Form>
      </Show>

      <Show when={!!user}>
        <Show when={nbTodos < 10}>
          <Form className={styles.form} action={addTodoAction}>
            <label>
              <input placeholder="Todo's content" name="title" />
            </label>
            <button type="submit">Add Todo</button>
          </Form>
        </Show>
        <Show when={nbTodos >= 10}>
          <p className={`${styles.textCenter} c-red`}>
            You have reached the maximum capacity of 10 todos in your list.
          </p>
        </Show>
        <Show when={nbTodos === 0}>
          <p className={`${styles.textCenter} c-grey`}>You don&apos;t have any todo.</p>
        </Show>
        <ul>
          {todos.map((todo) => (
            <TodoElement setCheck={checkTodoAction} key={todo.id} todo={todo} />
          ))}
        </ul>
      </Show>

      <Show when={!!user}>
        <div className="flex column">
          <h2>Settings</h2>
          <Button onClick={setAutoDeleteAction}>
            {user?.settings?.autoDelete
              ? 'Automatic deletion of completed todos'
              : 'Keep completed todos'}
          </Button>

          <Show when={!user?.settings?.autoDelete}>
            <Button onClick={setAutoSortAction}>
              {user?.settings?.autoSort
                ? 'The unchecked todos come first'
                : 'Order of addition'}
            </Button>
          </Show>
        </div>
        <Button className="bg-red" onClick={logoutAction}>
          Logout
        </Button>
      </Show>
    </main>
  );
}

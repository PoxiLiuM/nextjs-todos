'use client';

import { Todo } from '@prisma/client';

import styles from './TodoElement.module.scss';

type PropTypes = {
  todo: Todo;
  setCheck: (todo: Todo) => Promise<void>;
};

export default function TodoElement(props: PropTypes) {
  let className = styles.li;
  if (props.todo.checked) {
    className += ` ${styles.checked}`;
  }

  return (
    <li
      tabIndex={0}
      className={className}
      onClick={() => props.setCheck(props.todo)}
    >
      {props.todo.title}
    </li>
  );
}

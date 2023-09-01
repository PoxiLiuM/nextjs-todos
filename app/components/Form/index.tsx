'use client';

import { useRef, useState } from 'react';
import Show from '../Show';

import styles from './Form.module.scss'

export type FormActionReturnType = { error: string } | undefined;

type WithServerAction = {
  action: (formData: FormData) => Promise<FormActionReturnType>;
};

type WithoutServerAction = {
  method: 'post' | 'get';
  action: string;
};

type PropTypes = {
  className?: string;
  children: React.ReactNode;
} & (WithServerAction | WithoutServerAction);

export default function Form(props: PropTypes) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    if (typeof props.action === 'function') {
      const error = (await props.action(formData))?.error;

      if (error) {
        setError(error);
      } else {
        setError(null);
      }

      formRef.current?.reset();
    }
  }

  return (
    <form
      ref={formRef}
      className={`${styles.form}${!!error ? ' ' + styles.hasError : ''} ${props.className}`}
      action={typeof props.action === 'function' ? onSubmit : props.action}
      method={(props as WithoutServerAction).method}
    >
      <Show when={!!error}>
        <p className={styles.error}>{ error }</p>
      </Show>
      {props.children}
    </form>
  );
}

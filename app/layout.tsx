import './globals.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NextJS Todo',
  description: 'Created by Alexandre SAMPAIO PONTES',
};

type PropTypes = {
  children: React.ReactNode;
};

export default function RootLayout(props: PropTypes) {
  return (
    <html lang="fr">
      <body>{props.children}</body>
    </html>
  );
}

'use client';

type PropTypes = {
  children: React.ReactNode;
  className?: string;
  type?: string;
  onClick: () => any;
};

export default function Button(props: PropTypes) {
  return (
    <button className={props.className} onClick={() => props.onClick()}>
      {props.children}
    </button>
  );
}

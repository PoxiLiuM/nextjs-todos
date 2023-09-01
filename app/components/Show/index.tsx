type PropTypes = {
  children: React.ReactNode;
  when: boolean;
};

export default function Show(props: PropTypes) {
  if (!props.when) return null;

  return props.children;
}

// A project's technologies as small tags, on the home page rows and the
// project pages. role="list" because Safari drops list semantics once list
// styles are removed.
export default function Stack({ project }) {
  return (
    <ul role="list" className="flex flex-wrap gap-1.5">
      {project.stack.map((tech) => (
        <li
          key={tech}
          className="rounded border border-line bg-surface px-2.5 py-1.5 font-mono text-3xs text-inkmuted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

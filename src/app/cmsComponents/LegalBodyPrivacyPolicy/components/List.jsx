import { typography } from "@/styles/typography";

export default function List({ title, description, items }) {
  const list = Array.isArray(items) ? items : [];

  if (!title && !description && !list.length) {
    return null;
  }

  return (
    <div className="mb-8">
      {title ? (
        <h3 className={`${typography.itemTitle} mb-3 font-medium text-primary-1`}>
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className={`${typography.body} mb-4 text-700`}>{description}</p>
      ) : null}
      {list.length ? (
        <ul className="space-y-3">
          {list.map((item, index) => (
            <li key={item || index} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-2" />
              <span className={`${typography.body} text-700`}>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

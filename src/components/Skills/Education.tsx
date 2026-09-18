type Formation = { title: string; meta: string; level?: string };
export default function Education({ formations }: { formations: Formation[] }) {
  const schools = [
    {
      id: "cesi",
      name: "CESI Lille",
      courses: formations.filter((item) => item.meta.includes("CESI")),
    },
    {
      id: "rouen",
      name: "Université de Rouen Normandie",
      courses: formations.filter((item) => !item.meta.includes("CESI")),
    },
  ];
  return (
    <div className="page-gutter education-grid">
      {schools.map((school) => (
        <article className="education-school" key={school.id}>
          <header>
            <span className={`school-logo school-logo--${school.id}`}>
              <img
                src={`/schools/${school.id}.svg`}
                width={80}
                height={80}
                alt=""
                loading="lazy"
              />
            </span>
            <h3>{school.name}</h3>
          </header>
          <ul>
            {school.courses.map((item) => (
              <li key={item.title}>
                {item.level && (
                  <span className="education-level">{item.level}</span>
                )}
                <h4>{item.title}</h4>
                {school.id === "rouen" && <p>{item.meta}</p>}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

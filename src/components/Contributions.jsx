import { useEffect, useState } from "react";

// Faint to full green by GitHub's activity level, 0 to 4.
const LEVELS = ["bg-line", "bg-ok/30", "bg-ok/55", "bg-ok/80", "bg-ok"];

const formatDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function describe({ date, count }) {
  const day = formatDate.format(new Date(`${date}T00:00:00Z`));
  if (count === 0) return `No contributions on ${day}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${day}`;
}

// My GitHub activity over the last year, from /api/contributions. The space
// is held while it loads, so nothing below it moves; if it can't load, as
// under npm run dev or vite preview, it is left out. Each column is a week.
// Where the year doesn't fit, the oldest weeks are cut off on the left.
export default function Contributions() {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/contributions")
      .then((response) => {
        if (!response.ok) throw new Error(`Answered ${response.status}`);
        return response.json();
      })
      .then((json) => {
        if (active) setData(json);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (failed) return null;

  return (
    <div className="mb-6">
      <p className="font-mono text-xs text-inkmuted">
        {data ? `${data.total.toLocaleString("en-US")} contributions on GitHub in the last year` : " "}
      </p>

      <div className="mt-3 h-[88px] overflow-hidden lg:h-[102px]">
        {data && (
          <div
            role="img"
            aria-label="GitHub contribution graph for the last year"
            className="flex justify-end lg:justify-start"
          >
            <div className="grid shrink-0 grid-flow-col grid-rows-7 gap-[3px]">
              {data.days.map((day, index) => (
                <span
                  key={day.date}
                  title={describe(day)}
                  // The first week can start midweek; Sunday is the top row.
                  style={index === 0 ? { gridRowStart: new Date(`${day.date}T00:00:00Z`).getUTCDay() + 1 } : undefined}
                  className={`h-2.5 w-2.5 rounded-[2px] lg:h-3 lg:w-3 ${LEVELS[day.level] ?? LEVELS[0]}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

// Faint to full green by GitHub's activity level, 0 to 4, on the dark tile.
const LEVELS = ["bg-onblock/10", "bg-ok/40", "bg-ok/60", "bg-ok/80", "bg-ok"];

const utc = (date) => new Date(`${date}T00:00:00Z`);
const formatDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatMonth = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

function describe({ date, count }) {
  const day = formatDate.format(utc(date));
  if (count === 0) return `No contributions on ${day}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${day}`;
}

// The days as week columns, Sunday first. offset: how far down the first
// week starts, since the year can begin midweek.
function toWeeks(days) {
  const weeks = [];
  for (const day of days) {
    const weekday = utc(day.date).getUTCDay();
    if (weeks.length === 0 || weekday === 0) weeks.push({ days: [], offset: weekday });
    weeks[weeks.length - 1].days.push(day);
  }
  return weeks;
}

// The month to label each week with: where the month changes, except a first
// label so close to the next that the two would touch.
function monthLabels(weeks) {
  const labels = weeks.map((week, i) => {
    const month = formatMonth.format(utc(week.days[0].date));
    const before = i > 0 ? formatMonth.format(utc(weeks[i - 1].days[0].date)) : null;
    return month === before ? null : month;
  });
  const next = labels.findIndex((label, i) => i > 0 && label);
  if (next > 0 && next < 3) labels[0] = null;
  return labels;
}

// A year of empty weeks to hold the space while the data loads.
const EMPTY_WEEKS = Array.from({ length: 53 }, () => ({ days: Array(7).fill(null), offset: 0 }));

// Which weeks show at this width: the most recent 20 on phones, 36 on
// tablets, and the whole year from 1024px. The columns share the width, so
// the graph always fills the tile.
function widthClass(fromEnd) {
  if (fromEnd >= 36) return "hidden lg:grid";
  if (fromEnd >= 20) return "hidden sm:grid";
  return "grid";
}

/**
 * Days in a row with contributions, ending today. Today can still be empty
 * without breaking the streak, since the day isn't over. days: oldest first.
 */
function currentStreak(days) {
  let i = days.length - 1;
  if (days[i]?.count === 0) i -= 1;
  let streak = 0;
  while (i >= 0 && days[i].count > 0) {
    streak += 1;
    i -= 1;
  }
  return streak;
}

/** { data, failed } from /api/contributions, which only exists on Vercel. */
export function useContributions() {
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

  return { data, failed };
}

// The line under the tile's title. &nbsp; holds its height while loading.
export function ContributionSummary({ data }) {
  if (!data) return <span className="block font-mono text-xs">{" "}</span>;

  const streak = currentStreak(data.days);
  return (
    <span className="block font-mono text-xs text-onblock/75">
      {data.total.toLocaleString("en-US")} contributions in the last year
      {streak > 1 && (
        <>
          {" · "}
          <span className="whitespace-nowrap">{streak}-day streak</span>
        </>
      )}
    </span>
  );
}

// The year as a grid, with month labels above and a legend below. Each square
// says its day and count on hover. It sits inside the tile's link, so it is
// one image to screen readers; the summary line carries the numbers.
export function ContributionGraph({ data }) {
  const weeks = data ? toWeeks(data.days) : EMPTY_WEEKS;
  const labels = data ? monthLabels(weeks) : [];

  return (
    <span className="mt-6 block">
      <span
        role={data ? "img" : undefined}
        aria-label={data ? "GitHub contribution graph for the last year" : undefined}
        aria-hidden={data ? undefined : "true"}
        className="flex gap-[3px]"
      >
        {weeks.map((week, i) => (
          <span
            key={week.days[0]?.date ?? i}
            className={`relative min-w-0 flex-1 grid-rows-7 gap-[3px] pt-5 ${widthClass(weeks.length - 1 - i)}`}
          >
            {labels[i] && (
              <span aria-hidden="true" className="absolute left-0 top-0 whitespace-nowrap font-mono text-3xs text-onblock/60">
                {labels[i]}
              </span>
            )}
            {week.days.map((day, d) => (
              <span
                key={day?.date ?? d}
                title={day ? describe(day) : undefined}
                style={d === 0 && week.offset > 0 ? { gridRowStart: week.offset + 1 } : undefined}
                className={`block aspect-square rounded-[2px] ${LEVELS[day?.level ?? 0] ?? LEVELS[0]}`}
              />
            ))}
          </span>
        ))}
      </span>

      <span aria-hidden="true" className="mt-3 flex items-center justify-end gap-1 font-mono text-3xs text-onblock/60">
        Less
        {LEVELS.map((level) => (
          <span key={level} className={`h-2.5 w-2.5 rounded-[2px] ${level}`} />
        ))}
        More
      </span>
    </span>
  );
}

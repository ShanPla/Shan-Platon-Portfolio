// GET /api/contributions (a Vercel function): my GitHub contribution graph as
// JSON, read from the public page GitHub's own profile uses, so it needs no
// token. Vercel's edge keeps the answer for 6 hours, so the graph stays
// current without a deploy and GitHub is asked only a few times a day.

const SOURCE = "https://github.com/users/ShanPla/contributions";

/** { total, days: [{ date, level, count }] }, oldest first. Throws if the page has changed. */
export function parseContributions(html) {
  const counts = new Map();
  for (const [, id, text] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts.set(id, parseInt(text.replace(/,/g, ""), 10) || 0);
  }

  const days = [...html.matchAll(/<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g)]
    .map(([cell]) => ({
      date: cell.match(/\bdata-date="([^"]*)"/)[1],
      level: Number(cell.match(/\bdata-level="(\d)"/)?.[1] ?? 0),
      count: counts.get(cell.match(/\bid="([^"]*)"/)?.[1]) ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const total = html.match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1];
  if (days.length === 0 || total === undefined) throw new Error("Unexpected contributions page");

  return { total: Number(total.replace(/,/g, "")), days };
}

export default async function handler(req, res) {
  try {
    const response = await fetch(SOURCE);
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const data = parseContributions(await response.text());
    res.setHeader("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");
    res.status(200).json(data);
  } catch (error) {
    // The page hides the graph on an error; try again in 5 minutes.
    console.error(error);
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.status(502).json({ error: "Contributions unavailable" });
  }
}

// /lib/ingestion/platforms/github.ts
import { ActivityMetrics } from "../normalize";

export async function fetchGitHubMetrics(args: {
  accessToken?: string;
}) {
  if (!args.accessToken) {
    throw new Error("GitHub access token missing");
  }

  // Fetch authenticated user
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!userRes.ok) throw new Error("GitHub API error (user)");
  const user = await userRes.json();

  // Fetch recent events (issues, PRs, comments)
  const eventsRes = await fetch(
    `https://api.github.com/users/${user.login}/events`,
    {
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!eventsRes.ok) throw new Error("GitHub API error (events)");
  const events = await eventsRes.json();

  // Count activity
  let commentsToday = 0;
  let commentsWeek = 0;
  let commentsMonth = 0;
  let posts = 0;

  const now = Date.now();
  const oneDay = 1000 * 60 * 60 * 24;
  const oneWeek = oneDay * 7;
  const oneMonth = oneDay * 30;

  for (const event of events) {
    const created = new Date(event.created_at).getTime();
    const age = now - created;

    // Comments (issue comments, PR comments)
    if (
      event.type === "IssueCommentEvent" ||
      event.type === "PullRequestReviewCommentEvent"
    ) {
      if (age < oneDay) commentsToday++;
      if (age < oneWeek) commentsWeek++;
      if (age < oneMonth) commentsMonth++;
    }

    // Posts (issues opened, PRs opened)
    if (
      event.type === "IssuesEvent" ||
      event.type === "PullRequestEvent"
    ) {
      posts++;
    }
  }

  const metrics: ActivityMetrics = {
    commentsToday,
    commentsWeek,
    commentsMonth,
    posts,
  };

  return metrics;
}
// app/engines/page.tsx
import {
  SOCIAL,
  VIDEO,
  MUSIC,
  WRITING,
  WEB3,
  MONETIZATION,
  CREATOR_TOOLS,
} from "@/lib/platforms";
import { SOCIAL_AUTH_TYPE } from "@/lib/socials";

export default function EnginesPage() {
  const allPlatforms = [
    ...SOCIAL,
    ...VIDEO,
    ...MUSIC,
    ...WRITING,
    ...WEB3,
    ...MONETIZATION,
    ...CREATOR_TOOLS,
  ];

  const oauthPlatforms = allPlatforms.filter(
    (p) => SOCIAL_AUTH_TYPE[p.name.toLowerCase()] === "oauth"
  );

  const publicPlatforms = allPlatforms.filter(
    (p) => SOCIAL_AUTH_TYPE[p.name.toLowerCase()] === "public"
  );

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold">Supported Engines</h1>
      <p className="text-gray-600">
        CardPilot supports both OAuth engines (deep analytics, real‑time comments)
        and public engines (public stats only). Here’s what each platform can read.
      </p>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* OAuth */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">OAuth Engines</h2>
          <p className="text-gray-600 mb-4">
            OAuth engines allow PrettyPlay to access private analytics, real‑time
            comments, and deeper creator insights.
          </p>

          <ul className="space-y-4">
            {oauthPlatforms.map((p) => (
              <li key={p.name} className="flex items-start gap-3">
                <p.icon className="text-xl mt-1" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <ul className="list-disc ml-5 text-gray-700 text-sm">
                    <li>Followers & engagement</li>
                    <li>Comments & replies</li>
                    <li>Posts & content metadata</li>
                    <li>Real‑time comment tracking</li>
                    <li>Private analytics (if supported)</li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Public */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Public Engines</h2>
          <p className="text-gray-600 mb-4">
            Public engines rely on publicly available data. These platforms do not
            provide private analytics or real‑time comment access.
          </p>

          <ul className="space-y-4">
            {publicPlatforms.map((p) => (
              <li key={p.name} className="flex items-start gap-3">
                <p.icon className="text-xl mt-1" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <ul className="list-disc ml-5 text-gray-700 text-sm">
                    <li>Public profile stats</li>
                    <li>Public posts</li>
                    <li>Public comments (if allowed)</li>
                    <li>Engagement estimates</li>
                    <li>No private analytics</li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full matrix */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Engine Matrix</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">Platform</th>
              <th className="py-3 text-left">Engine</th>
              <th className="py-3 text-left">Followers</th>
              <th className="py-3 text-left">Comments</th>
              <th className="py-3 text-left">Posts</th>
              <th className="py-3 text-left">Real‑time</th>
              <th className="py-3 text-left">Private Analytics</th>
            </tr>
          </thead>
          <tbody>
            {allPlatforms.map((p) => {
              const engine = SOCIAL_AUTH_TYPE[p.name.toLowerCase()];
              const isOAuth = engine === "oauth";

              return (
                <tr key={p.name} className="border-b">
                  <td className="py-3 flex items-center gap-2">
                    <p.icon className="text-lg" />
                    {p.name}
                  </td>
                  <td className="py-3">{isOAuth ? "OAuth" : "Public"}</td>
                  <td className="py-3">{isOAuth ? "✓" : "✓"}</td>
                  <td className="py-3">{isOAuth ? "✓" : "Limited"}</td>
                  <td className="py-3">{isOAuth ? "✓" : "✓"}</td>
                  <td className="py-3">{isOAuth ? "✓" : "—"}</td>
                  <td className="py-3">{isOAuth ? "✓" : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
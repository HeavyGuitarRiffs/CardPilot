export default function PrivacyPage() {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-4xl w-full py-12 space-y-8 text-center">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-600">
          This Privacy Policy explains how Comment Se Va, operated by Atem Industries LLC,
          collects, uses, and protects your information.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Information We Collect</h2>
        <ul className="list-disc ml-6 text-left inline-block text-gray-700">
          <li>Account information (email, username)</li>
          <li>Connected social media handles</li>
          <li>OAuth tokens for platforms requiring authentication</li>
          <li>Public social media data (followers, comments, posts)</li>
          <li>Usage analytics to improve our services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. How We Use Your Data</h2>
        <ul className="list-disc ml-6 text-left inline-block text-gray-700">
          <li>To provide engagement analytics and insights</li>
          <li>To improve platform performance and features</li>
          <li>To personalize your dashboard and experience</li>
          <li>To maintain security and prevent abuse</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">3. Data Access & Permissions</h2>
        <p className="text-gray-700">
          For OAuth platforms, we only request read‑only permissions. We do not post,
          delete, or modify content on your behalf. Public platforms are accessed without
          OAuth using publicly available data.
        </p>

        <h2 className="text-2xl font-semibold mt-8">4. Data Sharing</h2>
        <p className="text-gray-700">
          We do not sell your data. We may share anonymized analytics or comply with legal
          requests when required.
        </p>

        <h2 className="text-2xl font-semibold mt-8">5. Data Security</h2>
        <p className="text-gray-700">
          We use industry‑standard encryption and secure storage practices. No system is
          100% secure, but we take reasonable measures to protect your information.
        </p>

        <h2 className="text-2xl font-semibold mt-8">6. Your Rights</h2>
        <ul className="list-disc ml-6 text-left inline-block text-gray-700">
          <li>Request deletion of your account</li>
          <li>Disconnect social media accounts</li>
          <li>Request a copy of your stored data</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">7. Updates to This Policy</h2>
        <p className="text-gray-700">
          We may update this Privacy Policy periodically. Continued use of our services
          indicates acceptance of the updated policy.
        </p>

        <p className="text-gray-600 mt-8">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
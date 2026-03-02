export default function TermsPage() {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-4xl w-full py-12 space-y-8 text-center">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>

        <p className="text-gray-600">
          These Terms & Conditions (“Terms”) govern your use of Comment Se Va, a product
          operated by Atem Industries LLC (“we”, “our”, “us”). By accessing or using our
          websites, applications, or services, you agree to these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8">1. Company Information</h2>
        <p>
          Comment Se Va is owned and operated by <strong>Atem Industries LLC</strong>, a
          limited liability corporation providing digital products and creative services.
          Our offerings include:
        </p>

        <ul className="list-disc ml-6 text-left inline-block text-gray-700">
          <li>Websites and web applications</li>
          <li>Software tools and digital utilities</li>
          <li>Creative services and digital art</li>
          <li>Merchandise such as apparel (including future t‑shirt releases)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">2. Use of Services</h2>
        <p className="text-gray-700">
          You may use our services only for lawful purposes. You agree not to misuse,
          reverse‑engineer, or attempt to disrupt our systems, APIs, or infrastructure.
        </p>

        <h2 className="text-2xl font-semibold mt-8">3. User Accounts</h2>
        <p className="text-gray-700">
          When connecting social media accounts, you authorize us to access publicly
          available data or OAuth‑authorized data depending on the platform. You are
          responsible for maintaining the security of your account.
        </p>

        <h2 className="text-2xl font-semibold mt-8">4. Intellectual Property</h2>
        <p className="text-gray-700">
          All content, branding, software, and design elements are the property of Atem
          Industries LLC unless otherwise stated. You may not copy, redistribute, or
          resell our materials without permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8">5. Data & Analytics</h2>
        <p className="text-gray-700">
          Comment Se Va analyzes social media data for engagement insights. We do not
          modify, delete, or post content on your behalf. Data access is read‑only.
        </p>

        <h2 className="text-2xl font-semibold mt-8">6. Payments & Purchases</h2>
        <p className="text-gray-700">
          Payments for digital services, subscriptions, or merchandise are final unless
          otherwise stated. Refunds are handled on a case‑by‑case basis.
        </p>

        <h2 className="text-2xl font-semibold mt-8">7. Limitation of Liability</h2>
        <p className="text-gray-700">
          Atem Industries LLC is not liable for losses arising from service interruptions,
          third‑party platform changes, data inaccuracies, or user misuse. Our services
          are provided “as‑is” without warranties of any kind.
        </p>

        <h2 className="text-2xl font-semibold mt-8">8. Changes to Terms</h2>
        <p className="text-gray-700">
          We may update these Terms at any time. Continued use of our services indicates
          acceptance of the updated Terms.
        </p>

        <p className="text-gray-600 mt-8">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
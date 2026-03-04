"use client";

import Link from "next/link";
import {
  FaTwitter,
  FaYoutube,
  FaSlack,
  FaMicrosoft,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-2xl w-full text-center py-16 space-y-10">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-gray-600">
          Have questions, feedback, or partnership ideas? Reach out anytime.
          CardPilot is built by Atem Industries LLC, and we’re always happy to connect.
        </p>

        {/* Email */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Email</h2>
          <div className="flex justify-center items-center gap-3 text-gray-700">
            <FaEnvelope size={22} className="text-muted-foreground" />
            <a
              href="mailto:justmcfarlane@gmail.com"
              className="underline"
            >
              justmcfarlane@gmail.com
            </a>
          </div>
        </div>

        {/* Social Channels */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Social Channels</h2>

          <div className="flex justify-center flex-wrap gap-6">

            <SocialLink
              href="https://x.com/taitaotendo"
              icon={<FaTwitter size={26} />}
              label="X"
            />

            <SocialLink
              href="https://youtube.com/yourchannel"
              icon={<FaYoutube size={26} />}
              label="YouTube"
            />

            <SocialLink
              href="https://wa.me/19073598970"
              icon={<FaWhatsapp size={26} />}
              label="WhatsApp"
            />

            <SocialLink
              href="https://join.slack.com/t/softwareasasandwich/shared_invite/zt-3opytsgbm-H9srrHPRUPq6JiChU7iDhg"
              icon={<FaSlack size={26} />}
              label="Slack"
            />

            <SocialLink
              href="https://teams.live.com/l/invite/FEA-zQozd8RCn3VwwI?v=g1"
              icon={<FaMicrosoft size={26} />}
              label="Microsoft Teams"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

type SocialLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group text-muted-foreground hover:text-foreground transition-all"
    >
      <span className="flex items-center justify-center p-3 rounded-full group-hover:bg-accent transition-colors">
        {icon}
      </span>
    </Link>
  );
}
import React from "react";
import { Metadata } from "next";
import NewsletterForm from "@/components/Newsletter/NewsletterForm"; // Update this path if alias isn't set

export const metadata: Metadata = {
  title: "Shielded Newsletter",
  description: "Sign up for the Shielded Newsletter to receive updates on the Zcash ecosystem and network stats directly in your inbox.",
  openGraph: {
    title: "Shielded Newsletter",
    description: "Sign up for the Shielded Newsletter to receive updates on the Zcash ecosystem and network stats directly in your inbox.",
    url: "https://zechub.wiki/newsletter",
    images: [
      {
        url: "https://example.com/newsletter-image.png",
        width: 1200,
        height: 630,
        alt: "Shielded Newsletter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shielded Newsletter",
    description: "Sign up for the Shielded Newsletter to receive updates on the Zcash ecosystem and network stats directly in your inbox.",
    images: ["https://example.com/newsletter-image.png"],
  },
};

const Newsletter: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gray-50 p-8"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 className="text-3xl font-bold mb-4">Shielded Newsletter</h1>
      <p className="text-xl text-center mb-8">
        Stay updated with the latest news and stats from the Zcash ecosystem. Sign up for the Shielded Newsletter to get updates delivered directly to your inbox.
      </p>
      <NewsletterForm />
    </div>
  );
};

export default Newsletter;

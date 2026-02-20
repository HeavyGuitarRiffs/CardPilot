// components/dashboard/socialShareLinks.ts

export type ShareLinks = {
  twitter: string;
  facebook: string;
  linkedin: string;
  reddit: string;
  email: string;
  whatsapp: string;
  telegram: string;
  copy: string; // NEW
};

export function buildShareLinks(url: string, text: string): ShareLinks {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    copy: url, // NEW — used by modal for "Copy link"
  };
}
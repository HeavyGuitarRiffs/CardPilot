// lib/platforms/index.ts

import {
  SiX,
  SiYoutube,
  SiInstagram,
  SiTiktok,
  SiTwitch,
  SiKick,
  SiVimeo,
  SiFlickr,
  SiPinterest,
  SiLinkedin,
  SiReddit,
  SiGithub,
  SiStackoverflow,
  SiMastodon,
  SiBluesky,
  SiTumblr,
  SiSoundcloud,
  SiBandcamp,
  SiLastdotfm,
  SiSteam,
  SiItchdotio,
  SiPatreon,
  SiKofi,
  SiSubstack,
  SiMedium,
  SiGhost,
  SiOnlyfans,
  SiShopify,
  SiEtsy,
  SiGumroad,
  SiOdysee,
  SiRumble,
  SiDailymotion,
  SiHiveBlockchain,
  SiEthereum,
  SiWeb3Dotjs,
  SiFacebook,
  SiSnapchat,
  SiTelegram,
  SiWhatsapp,

  SiLine,
  SiDiscord,
  SiBilibili,

  SiGoodreads,
  SiQuora,
  SiDeviantart,
  SiPixiv,
  SiKickstarter,
 
  SiBuymeacoffee,
  SiMixcloud,
  SiAudiomack,

  SiCodepen,
  SiCodesandbox,
  SiFigma,
  SiAdobe,
  SiCanva,
  SiUnsplash,
  SiImdb,
  SiLetterboxd,
  SiTidal,
  SiNapster,
  SiShazam,
} from "react-icons/si";

import { Video, MessageCircle } from "lucide-react"; // BitChute + Zalo fallback

/* -----------------------------------------
   SOCIAL NETWORKS
------------------------------------------*/
export const SOCIAL = [
  { name: "Twitter / X", icon: SiX, url: "https://x.com", desc: "Microblogging." },
  { name: "Facebook", icon: SiFacebook, url: "https://facebook.com", desc: "Global social network." },
  { name: "Instagram", icon: SiInstagram, url: "https://instagram.com", desc: "Photo & video sharing." },
  { name: "TikTok", icon: SiTiktok, url: "https://tiktok.com", desc: "Short-form video." },
  { name: "Snapchat", icon: SiSnapchat, url: "https://snapchat.com", desc: "Stories & messaging." },
  { name: "LinkedIn", icon: SiLinkedin, url: "https://linkedin.com", desc: "Professional networking." },
  { name: "Reddit", icon: SiReddit, url: "https://reddit.com", desc: "Communities & discussions." },
  { name: "Pinterest", icon: SiPinterest, url: "https://pinterest.com", desc: "Visual inspiration." },
  { name: "Tumblr", icon: SiTumblr, url: "https://tumblr.com", desc: "Blogging & fandom." },
  { name: "Mastodon", icon: SiMastodon, url: "https://mastodon.social", desc: "Decentralized social." },
  { name: "Bluesky", icon: SiBluesky, url: "https://bsky.app", desc: "AT Protocol social." },
  { name: "Line", icon: SiLine, url: "https://line.me", desc: "Messaging & social." },
  { name: "Telegram", icon: SiTelegram, url: "https://telegram.org", desc: "Messaging & channels." },
  { name: "WhatsApp", icon: SiWhatsapp, url: "https://whatsapp.com", desc: "Messaging & groups." },
  { name: "Discord", icon: SiDiscord, url: "https://discord.com", desc: "Communities & chat." },
  { name: "Zalo", icon: MessageCircle, url: "https://zalo.me", desc: "Vietnam social & messaging." },
];

/* -----------------------------------------
   VIDEO PLATFORMS
------------------------------------------*/
export const VIDEO = [
  { name: "YouTube", icon: SiYoutube, url: "https://youtube.com", desc: "Largest video platform." },
  { name: "Twitch", icon: SiTwitch, url: "https://twitch.tv", desc: "Live streaming." },
  { name: "Kick", icon: SiKick, url: "https://kick.com", desc: "Streaming alternative." },
  { name: "Vimeo", icon: SiVimeo, url: "https://vimeo.com", desc: "Professional video hosting." },
  { name: "Flickr", icon: SiFlickr, url: "https://flickr.com", desc: "Photography & video." },
  { name: "Odysee", icon: SiOdysee, url: "https://odysee.com", desc: "Decentralized video." },
  { name: "Rumble", icon: SiRumble, url: "https://rumble.com", desc: "Video platform." },
  { name: "Dailymotion", icon: SiDailymotion, url: "https://dailymotion.com", desc: "Global video." },
  { name: "BitChute", icon: Video, url: "https://bitchute.com", desc: "Alternative video." },
  { name: "Bilibili", icon: SiBilibili, url: "https://bilibili.com", desc: "Anime & creator video." },

];

/* -----------------------------------------
   MUSIC & AUDIO
------------------------------------------*/
export const MUSIC = [
  { name: "SoundCloud", icon: SiSoundcloud, url: "https://soundcloud.com", desc: "Music & audio." },
  { name: "Bandcamp", icon: SiBandcamp, url: "https://bandcamp.com", desc: "Indie music storefront." },
  { name: "Last.fm", icon: SiLastdotfm, url: "https://last.fm", desc: "Music analytics." },
  { name: "Mixcloud", icon: SiMixcloud, url: "https://mixcloud.com", desc: "DJ mixes & radio." },
  { name: "Audiomack", icon: SiAudiomack, url: "https://audiomack.com", desc: "Hip-hop & indie." },
  { name: "Tidal", icon: SiTidal, url: "https://tidal.com", desc: "Hi-fi music streaming." },
  { name: "Napster", icon: SiNapster, url: "https://napster.com", desc: "Music streaming." },
  { name: "Shazam", icon: SiShazam, url: "https://shazam.com", desc: "Music recognition." },
];

/* -----------------------------------------
   WRITING & BLOGGING
------------------------------------------*/
export const WRITING = [
  { name: "Substack", icon: SiSubstack, url: "https://substack.com", desc: "Newsletters." },
  { name: "Medium", icon: SiMedium, url: "https://medium.com", desc: "Writing platform." },
  { name: "Ghost", icon: SiGhost, url: "https://ghost.org", desc: "Independent publishing." },
  { name: "Goodreads", icon: SiGoodreads, url: "https://goodreads.com", desc: "Books & reviews." },
  { name: "Quora", icon: SiQuora, url: "https://quora.com", desc: "Questions & answers." },
  { name: "DeviantArt", icon: SiDeviantart, url: "https://deviantart.com", desc: "Art & portfolios." },
  { name: "Pixiv", icon: SiPixiv, url: "https://pixiv.net", desc: "Illustration community." },
];

/* -----------------------------------------
   WEB3 / CRYPTO SOCIAL
------------------------------------------*/
export const WEB3 = [
  { name: "Hive", icon: SiHiveBlockchain, url: "https://hive.blog", desc: "Web3 blogging." },
  { name: "Peepeth", icon: SiEthereum, url: "https://peepeth.com", desc: "Ethereum microblogging." },
  { name: "DeSo", icon: SiWeb3Dotjs, url: "https://deso.com", desc: "Decentralized social graph." },
];

/* -----------------------------------------
   MONETIZATION / CREATOR ECONOMY
------------------------------------------*/
export const MONETIZATION = [
  { name: "Patreon", icon: SiPatreon, url: "https://patreon.com", desc: "Memberships." },
  { name: "Ko-fi", icon: SiKofi, url: "https://ko-fi.com", desc: "Donations." },
  { name: "Buy Me a Coffee", icon: SiBuymeacoffee, url: "https://buymeacoffee.com", desc: "Creator tips." },
  { name: "OnlyFans", icon: SiOnlyfans, url: "https://onlyfans.com", desc: "Subscription content." },
  { name: "Shopify", icon: SiShopify, url: "https://shopify.com", desc: "Storefronts." },
  { name: "Etsy", icon: SiEtsy, url: "https://etsy.com", desc: "Handmade goods." },
  { name: "Gumroad", icon: SiGumroad, url: "https://gumroad.com", desc: "Digital products." },
  { name: "Kickstarter", icon: SiKickstarter, url: "https://kickstarter.com", desc: "Crowdfunding." },
  
];

/* -----------------------------------------
   OTHER CREATOR TOOLS
------------------------------------------*/
export const OTHER = [
  { name: "GitHub", icon: SiGithub, url: "https://github.com", desc: "Developer repos." },
  { name: "StackOverflow", icon: SiStackoverflow, url: "https://stackoverflow.com", desc: "Developer Q&A." },
  { name: "Steam", icon: SiSteam, url: "https://store.steampowered.com", desc: "Games & reviews." },
  { name: "itch.io", icon: SiItchdotio, url: "https://itch.io", desc: "Indie games." },
  { name: "CodePen", icon: SiCodepen, url: "https://codepen.io", desc: "Frontend playground." },
  { name: "CodeSandbox", icon: SiCodesandbox, url: "https://codesandbox.io", desc: "Dev sandbox." },
  { name: "Figma", icon: SiFigma, url: "https://figma.com", desc: "Design tool." },
  { name: "Adobe", icon: SiAdobe, url: "https://adobe.com", desc: "Creative suite." },
  { name: "Canva", icon: SiCanva, url: "https://canva.com", desc: "Design platform." },
  { name: "Unsplash", icon: SiUnsplash, url: "https://unsplash.com", desc: "Free photos." },
  { name: "IMDB", icon: SiImdb, url: "https://imdb.com", desc: "Film database." },
  { name: "Letterboxd", icon: SiLetterboxd, url: "https://letterboxd.com", desc: "Film reviews." },
];

/* -----------------------------------------
   MERGED EXPORT
------------------------------------------*/
export const ALL_PLATFORMS = [
  ...SOCIAL,
  ...VIDEO,
  ...MUSIC,
  ...WRITING,
  ...WEB3,
  ...MONETIZATION,
  ...OTHER,
];
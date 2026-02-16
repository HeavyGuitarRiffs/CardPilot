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

import { Video, MessageCircle, Globe, PenTool, Camera, Layers } from "lucide-react";

/* -----------------------------------------
   SOCIAL NETWORKS (20)
------------------------------------------*/
export const SOCIAL = [
  { name: "Twitter / X", icon: SiX, url: "https://x.com", desc: "Microblogging." },
  { name: "Instagram", icon: SiInstagram, url: "https://instagram.com", desc: "Photo & video sharing." },
  { name: "TikTok", icon: SiTiktok, url: "https://tiktok.com", desc: "Short-form video." },
  { name: "Facebook", icon: SiFacebook, url: "https://facebook.com", desc: "Global social network." },
  { name: "Snapchat", icon: SiSnapchat, url: "https://snapchat.com", desc: "Stories & messaging." },
  { name: "LinkedIn", icon: SiLinkedin, url: "https://linkedin.com", desc: "Professional networking." },
  { name: "Reddit", icon: SiReddit, url: "https://reddit.com", desc: "Communities & discussions." },
  { name: "Pinterest", icon: SiPinterest, url: "https://pinterest.com", desc: "Visual inspiration." },
  { name: "Tumblr", icon: SiTumblr, url: "https://tumblr.com", desc: "Blogging & fandom." },
  { name: "Mastodon", icon: SiMastodon, url: "https://mastodon.social", desc: "Decentralized social." },
  { name: "Bluesky", icon: SiBluesky, url: "https://bsky.app", desc: "AT Protocol social." },
  { name: "Threads", icon: Globe, url: "https://threads.net", desc: "Meta's text social app." },
  { name: "Line", icon: SiLine, url: "https://line.me", desc: "Messaging & social." },
  { name: "Telegram", icon: SiTelegram, url: "https://telegram.org", desc: "Messaging & channels." },
  { name: "WhatsApp", icon: SiWhatsapp, url: "https://whatsapp.com", desc: "Messaging & groups." },
  { name: "Discord", icon: SiDiscord, url: "https://discord.com", desc: "Communities & chat." },
  { name: "Zalo", icon: MessageCircle, url: "https://zalo.me", desc: "Vietnam social & messaging." },
  { name: "VK", icon: Globe, url: "https://vk.com", desc: "Russian social network." },
  { name: "QQ", icon: Globe, url: "https://im.qq.com", desc: "Chinese messaging platform." },
];

/* -----------------------------------------
   VIDEO PLATFORMS (15)
------------------------------------------*/
export const VIDEO = [
  { name: "YouTube", icon: SiYoutube, url: "https://youtube.com", desc: "Largest video platform." },
  { name: "YouTube Shorts", icon: SiYoutube, url: "https://youtube.com/shorts", desc: "Short-form video." },
  { name: "YouTube Live", icon: SiYoutube, url: "https://youtube.com/live", desc: "Live streaming." },
  { name: "Twitch", icon: SiTwitch, url: "https://twitch.tv", desc: "Live streaming." },
  { name: "Kick", icon: SiKick, url: "https://kick.com", desc: "Streaming alternative." },
  { name: "Vimeo", icon: SiVimeo, url: "https://vimeo.com", desc: "Professional video hosting." },
  { name: "Flickr", icon: SiFlickr, url: "https://flickr.com", desc: "Photography & video." },
  { name: "Odysee", icon: SiOdysee, url: "https://odysee.com", desc: "Decentralized video." },
  { name: "Rumble", icon: SiRumble, url: "https://rumble.com", desc: "Video platform." },
  { name: "Dailymotion", icon: SiDailymotion, url: "https://dailymotion.com", desc: "Global video." },
  { name: "BitChute", icon: Video, url: "https://bitchute.com", desc: "Alternative video." },
  { name: "Bilibili", icon: SiBilibili, url: "https://bilibili.com", desc: "Anime & creator video." },
  { name: "Douyin", icon: SiTiktok, url: "https://douyin.com", desc: "Chinese TikTok." },
  { name: "Kuaishou", icon: Camera, url: "https://kuaishou.com", desc: "Chinese short video." },
  { name: "Xiaohongshu (RED)", icon: PenTool, url: "https://xiaohongshu.com", desc: "Lifestyle & shopping." },
];

/* -----------------------------------------
   MUSIC & AUDIO (12)
------------------------------------------*/
export const MUSIC = [
  { name: "Spotify", icon: Globe, url: "https://spotify.com", desc: "Music streaming." },
  { name: "Apple Music", icon: Globe, url: "https://music.apple.com", desc: "Music streaming." },
  { name: "Amazon Music", icon: Globe, url: "https://music.amazon.com", desc: "Music streaming." },
  { name: "SoundCloud", icon: SiSoundcloud, url: "https://soundcloud.com", desc: "Music & audio." },
  { name: "Bandcamp", icon: SiBandcamp, url: "https://bandcamp.com", desc: "Indie music storefront." },
  { name: "Last.fm", icon: SiLastdotfm, url: "https://last.fm", desc: "Music analytics." },
  { name: "Mixcloud", icon: SiMixcloud, url: "https://mixcloud.com", desc: "DJ mixes & radio." },
  { name: "Audiomack", icon: SiAudiomack, url: "https://audiomack.com", desc: "Hip-hop & indie." },
  { name: "Tidal", icon: SiTidal, url: "https://tidal.com", desc: "Hi-fi music streaming." },
  { name: "Napster", icon: SiNapster, url: "https://napster.com", desc: "Music streaming." },
  { name: "Shazam", icon: SiShazam, url: "https://shazam.com", desc: "Music recognition." },
  { name: "Anchor", icon: Globe, url: "https://anchor.fm", desc: "Podcast hosting." },
];

/* -----------------------------------------
   WRITING & BLOGGING (10)
------------------------------------------*/
export const WRITING = [
  { name: "Substack", icon: SiSubstack, url: "https://substack.com", desc: "Newsletters." },
  { name: "Medium", icon: SiMedium, url: "https://medium.com", desc: "Writing platform." },
  { name: "Ghost", icon: SiGhost, url: "https://ghost.org", desc: "Independent publishing." },
  { name: "WordPress", icon: Globe, url: "https://wordpress.com", desc: "Blogging platform." },
  { name: "Blogger", icon: Globe, url: "https://blogger.com", desc: "Google blogging." },
  { name: "Hashnode", icon: Globe, url: "https://hashnode.com", desc: "Developer blogging." },
  { name: "DEV.to", icon: Globe, url: "https://dev.to", desc: "Developer writing." },
  { name: "Goodreads", icon: SiGoodreads, url: "https://goodreads.com", desc: "Books & reviews." },
  { name: "Quora", icon: SiQuora, url: "https://quora.com", desc: "Questions & answers." },
  { name: "Pixiv", icon: SiPixiv, url: "https://pixiv.net", desc: "Illustration community." },
];

/* -----------------------------------------
   WEB3 / CRYPTO SOCIAL (10)
------------------------------------------*/
export const WEB3 = [
  { name: "Lens Protocol", icon: Globe, url: "https://lens.xyz", desc: "Web3 social graph." },
  { name: "Farcaster", icon: Globe, url: "https://farcaster.xyz", desc: "Decentralized social." },
  { name: "Mirror.xyz", icon: Globe, url: "https://mirror.xyz", desc: "Web3 publishing." },
  { name: "Zora", icon: Globe, url: "https://zora.co", desc: "NFT marketplace." },
  { name: "Foundation", icon: Globe, url: "https://foundation.app", desc: "NFT art." },
  { name: "SuperRare", icon: Globe, url: "https://superrare.com", desc: "NFT art." },
  { name: "OpenSea", icon: Globe, url: "https://opensea.io", desc: "NFT marketplace." },
  { name: "Hive", icon: SiHiveBlockchain, url: "https://hive.blog", desc: "Web3 blogging." },
  { name: "Peepeth", icon: SiEthereum, url: "https://peepeth.com", desc: "Ethereum microblogging." },
  { name: "DeSo", icon: SiWeb3Dotjs, url: "https://deso.com", desc: "Decentralized social graph." },
];

/* -----------------------------------------
   MONETIZATION / CREATOR ECONOMY (12)
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
  { name: "Spring (Teespring)", icon: Globe, url: "https://spring.com", desc: "Merch platform." },
  { name: "Redbubble", icon: Globe, url: "https://redbubble.com", desc: "Print-on-demand." },
  { name: "Lemon Squeezy", icon: Globe, url: "https://lemonsqueezy.com", desc: "Digital commerce." },
];

/* -----------------------------------------
   CREATOR TOOLS (12)
------------------------------------------*/
export const CREATOR_TOOLS = [
  { name: "GitHub", icon: SiGithub, url: "https://github.com", desc: "Developer repos." },
  { name: "StackOverflow", icon: SiStackoverflow, url: "https://stackoverflow.com", desc: "Developer Q&A." },
  { name: "Notion", icon: Globe, url: "https://notion.so", desc: "Workspace & docs." },
  { name: "Trello", icon: Globe, url: "https://trello.com", desc: "Project management." },
  { name: "Asana", icon: Globe, url: "https://asana.com", desc: "Project management." },
  { name: "Figma", icon: SiFigma, url: "https://figma.com", desc: "Design tool." },
  { name: "Adobe", icon: SiAdobe, url: "https://adobe.com", desc: "Creative suite." },
  { name: "Canva", icon: SiCanva, url: "https://canva.com", desc: "Design platform." },
  { name: "OBS", icon: Layers, url: "https://obsproject.com", desc: "Streaming software." },
  { name: "Streamlabs", icon: Layers, url: "https://streamlabs.com", desc: "Streaming tools." },
  { name: "CodePen", icon: SiCodepen, url: "https://codepen.io", desc: "Frontend playground." },
  { name: "CodeSandbox", icon: SiCodesandbox, url: "https://codesandbox.io", desc: "Dev sandbox." },
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
  ...CREATOR_TOOLS,
];
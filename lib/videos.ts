export type VideoSource = 'vimeo' | 'youtube'
export type VideoCategory = 'automobile' | 'fashion' | 'narrative' | 'humour' | 'offbeat' | 'ai'

export interface Video {
  id: string
  source: VideoSource
  title: string
  brand: string
  category: VideoCategory
  duration: string
  description: string
  thumbnailVimeo?: string  // vimeocdn thumbnail hash if known
}

// Vimeo thumbnail: https://i.vimeocdn.com/video/{id}-{hash}-d_1920x1080
// YouTube thumbnail: https://i.ytimg.com/vi/{id}/maxresdefault.jpg

export const VIDEOS: Video[] = [
  // ── AI / Recent ──────────────────────────────────────────────────
  {
    id: '2064044054', source: 'vimeo',
    title: 'The Charge Within – A Monochrome Anthem to Motion',
    brand: 'Nike', category: 'ai', duration: '1:23',
    description: 'Every breath. Every sprint. Every stare. From athletes to animals, instinct moves us. This is not about winning. This is about the charge within.',
    thumbnailVimeo: '4a15d127aa3e80666290989c01ce2e9c1d63050a381bc4a418cf021c972d360f',
  },
  {
    id: '2062690757', source: 'vimeo',
    title: 'The Befikr Ride',
    brand: 'Kinetic Green', category: 'ai', duration: '0:40',
    description: 'A fresh, upbeat, and visually playful TV commercial for the all-new Befikr Scooter — a bold expression of freedom, smoothness, and fearless mobility.',
    thumbnailVimeo: '46acbf86caea63bf0bc407d034ebe8ef6e53955d1fe5fd6b0c0eb1e6507a4eae',
  },
  {
    id: '2062686862', source: 'vimeo',
    title: 'A Symphony of Presence',
    brand: 'Maruti Suzuki Victoris', category: 'ai', duration: '1:03',
    description: 'A cinematic experience crafted as a visual symphony — where elegance meets expression, and motion meets music.',
    thumbnailVimeo: '0d984015a604269c1cc290e54fba3352c005c7fda50f17ac811ee2fc57989c17',
  },
  {
    id: '2061570309', source: 'vimeo',
    title: 'The Serve',
    brand: 'Adidas Y-3', category: 'ai', duration: '0:56',
    description: 'Set on a surreal, minimalist court — the purity of motion, silence before impact, and the elegance of control.',
    thumbnailVimeo: 'e596c4888403ddb9a724086defb2698376ef2872d817ff07da6329935bd98ace',
  },
  {
    id: '2060566588', source: 'vimeo',
    title: 'No Limits',
    brand: 'Harley Davidson', category: 'ai', duration: '1:23',
    description: 'Concept, Direction, Execution: Niddhish Puuzhakkal. Production House: Light Seeker Films.',
    thumbnailVimeo: '500b9cb108f39ba722eb57f2310346ec65f51321326b0ca923b8c898d6aec73c',
  },
  {
    id: '2060441350', source: 'vimeo',
    title: 'Ride Back to Yourself',
    brand: 'Harley Davidson', category: 'ai', duration: '1:04',
    description: 'An ode to lost freedom, built using a hybrid creative process blending AI, art direction, and cinematic instinct. It\'s not just a bike. It\'s a return ticket.',
    thumbnailVimeo: '1aa7a69e323287db504b13d2a967e811154bede781fabe8a20f2d97b04cebf51',
  },
  {
    id: '2059633325', source: 'vimeo',
    title: 'The Adorned',
    brand: 'Vinsmera', category: 'ai', duration: '1:03',
    description: 'A film crafted to explore the creative and cinematic possibilities of AI in brand storytelling.',
    thumbnailVimeo: '7366e6e83916e50818a5846939a662a6a5d0e53649f1a355313c6d3ddeda5638',
  },
  {
    id: '2059433654', source: 'vimeo',
    title: 'The Drop',
    brand: 'Adidas Y-3', category: 'ai', duration: '0:31',
    description: 'A cinematic collision of rhythm, grit, and style — reimagining sport through the avant-garde lens of Adidas Y-3.',
    thumbnailVimeo: '8ef7cca65dcd2ab49d6be73c6b6c4c60e5bf186edec470fb8d4767c73cf666cc',
  },
  {
    id: '2058462867', source: 'vimeo',
    title: 'Run the Streets. Own the Look.',
    brand: 'Just Younger Sox', category: 'ai', duration: '1:08',
    description: 'Step into your power — one stride at a time. It\'s about the swagger. The rhythm. The attitude.',
    thumbnailVimeo: 'd19664ed4c9e02e9123148ffa93f0aa2f642125b972f320933f19140cdc8271d',
  },
  {
    id: '2058460834', source: 'vimeo',
    title: 'This Beard Just Tamed a Wild Bear',
    brand: 'Beardo', category: 'ai', duration: '0:42',
    description: 'What if your beard was so powerful, even a wild bear had to back off? Step into the cinematic wild where masculinity meets menace.',
    thumbnailVimeo: '12bf50e95a610e37b78ed0b28f877a1c9701104322054a12c2d618feb3b7c996',
  },
  {
    id: '2064071664', source: 'vimeo',
    title: 'Bring on Tomorrow',
    brand: 'Ford Bronco', category: 'ai', duration: '1:10',
    description: 'Director: Niddhish Puuzhakkal. Produced by Light Seeker Films. Made with Hypnotic.',
    thumbnailVimeo: 'db506c633a9ccd453496a0224dc99cc13aea39e699128ad0aa2fc9a81acd7ac2',
  },
  {
    id: '2088701714', source: 'vimeo',
    title: 'Celeste',
    brand: 'Tanishq', category: 'fashion', duration: '1:16',
    description: 'Directed by Niddhish Puuzhakkal. DOP: Sejal Shah.',
    thumbnailVimeo: 'cc27ea0265b4ac88483f4c8fff3db85bf82da2dcd391803dcaef2a8c4431c024',
  },

  // ── Automobile ──────────────────────────────────────────────────
  {
    id: '1472559454', source: 'vimeo',
    title: 'Grand Vitara Teaser 02',
    brand: 'Maruti Suzuki', category: 'automobile', duration: '0:27',
    description: 'Director: Niddhish Puuzhakkal. DOP: Didier Daubeach.',
    thumbnailVimeo: '5c69bc92ea4d5d61f3ad18b9dcfc3c493ad6f1a9c2dfdd069f99e9c3128c5dc5',
  },
  {
    id: '1472563266', source: 'vimeo',
    title: 'Grand Vitara Teaser 01 (Hybrid)',
    brand: 'Maruti Suzuki', category: 'automobile', duration: '0:28',
    description: 'Director: Niddhish Puuzhakkal. DOP: Didier Daubeach.',
    thumbnailVimeo: 'b287f51941ed008c81f304a006b57c57dab4f78ecf4e2fb3292e23847693f13f',
  },
  {
    id: '1472544318', source: 'vimeo',
    title: 'Grand Vitara Commercial',
    brand: 'Maruti Suzuki', category: 'automobile', duration: '0:45',
    description: 'Director: Niddhish Puuzhakkal. DOP: Didier Daubeach. Producer: Bread Jam Productions.',
    thumbnailVimeo: '3bd0817d1ada6d071f2e619cb0e6411a11276a995da8d28dcea90a2a9982d712',
  },
  {
    id: 'Or9_Ut_ghQg', source: 'youtube',
    title: 'Go Hatchin Go Awesome — Director Cut',
    brand: 'Toyota Glanza', category: 'automobile', duration: '1:08',
    description: 'Director: Niddhish Puuzhakkal. DOP: John Wilmor.',
  },

  // ── Fashion & Beauty ──────────────────────────────────────────
  {
    id: '1828814179', source: 'vimeo',
    title: 'Just Younger Active 24',
    brand: 'Just Younger', category: 'fashion', duration: '0:41',
    description: 'Director, Editor: Niddhish Puuzhakkal. DOP: Sachu. Produced by Light Seeker Films.',
    thumbnailVimeo: '4de2a167a5a7fbb7106ee09e22726aac4f07a0a40a78379b7237e4bc7d4259b9',
  },
  {
    id: '1844679446', source: 'vimeo',
    title: 'Just Younger Active — 24',
    brand: 'Just Younger', category: 'fashion', duration: '0:52',
    description: 'Director, Editor: Niddhish Puuzhakkal.',
    thumbnailVimeo: 'db5f15747c93449d9b896e128eb91a81c9d94a6ffb6841650112117fe15daac7',
  },
  {
    id: '1493391932', source: 'vimeo',
    title: 'Live in Levis',
    brand: 'Levis', category: 'fashion', duration: '1:09',
    description: 'Directed, Shot and Cut by Niddhish Puuzhakkal. Produced by Light Seeker Media.',
    thumbnailVimeo: '0fc83511e592213ebae10d3d8311e5d13933e7083d833460e894d5c94cfea0bb',
  },
  {
    id: '1514004798', source: 'vimeo',
    title: 'Save the Loom',
    brand: 'Save the Loom', category: 'fashion', duration: '1:25',
    description: 'Shot, Directed and Edited by Niddhish Puuzhakkal. Produced by Light Seeker Media.',
    thumbnailVimeo: 'cae1c3306bef339d5a3e1c3c6ae957dd59a3be656c314f3f4c2201db1a7c2c16',
  },

  // ── Narrative ──────────────────────────────────────────────────
  {
    id: '7BWyW3nuYsI', source: 'youtube',
    title: 'Nema Ji Ki Nayi Film',
    brand: 'Bandhan Mutual Fund', category: 'narrative', duration: '0:58',
    description: 'Director, Producer, Editor: Niddhish Puuzhakkal. DOP: Jebin Jacob. Production House: Light Seeker Films.',
  },
  {
    id: '7TB7x7mS9SQ', source: 'youtube',
    title: 'Cookie',
    brand: 'Bandhan Mutual Fund', category: 'narrative', duration: '0:58',
    description: 'Director, Producer, Editor: Niddhish Puuzhakkal. DOP: Jebin Jacob. Production House: Light Seeker Films.',
  },
  {
    id: '1847192710', source: 'vimeo',
    title: 'Find Joy',
    brand: 'Housing.com', category: 'narrative', duration: '2:29',
    description: 'Director, Editor: Niddhish Puuzhakkal. Production House: Light Seeker Films.',
    thumbnailVimeo: '274f948e31934537b6873d6267d2e16dc1228192bcf345d6cda5c4f80e0e79e3',
  },
  {
    id: '1847847988', source: 'vimeo',
    title: 'Move Forward — Leaving Home',
    brand: 'Uber', category: 'narrative', duration: '4:04',
    description: 'Director, Editor: Niddhish Puuzhakkal. Production House: Light Seeker Films.',
    thumbnailVimeo: '2571583fe40ed6add53909eddde43068ad4626491cb6a1d038088021507dbea2',
  },
  {
    id: '1764574369', source: 'vimeo',
    title: 'Tuesday Extra',
    brand: 'Bandhan Mutual Fund', category: 'narrative', duration: '1:04',
    description: 'Director & Producer: Niddhish Puuzhakkal. DOP: Siddharth Srinivasan.',
    thumbnailVimeo: 'f244b61b39c04d928716cd5a2661bce31f5ea575dd8e2d5565f79cce203a7802',
  },
  {
    id: '1764574279', source: 'vimeo',
    title: 'Dal Delight',
    brand: 'Bandhan Mutual Fund', category: 'narrative', duration: '1:04',
    description: 'Director & Producer: Niddhish Puuzhakkal. DOP: Siddharth Srinivasan.',
    thumbnailVimeo: '5b26b759617ccb88bc0032a00f7ca1b203683b9dc14002b1ae54fa34bb531807',
  },
  {
    id: '1603053523', source: 'vimeo',
    title: 'World Cancer Day',
    brand: 'Pfizer', category: 'narrative', duration: '1:38',
    description: 'Director: Niddhish Puuzhakkal. DOP: John Wilmor. Production House: Marathon Films.',
    thumbnailVimeo: 'da03ba109b997d08a592a7d6fa4daf78eb2aa2b363cc4a09f67fa61830a70b77',
  },
  {
    id: 'tWxJbMf06Jk', source: 'youtube',
    title: 'English in the Life of a Malayali',
    brand: 'Times of India', category: 'narrative', duration: '1:07',
    description: 'Director & Producer: Niddhish Puuzhakkal. DOP: Anend C Chandran. Production House: Light Seeker Media.',
  },
  {
    id: '1738666204', source: 'vimeo',
    title: 'Click Quick Dry',
    brand: 'LG Dryer', category: 'narrative', duration: '1:03',
    description: 'Director: Niddhish Puuzhakkal. DOP: Jebin Jacob. Production House: VTP Films.',
    thumbnailVimeo: 'afc17fecdbe2a5a1bcf0638fecd436aa249623e9f90778720456602e54827432',
  },

  // ── Humour ──────────────────────────────────────────────────────
  {
    id: '753514718', source: 'vimeo',
    title: 'Grandma',
    brand: 'Skoda', category: 'humour', duration: '1:01',
    description: 'Director: Niddhish Puuzhakkal.',
    thumbnailVimeo: 'e32258a4e276e8aa9c92435bfdd12bbed862cfa27cb39d36f0e0656ef5d1f342',
  },
  {
    id: 'nNjgUMuvJYg', source: 'youtube',
    title: 'One Card — Director Cut',
    brand: 'One Card', category: 'humour', duration: '1:26',
    description: 'Director: Niddhish Puuzhakkal. DOP: Jebin Jacob.',
  },
  {
    id: '822810203', source: 'vimeo',
    title: 'Complimentary',
    brand: 'Big Basket', category: 'humour', duration: '0:33',
    description: 'Director: Niddhish Puuzhakkal.',
    thumbnailVimeo: '2bc1ce6c1d3f5d72087bc6439225027315b6181da33a32d3c8836e2b59b86a98',
  },
  {
    id: '753514003', source: 'vimeo',
    title: 'Everlast Sheets',
    brand: 'Everlast', category: 'humour', duration: '1:00',
    description: 'Director: Niddhish Puuzhakkal. DOP: Anand C. Chandran.',
    thumbnailVimeo: 'e6bede24fd39504df2023fbc6c0594d6d674b1b08b76e3b4c684f7c719f67c3c',
  },
  {
    id: 'UHxRCnnqdFc', source: 'youtube',
    title: 'Buy Now — Film 2',
    brand: 'Infocus', category: 'humour', duration: '0:54',
    description: 'Director: Niddhish Puuzhakkal.',
  },
  {
    id: '-jRFXTemIHY', source: 'youtube',
    title: 'Buy Now — Film 1',
    brand: 'Infocus', category: 'humour', duration: '1:04',
    description: 'Director: Niddhish Puuzhakkal.',
  },
  {
    id: '798359862', source: 'vimeo',
    title: 'Zomato Baby',
    brand: 'Zomato', category: 'humour', duration: '0:50',
    description: 'Written & Directed by Niddhish Puuzhakkal.',
    thumbnailVimeo: 'ab59a9964d68018b534e0d220c5d08ade954ce69b9c3429502d558c972733bc6',
  },
  {
    id: '831118357', source: 'vimeo',
    title: 'Mastercard Cafe Axis',
    brand: 'Mastercard', category: 'humour', duration: '0:22',
    description: 'Director: Niddhish Puuzhakkal.',
    thumbnailVimeo: '8a23bbc73866fff57172b513019ed73323183821007785b2273ef0aa90f8b155',
  },

  // ── Offbeat ──────────────────────────────────────────────────────
  {
    id: '1735458662', source: 'vimeo',
    title: 'Sprint Fast — Energy Drink',
    brand: 'Sprint Fast', category: 'offbeat', duration: '1:07',
    description: 'Director: Niddhish Puuzhakkal. VFX, 3D and Edit: Niddhish Puuzhakkal. DOP: Jebin Jacob.',
    thumbnailVimeo: '6429fd35b5fa49fa86f15feb8b6e394055da7623e1989c4480d179f0925fa6fe',
  },
  {
    id: 'uhFLDkGZAcY', source: 'youtube',
    title: 'Medicine Man — A Face From My Travel Diary',
    brand: 'Documentary', category: 'offbeat', duration: '4:28',
    description: 'Director: Niddhish Puuzhakkal. A philosopher, herbalist, biker, and siddha practitioner from Calicut.',
  },
]

export function getThumbnail(video: Video): string {
  if (video.source === 'youtube') {
    return `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`
  }
  if (video.thumbnailVimeo) {
    return `https://i.vimeocdn.com/video/${video.id}-${video.thumbnailVimeo}-d_1920x1080?&r=pad&region=us`
  }
  return `https://i.vimeocdn.com/video/${video.id}-d_1920x1080?&r=pad&region=us`
}

export function getEmbedUrl(video: Video): string {
  if (video.source === 'youtube') {
    return `https://www.youtube.com/embed/${video.id}?autoplay=1`
  }
  return `https://player.vimeo.com/video/${video.id}?autoplay=1&color=e8683a&title=0&byline=0&portrait=0`
}

export const CATEGORY_LABELS: Record<VideoCategory, string> = {
  automobile: 'Automobile',
  fashion: 'Fashion & Beauty',
  narrative: 'Narrative',
  humour: 'Humour',
  offbeat: 'Offbeat',
  ai: 'AI Films',
}

// Feature films with poster images
export const FEATURE_FILMS = [
  {
    title: 'EGO',
    year: '2024',
    genre: 'Feature Film · Hindi · Drama-Comedy',
    tagline: 'Some fights are with the world. Some are with yourself.',
    cast: 'Arshad Warsi · Juhi Chawla · Divya Dutta · Gauhar Khan',
    status: 'release' as const,
    statusLabel: 'Preparing for Release',
    palette: ['#1a0a05', '#3d1408', '#c44a1e'] as [string, string, string],
    posterUrl: 'https://static.wixstatic.com/media/7b7113_08d50cb6ea2c4f4daf7738dffbc6799f~mv2.png/v1/crop/x_14,y_0,w_1385,h_2000/fill/w_471,h_680,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Black%20White%20Typographic%20Modern%20Movie%20Poster(1).png',
  },
  {
    title: 'Palkon Pe',
    year: '2024',
    genre: 'Feature Film · Hindi',
    tagline: 'A story carried on the edges of sight.',
    cast: 'Completing Post-Production',
    status: 'post' as const,
    statusLabel: 'In Post-Production',
    palette: ['#050a1a', '#0a1a35', '#1a3a6e'] as [string, string, string],
    posterUrl: null, // No poster available yet
  },
  {
    title: 'Canvas',
    year: '2025',
    genre: 'Feature Film · Malayalam',
    tagline: 'Every life is a work in progress.',
    cast: 'In Development',
    status: 'production' as const,
    statusLabel: 'In Production',
    palette: ['#0a0a08', '#1a1a10', '#4a4a2a'] as [string, string, string],
    posterUrl: 'https://static.wixstatic.com/media/7b7113_7d42f7955c7f4357b9f21975cb34dd6c~mv2.png/v1/crop/x_14,y_0,w_1385,h_2000/fill/w_471,h_680,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/CANVAS%20POSTER%201(1).png',
  },
]

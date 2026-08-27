import happyValley from "@/assets/project-happy-valley.jpg";
import enfield from "@/assets/project-enfield.jpg";
import cafe from "@/assets/project-cafe.jpg";
import jewellers from "@/assets/project-jewellers.jpg";
import fashion from "@/assets/project-fashion.jpg";

export interface CreativeItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface ReelItem {
  id: string;
  title: string;
  category: string;
  poster: string;
  videoUrl: string;
  views: string;
  duration: string;
}

export interface ProjectData {
  slug: string;
  no: string;
  name: string;
  client: string;
  category: string;
  copy: string;
  fullDescription: string;
  heroImage: string;
  metrics: string[];
  links: {
    website?: string;
    instagram?: string;
    facebook?: string;
  };
  servicesProvided: string[];
  categories: string[];
  creatives: CreativeItem[];
  reels: ReelItem[];
}

export const projectsData: ProjectData[] = [
  {
    slug: "happy-valley-park",
    no: "01",
    name: "HAPPY VALLEY PARK",
    client: "Happy Valley Water Park & Resort",
    category: "Digital Marketing • Social Media • Campaign Creative",
    copy: "Built a more engaging digital presence for a leisure destination through campaign-driven creative, promotional communication and audience-focused social content.",
    fullDescription: "Happy Valley Park is a premier leisure and water resort destination. ROYAL300 developed an end-to-end digital growth framework including seasonal promo campaigns, interactive social media reels, and high-conversion ad creatives that drove record seasonal bookings.",
    heroImage: "/happy_valley_park/thumbnail.png",
    metrics: ["+58% Reach", "+41% Engagement", "2.4× Campaign Interaction", "12K+ Ticket Inquiries"],
    links: {
      website: "https://gohappyvalley.com",
      instagram: "https://www.instagram.com/happyvalleypark",
      facebook: "https://www.facebook.com/happyvalleyparkbira",
    },
    servicesProvided: [
      "Social Media Management",
      "Web Development",
      "Website Maintenance",
    ],
    categories: ["All", "Social Campaign", "Ad Creatives", "Promotions", "Event Highlights"],
    creatives: [
      {
        id: "hv-1",
        title: "Happy Valley Campaign Creative 01",
        category: "Social Campaign",
        image: "/happy_valley_park/creative/1.jpeg",
        description: "High-impact visual promotional creative for Happy Valley Water Park.",
      },
      {
        id: "hv-2",
        title: "Happy Valley Campaign Creative 02",
        category: "Ad Creatives",
        image: "/happy_valley_park/creative/21.jpeg",
        description: "Targeted social media ad highlighting resort & water rides.",
      },
      {
        id: "hv-3",
        title: "Happy Valley Campaign Creative 03",
        category: "Promotions",
        image: "/happy_valley_park/creative/3.jpeg",
        description: "Special seasonal family pass promo banner.",
      },
      {
        id: "hv-4",
        title: "Happy Valley Campaign Creative 04",
        category: "Event Highlights",
        image: "/happy_valley_park/creative/4.jpeg",
        description: "Weekend attraction & staycation showcase creative.",
      },
      {
        id: "hv-5",
        title: "Happy Valley Campaign Creative 05",
        category: "Social Campaign",
        image: "/happy_valley_park/creative/5.jpeg",
        description: "Pool party & resort event highlights.",
      },
    ],
    reels: [
      {
        id: "hvr-1",
        title: "Happy Valley Water Park Feature Reel",
        category: "Reels",
        poster: "/happy_valley_park/thumbnail.png",
        videoUrl: "/happy_valley_park/reels/Water Park.mp4",
        views: "142K",
        duration: "0:30",
      },
      {
        id: "hvr-2",
        title: "Happy Valley Official Final Showcase",
        category: "Reels",
        poster: "/happy_valley_park/creative/1.jpeg",
        videoUrl: "/happy_valley_park/reels/Water Park- Final.mp4",
        views: "198K",
        duration: "0:30",
      },
      {
        id: "hvr-3",
        title: "Happy Valley Water Park Highlight Reel",
        category: "Reels",
        poster: "/happy_valley_park/creative/3.jpeg",
        videoUrl: "/happy_valley_park/reels/Water Park (1).mp4",
        views: "215K",
        duration: "0:25",
      },
    ],
  },
  {
    slug: "royal-enfield",
    no: "02",
    name: "ROYAL ENFIELD",
    client: "Royal Enfield Dealership Network",
    category: "Campaign Creative • Social Media",
    copy: "Created high-impact visual communication designed to strengthen product visibility, generate attention and connect the brand with its local audience.",
    fullDescription: "Royal Enfield stands for freedom, heritage, and raw power. ROYAL300 crafted a dynamic social media & promotional campaign series highlighting iconic motorcycle models, test ride bookings, and rider club community events.",
    heroImage: enfield,
    metrics: ["+72% Content Reach", "+36% Engagement", "3.1× Creative Interaction", "4.5K+ Test Ride Leads"],
    links: {
      website: "https://royalenfield.com",
      instagram: "https://instagram.com/royalenfield",
      facebook: "https://facebook.com/royalenfield",
    },
    servicesProvided: [
      "Social Media Management",
      "Web Development",
      "Website Maintenance",
    ],
    categories: ["All", "Product Launch", "Rider Stories", "Test Ride Ads", "Branding"],
    creatives: [
      {
        id: "re-1",
        title: "The Legend Reborn - Bullet 350",
        category: "Product Launch",
        image: enfield,
        description: "Studio lighting creative highlighting metallic detail and classic silhouette.",
      },
      {
        id: "re-2",
        title: "Mountain Conquest Tour",
        category: "Rider Stories",
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
        description: "Cinematic adventure banner capturing Himalayan rides.",
      },
      {
        id: "re-3",
        title: "Weekend Test Ride Campaign",
        category: "Test Ride Ads",
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
        description: "Direct response social banner for local dealership test ride registrations.",
      },
      {
        id: "re-4",
        title: "Hunter 350 Urban Explorer",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1515777315837-281b920135d5?auto=format&fit=crop&w=1000&q=80",
        description: "Urban lifestyle creative aimed at young city commuters.",
      },
    ],
    reels: [
      {
        id: "rer-1",
        title: "Himalayan 450 Exhaust Sound & Pure Power",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-motorcycle-speeding-on-the-road-42777-large.mp4",
        views: "310K",
        duration: "0:18",
      },
      {
        id: "rer-2",
        title: "Custom Chrome Finish Showcase",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-riding-a-motorcycle-on-a-road-42776-large.mp4",
        views: "185K",
        duration: "0:28",
      },
    ],
  },
  {
    slug: "spectrum-cafe",
    no: "03",
    name: "SPECTRUM CAFE",
    client: "Spectrum Artisanal Roastery & Cafe",
    category: "Branding • Social Media • Promotional Marketing",
    copy: "Developed a visually consistent digital identity and promotional communication system designed to increase local visibility and drive customers toward the cafe.",
    fullDescription: "Spectrum Cafe needed a brand refresh and localized social strategy to establish itself as the premier specialty coffee hub. We designed elegant minimalist social graphics, daily menu promos, and viral barista reels.",
    heroImage: cafe,
    metrics: ["+64% Reach", "+47% Engagement", "+29% Promotional Response", "3.8K+ New Visitors"],
    links: {
      website: "https://spectrumcafe.com",
      instagram: "https://instagram.com/spectrumcafe",
      facebook: "https://facebook.com/spectrumcafe",
    },
    servicesProvided: [
      "Social Media Management",
      "Web Development",
      "Website Maintenance",
    ],
    categories: ["All", "Menu Creatives", "Brand Aesthetic", "Promotional Ads"],
    creatives: [
      {
        id: "sc-1",
        title: "Artisanal Pour-Over Series",
        category: "Brand Aesthetic",
        image: cafe,
        description: "Minimalist coffee photography paired with warm, modern typography.",
      },
      {
        id: "sc-2",
        title: "Weekend Brunch Menu Reveal",
        category: "Menu Creatives",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
        description: "Visual menu showcase showcasing specialty lattes and freshly baked pastries.",
      },
      {
        id: "sc-3",
        title: "Buy 1 Get 1 Coffee Hours",
        category: "Promotional Ads",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
        description: "Targeted Geo-fenced offer post designed to drive afternoon walk-ins.",
      },
    ],
    reels: [
      {
        id: "scr-1",
        title: "Perfect Latte Art Symphony",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barista-making-a-coffee-with-latte-art-41589-large.mp4",
        views: "275K",
        duration: "0:15",
      },
      {
        id: "scr-2",
        title: "Behind the Beans: Cold Brew Process",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-into-a-glass-with-ice-41591-large.mp4",
        views: "120K",
        duration: "0:22",
      },
    ],
  },
  {
    slug: "a-banik-jewellers",
    no: "04",
    name: "A BANIK JEWELLERS",
    client: "A Banik Heritage Jewellery",
    category: "Brand Identity • Digital Experience • Marketing",
    copy: "Created a premium digital presence designed to communicate craftsmanship, trust and product quality while strengthening the jewellery brand's online positioning.",
    fullDescription: "A Banik Jewellers is a heritage fine jewellery brand. ROYAL300 reimagined their digital showcase with ultra-luxurious visual creative, festive campaign launches, and royal wedding collection highlights.",
    heroImage: jewellers,
    metrics: ["+81% Visual Engagement", "+43% Audience Growth", "2.7× Campaign Interaction", "850+ Consultation Leads"],
    links: {
      website: "https://abanikjewellers.com",
      instagram: "https://instagram.com/abanikjewellers",
      facebook: "https://facebook.com/abanikjewellers",
    },
    servicesProvided: [
      "Social Media Management",
      "Web Development",
      "Website Maintenance",
    ],
    categories: ["All", "Bridal Heritage", "Festive Collection", "Craftsmanship"],
    creatives: [
      {
        id: "ab-1",
        title: "Royal Bridal Heritage Collection",
        category: "Bridal Heritage",
        image: jewellers,
        description: "Opulent gold and kundan necklace displayed on white silk backdrop.",
      },
      {
        id: "ab-2",
        title: "Dhanteras Diamond Suite",
        category: "Festive Collection",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
        description: "Sparkling solitaire diamond ring collection in luxury box setup.",
      },
      {
        id: "ab-3",
        title: "Art of Gold Carving",
        category: "Craftsmanship",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
        description: "Behind the scenes master goldsmith carving traditional temple jewellery.",
      },
    ],
    reels: [
      {
        id: "abr-1",
        title: "Shine Like Royalty - Unboxing 22k Gold Set",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-jewelry-and-gemstones-41584-large.mp4",
        views: "430K",
        duration: "0:25",
      },
      {
        id: "abr-2",
        title: "Diamond Ring Clarity Showcase",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-diamond-ring-41583-large.mp4",
        views: "290K",
        duration: "0:20",
      },
    ],
  },
  {
    slug: "fashion-retail-brand",
    no: "05",
    name: "FASHION / RETAIL BRAND",
    client: "Luxe Apparel & Accessories",
    category: "Creative Marketing • Social Media",
    copy: "Designed campaign communication that transformed products into visually compelling stories and helped create a stronger digital connection with the target audience.",
    fullDescription: "A modern couture and streetwear fashion label that required high-octane visual storytelling. ROYAL300 produced lookbook campaigns, modern pop-up event teasers, and shoppable reel highlights.",
    heroImage: fashion,
    metrics: ["+54% Reach", "+38% Engagement", "2.2× Content Interaction", "6.2K+ Shop Visits"],
    links: {
      website: "https://fashionretail.com",
      instagram: "https://instagram.com/fashionbrand",
      facebook: "https://facebook.com/fashionbrand",
    },
    servicesProvided: [
      "Social Media Management",
      "Web Development",
      "Website Maintenance",
    ],
    categories: ["All", "Lookbook", "Editorial", "Streetwear", "Seasonal Drop"],
    creatives: [
      {
        id: "fr-1",
        title: "Autumn Editorial Drop",
        category: "Editorial",
        image: fashion,
        description: "High fashion editorial campaign photograph featuring autumn palette.",
      },
      {
        id: "fr-2",
        title: "Urban Streetwear Lookbook",
        category: "Streetwear",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
        description: "Vibrant urban street fashion shoot styled for Gen-Z audience.",
      },
      {
        id: "fr-3",
        title: "Monochrome Minimalist Line",
        category: "Lookbook",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80",
        description: "Sleek black & white apparel campaign for luxury retail catalog.",
      },
    ],
    reels: [
      {
        id: "frr-1",
        title: "Runway Highlights & Model Walk",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-down-a-runway-41581-large.mp4",
        views: "520K",
        duration: "0:30",
      },
      {
        id: "frr-2",
        title: "Style 1 Outfit in 3 Different Ways",
        category: "Reels",
        poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-fashion-photoshoot-41582-large.mp4",
        views: "340K",
        duration: "0:25",
      },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projectsData.find((p) => p.slug === slug);
}

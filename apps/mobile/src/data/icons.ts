import { icons } from "lucide-react-native";

export const ICONS_LIST = Object.entries(icons);

export const DEFAULT_RECENT_ICONS_LIST: (keyof typeof icons)[] = [
  "Activity",
  "Weight",
  "Book",
  "Clock",
  "BicepsFlexed",
  "PartyPopper",
  "Paintbrush",
  "Apple",
  "Leaf",
  "Dumbbell",
];
export const IconsWithTopics = {
  Sports: [
    "Activity",
    "Dumbbell",
    // "Volleyball", → Not available
    // "Skateboard", → Not available
    "Trophy",
    "Award", // Alternative for Trophy
    "Flag", // General sports use
  ],

  Creativity: [
    "Palette",
    "PenTool",
    "Image",
    "Brush",
    "Camera",
    "Music",
    "Mic",
    "Pencil",
    "Paintbrush",
    "Scissors",
    "Film",
    "Feather",
    "Layers",
  ],

  Foods: [
    "Coffee",
    "CupSoda", // Instead of "Cup"
    "Cake",
    "Pizza",
    "Egg",
    "Fish",
    "Cherry",
    "Beer",
    "Wine",
    "Apple",
    "Cookie",
    "Carrot",
    "Banana", // Additional food icon
  ],

  Finance: [
    "CreditCard",
    "DollarSign",
    "TrendingUp",
    "TrendingDown",
    "Wallet",
    "Banknote",
    "Coins", // Instead of "Coin"
    "Calculator",
    "Percent",
    "Clipboard",
    "FileText",
  ],

  Technology: [
    "Cpu",
    "Smartphone",
    "Monitor",
    "Server",
    "Usb",
    "Wifi",
    "Battery",
    "HardDrive",
    "Database",
    "Cloud",
    "Keyboard",
    "Mouse",
  ],

  Communication: [
    "MessageCircle",
    "Phone",
    "Mail",
    "Video",
    "MessageSquare", // Instead of "Chat"
    "Bell",
    "User",
    "Users",
    "Globe",
    "Headphones",
    "Mic", // Instead of "Microphone"
    "Speaker",
    "PhoneCall",
    "Rss",
    "Share2", // Instead of "Share"
  ],

  Study: [
    "Book",
    "BookOpen",
    "Bookmark",
    "GraduationCap",
    "Pen",
    "Pencil",
    "Clipboard",
    "FileText",
    "File",
    "Library",
    "Notebook",
    "Headphones",
    "LampDesk", // Instead of "Lamp"
  ],

  Productivity: [
    "Calendar",
    "Clipboard",
    "Clock",
    "FileText",
    "Folder",
    "List",
    "Lock",
    "RefreshCcw",
    "Settings",
    "Upload",
  ],
};

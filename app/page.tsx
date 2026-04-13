"use client";

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  CreditCard,
  FolderKanban,
  Globe,
  Heart,
  House,
  Lock,
  Mail,
  MapPin,
  Moon,
  PenSquare,
  Phone,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Sun,
  Tag,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

type ThemeMode = "light" | "dark";
type AppStage = "signin_details" | "signin_payment" | "signin_confirmation" | "app";
type PageKey =
  | "home"
  | "favorites"
  | "projects"
  | "settings"
  | "account_info"
  | "answers_summary"
  | "questionnaire"
  | "project_detail";

type PlanKey = "starter" | "pro" | "skip";

type SharedProject = {
  id: number;
  title: string;
  creator: string;
  category: string;
  location: string;
  description: string;
  tags: string[];
  profileKeywords: string[];
  thumbnail?: string;
  score?: number;
  reasons?: string[];
};

type UserProject = {
  id: number;
  title: string;
  creator: string;
  category: string;
  location: string;
  description: string;
  tags: string[];
  visibility: "private" | "public";
  thumbnail?: string;
};

type Project = SharedProject | UserProject;

type Question = {
  id: string;
  category: string;
  type: "select" | "textarea";
  label: string;
  options?: string[];
  placeholder?: string;
};

type ThemeStyles = {
  appBg: string;
  panel: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  primaryText: string;
  pill: string;
  shadow: string;
};

const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

const COUNTRIES = [
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Vietnam",
];

const REGIONS = [
  "Auckland",
  "Bavaria",
  "British Columbia",
  "California",
  "Catalonia",
  "Colorado",
  "Dubai",
  "England",
  "Florida",
  "Gauteng",
  "Hokkaido",
  "Illinois",
  "Île-de-France",
  "Jalisco",
  "Karnataka",
  "Lagos",
  "Lisbon District",
  "Maharashtra",
  "Metro Manila",
  "Mexico City",
  "New South Wales",
  "New York",
  "North Holland",
  "Northern District",
  "Ontario",
  "Oregon",
  "Queensland",
  "Quebec",
  "Rio de Janeiro",
  "Santiago Metropolitan",
  "Scotland",
  "São Paulo",
  "Texas",
  "Tokyo",
  "Victoria",
  "Washington",
  "Western Cape",
  "Zurich",
];

const CITIES = [
  "Amsterdam",
  "Athens",
  "Auckland",
  "Austin",
  "Bangkok",
  "Barcelona",
  "Beijing",
  "Berlin",
  "Bogotá",
  "Boston",
  "Brussels",
  "Buenos Aires",
  "Cape Town",
  "Chicago",
  "Copenhagen",
  "Dallas",
  "Denver",
  "Dubai",
  "Dublin",
  "Edinburgh",
  "Florence",
  "Frankfurt",
  "Hanoi",
  "Ho Chi Minh City",
  "Hong Kong",
  "Houston",
  "Istanbul",
  "Jakarta",
  "Jerusalem",
  "Johannesburg",
  "Joshua Tree",
  "Kyoto",
  "Lagos",
  "Lisbon",
  "London",
  "Los Angeles",
  "Madrid",
  "Melbourne",
  "Mexico City",
  "Miami",
  "Milan",
  "Montreal",
  "Mumbai",
  "Munich",
  "Nairobi",
  "New York City",
  "Osaka",
  "Paris",
  "Perth",
  "Portland",
  "Prague",
  "Rio de Janeiro",
  "Rome",
  "San Diego",
  "San Francisco",
  "Santiago",
  "São Paulo",
  "Seattle",
  "Seoul",
  "Singapore",
  "Stockholm",
  "Sydney",
  "Tel Aviv",
  "Tokyo",
  "Toronto",
  "Vancouver",
  "Vienna",
  "Warsaw",
  "Washington, D.C.",
  "Zurich",
];

const PLAN_OPTIONS: {
  key: PlanKey;
  title: string;
  price: string;
  subtitle: string;
}[] = [
  {
    key: "starter",
    title: "Starter Plan",
    price: "$1",
    subtitle: "One-time starter access for prototype testing.",
  },
  {
    key: "pro",
    title: "Pro Plan",
    price: "$10/month",
    subtitle: "Monthly plan for extended access and future premium features.",
  },
  {
    key: "skip",
    title: "Skip for Now",
    price: "$0 now",
    subtitle: "Continue through the prototype without entering payment details.",
  },
];

const sharedProjectsSeed: SharedProject[] = [
  {
    id: 1,
    title: "San Diego Family Garden Co-op",
    creator: "Ava Chen",
    category: "Community Living",
    location: "San Diego, California, United States, North America",
    description:
      "A family-friendly garden and skills-sharing group focused on food growing, homeschooling meetups, and weekend build days.",
    tags: ["family", "gardening", "homeschool", "community"],
    profileKeywords: ["family", "garden", "homeschool", "community", "teaching", "kids"],
    thumbnail: "SD",
  },
  {
    id: 2,
    title: "Joshua Tree Off-Grid Build Camp",
    creator: "Marcus Lee",
    category: "Off-Grid",
    location: "Joshua Tree, California, United States, North America",
    description:
      "A hands-on off-grid project building solar-ready tiny structures, water systems, and a shared maker yard in the desert.",
    tags: ["off-grid", "solar", "building", "tiny home"],
    profileKeywords: ["off-grid", "solar", "build", "land", "construction", "independence"],
    thumbnail: "JT",
  },
  {
    id: 3,
    title: "Portland Creative Homestead Circle",
    creator: "Lina Patel",
    category: "Creative Community",
    location: "Portland, Oregon, United States, North America",
    description:
      "A small homestead network for artists, gardeners, and families who want shared meals, workshops, and creative studio days.",
    tags: ["art", "homestead", "families", "workshops"],
    profileKeywords: ["creative", "art", "music", "homestead", "community", "family"],
    thumbnail: "PC",
  },
  {
    id: 4,
    title: "Austin Remote Work + Build Collective",
    creator: "Daniel Ross",
    category: "Hybrid Living",
    location: "Austin, Texas, United States, North America",
    description:
      "A community for people balancing remote work with intentional living, weekend building projects, and shared land planning.",
    tags: ["remote work", "building", "land", "planning"],
    profileKeywords: ["remote", "operations", "tech", "building", "planning", "community"],
    thumbnail: "AT",
  },
  {
    id: 5,
    title: "Northern Arizona Learning Village",
    creator: "Sofia Alvarez",
    category: "Education",
    location: "Flagstaff, Arizona, United States, North America",
    description:
      "A learning-focused village idea for families who want outdoor education, nature-based routines, and skill-sharing pods.",
    tags: ["education", "nature", "families", "village"],
    profileKeywords: ["education", "family", "village", "nature", "teaching", "kids"],
    thumbnail: "AZ",
  },
  {
    id: 6,
    title: "Northern California Regenerative Farm Hub",
    creator: "Priya Singh",
    category: "Regenerative Farming",
    location: "San Francisco, California, United States, North America",
    description:
      "A regenerative farm startup looking for growers, builders, and families interested in long-term community life on shared land.",
    tags: ["farming", "regenerative", "land", "families"],
    profileKeywords: ["farm", "land", "family", "off-grid", "growing", "healing"],
    thumbnail: "NC",
  },
];

const myProjectCategories = [
  "Community Living",
  "Off-Grid",
  "Creative Community",
  "Hybrid Living",
  "Education",
  "Regenerative Farming",
  "General",
] as const;

const navItems: { key: Exclude<PageKey, "questionnaire" | "project_detail">; label: string; icon: LucideIcon }[] =
  [
    { key: "home", label: "Home", icon: House },
    { key: "favorites", label: "Favorites", icon: Heart },
    { key: "projects", label: "My Projects", icon: FolderKanban },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "account_info", label: "Account Info", icon: User },
    { key: "answers_summary", label: "Answers Summary", icon: Compass },
  ];

const categoryOrder = [
  "Status",
  "Location + Timing",
  "Project Preferences",
  "Lifestyle",
  "Work + Finances",
  "Skills + Abilities",
  "Commitment + Fit",
] as const;

function normalizeTokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getAdaptiveQuestions(currentLocation: string, answers: Record<string, string>): Question[] {
  const locationLower = currentLocation.toLowerCase();
  const inCalifornia =
    locationLower.includes("california") ||
    locationLower.includes("san diego") ||
    locationLower.includes("los angeles");

  const householdType = answers.household_type || "household";
  const projectType = answers.project_type || "community";
  const primaryStrength = answers.primary_strength || "your main strength";
  const timeline = answers.timeline || "sometime soon";

  return [
    {
      id: "household_type",
      category: "Status",
      type: "select",
      label: "Which best describes your current household status?",
      options: ["Individual", "Couple", "Family with kids", "Family without kids", "Friends / group"],
    },
    {
      id: "household_size",
      category: "Status",
      type: "select",
      label: `How many people are in ${householdType.toLowerCase()}?`,
      options: ["1", "2", "3-4", "5-6", "7+"],
    },
    {
      id: "timeline",
      category: "Location + Timing",
      type: "select",
      label: "How soon are you realistically hoping to make a move or join a project?",
      options: ["Just researching", "Within 6-12 months", "Within 3-6 months", "Within 1-3 months", "Ready now"],
    },
    {
      id: "distance_preference",
      category: "Location + Timing",
      type: "select",
      label: `How far from ${currentLocation || "your current location"} would you consider going?`,
      options: inCalifornia
        ? ["Stay very local", "Anywhere in California", "Western U.S.", "Anywhere in the U.S.", "Open internationally"]
        : ["Stay very local", "Within my region", "Anywhere in my state", "Anywhere in the U.S.", "Open internationally"],
    },
    {
      id: "project_type",
      category: "Project Preferences",
      type: "select",
      label: "What kind of project are you most drawn to right now?",
      options: ["Off-grid build", "Family community", "Creative homestead", "Regenerative farm", "Remote-work community", "Education village"],
    },
    {
      id: "climate_preference",
      category: "Project Preferences",
      type: "select",
      label: `Based on being in ${currentLocation || "your location"}, what climate or environment feels best for you?`,
      options: inCalifornia
        ? ["Coastal / mild", "Mountain / forest", "Desert / dry", "Rural farmland", "No strong preference"]
        : ["Warm / sunny", "Cool / forested", "Dry / desert", "Rural farmland", "No strong preference"],
    },
    {
      id: "community_style",
      category: "Lifestyle",
      type: "select",
      label: "How much community interaction do you want in daily life?",
      options: ["Mostly private", "Small circle", "Balanced mix", "Highly communal", "Flexible / depends on project"],
    },
    {
      id: "housing_style",
      category: "Lifestyle",
      type: "select",
      label: `For a ${projectType.toLowerCase()} setup, what housing style feels like the best fit?`,
      options: ["Private house", "Cabin / tiny home", "Shared land with separate homes", "Intentional shared housing", "Still exploring"],
    },
    {
      id: "work_style",
      category: "Work + Finances",
      type: "select",
      label: "What best describes your current work or income style?",
      options: ["Remote work", "Local job / business", "Self-employed", "Homemaker / caretaker", "Mixed / transitioning"],
    },
    {
      id: "budget_status",
      category: "Work + Finances",
      type: "select",
      label: "What is your current financial readiness for joining or building something?",
      options: ["Very limited right now", "Modest budget", "Can contribute steadily", "Can invest meaningfully", "Need flexible arrangements"],
    },
    {
      id: "build_readiness",
      category: "Skills + Abilities",
      type: "select",
      label: "How ready are you for physical building, setup, or hands-on project work?",
      options: ["Prefer non-physical roles", "Can help lightly", "Can help regularly", "Strong hands-on contributor", "Depends on the project"],
    },
    {
      id: "family_fit",
      category: "Lifestyle",
      type: "select",
      label: householdType.toLowerCase().includes("family")
        ? "What kind of child and family support matters most to you?"
        : "How important is it that the project be family-friendly or child-compatible?",
      options: ["Very important", "Helpful but not essential", "Neutral", "Only if the fit is right", "Not important"],
    },
    {
      id: "food_lifestyle",
      category: "Project Preferences",
      type: "select",
      label: "Which lifestyle element matters most in the project’s daily culture?",
      options: ["Gardening / food growing", "Health / wellness", "Learning / education", "Creativity / arts", "Building / making"],
    },
    {
      id: "accessibility_needs",
      category: "Status",
      type: "select",
      label: "What best describes your accessibility, health, or energy considerations right now?",
      options: ["No major constraints", "Need moderate flexibility", "Need strong accessibility support", "Need lower-physical-intensity roles", "Prefer not to say"],
    },
    {
      id: "primary_strength",
      category: "Skills + Abilities",
      type: "select",
      label: "What is your strongest contribution to a community or project?",
      options: ["Teaching / mentoring", "Building / construction", "Gardening / farming", "Operations / organizing", "Creative / arts", "Wellness / care"],
    },
    {
      id: "secondary_strength",
      category: "Skills + Abilities",
      type: "select",
      label: `What is your second-strongest contribution alongside ${primaryStrength.toLowerCase()}?`,
      options: ["Teaching / mentoring", "Building / construction", "Gardening / farming", "Operations / organizing", "Creative / arts", "Wellness / care"],
    },
    {
      id: "role_preference",
      category: "Commitment + Fit",
      type: "select",
      label: "What role do you naturally want in a community?",
      options: ["Leader / initiator", "Reliable builder", "Organizer / systems person", "Caregiver / support role", "Explorer / still figuring it out"],
    },
    {
      id: "deal_breakers",
      category: "Commitment + Fit",
      type: "textarea",
      label: `What are your biggest deal-breakers for a ${projectType.toLowerCase()} project?`,
      placeholder: "For example: too isolated, too crowded, not enough privacy, bad school fit, unclear ownership...",
    },
    {
      id: "relocation_readiness",
      category: "Location + Timing",
      type: "select",
      label: `Given your timeline of ${timeline.toLowerCase()}, how ready are you for real-world relocation steps?`,
      options: ["Not ready yet", "Collecting information", "Can start planning soon", "Actively preparing", "Already taking action"],
    },
    {
      id: "success_definition",
      category: "Commitment + Fit",
      type: "textarea",
      label: "What would success look like for you one year after joining the right project?",
      placeholder: "Describe the life, rhythm, environment, and sense of belonging you want.",
    },
  ];
}

function ThemeButton({
  children,
  active,
  onClick,
  themeStyles,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  themeStyles: ThemeStyles;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-95 ${className}`}
      style={{
        backgroundColor: active ? themeStyles.primary : themeStyles.card,
        color: active ? themeStyles.primaryText : themeStyles.text,
        borderColor: active ? themeStyles.primary : themeStyles.border,
      }}
    >
      {children}
    </button>
  );
}

function ThemeInput({
  value,
  onChange,
  placeholder,
  themeStyles,
  multiline = false,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  themeStyles: ThemeStyles;
  multiline?: boolean;
}) {
  const sharedProps = {
    value,
    onChange,
    placeholder,
    className: "w-full rounded-2xl border px-4 py-3 text-sm outline-none placeholder:text-slate-400",
    style: {
      backgroundColor: themeStyles.panel,
      color: themeStyles.text,
      borderColor: themeStyles.border,
    },
  };

  if (multiline) {
    return <textarea rows={4} {...sharedProps} />;
  }

  return <input {...sharedProps} />;
}

function InfoCard({
  children,
  themeStyles,
  className = "",
}: {
  children: ReactNode;
  themeStyles: ThemeStyles;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border ${className}`}
      style={{
        backgroundColor: themeStyles.card,
        borderColor: themeStyles.border,
        boxShadow: themeStyles.shadow,
      }}
    >
      {children}
    </div>
  );
}

function ThemeSelect({
  value,
  onChange,
  options,
  placeholder,
  themeStyles,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  themeStyles: ThemeStyles;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
      style={{
        backgroundColor: themeStyles.panel,
        color: themeStyles.text,
        borderColor: themeStyles.border,
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default function Prototype4() {
  const [appStage, setAppStage] = useState<AppStage>("signin_details");
  const [page, setPage] = useState<PageKey>("home");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<number[]>([1, 2]);
  const [recentActivity, setRecentActivity] = useState<string[]>([
    "Opened Prototype 4",
    "Saved Joshua Tree Off-Grid Build Camp",
    "Viewed San Diego Family Garden Co-op",
  ]);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [selectedPlan, setSelectedPlan] = useState<PlanKey | "">("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, string>>({});
  const [questionnaireStep, setQuestionnaireStep] = useState(0);

  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectCategory, setProjectCategory] = useState<(typeof myProjectCategories)[number]>("Community Living");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTags, setProjectTags] = useState("");
  const [projectVisibility, setProjectVisibility] = useState<"private" | "public">("private");

  const isDark = theme === "dark";

  const themeStyles: ThemeStyles = isDark
    ? {
        appBg: "#0b1220",
        panel: "#0f172a",
        card: "#111c34",
        border: "#24324b",
        text: "#e5eefc",
        muted: "#9cb0cf",
        primary: "#7aa2ff",
        primaryText: "#08111f",
        pill: "#15233f",
        shadow: "0 18px 40px rgba(0,0,0,0.35)",
      }
    : {
        appBg: "#f4f7fb",
        panel: "#ffffff",
        card: "#ffffff",
        border: "#dbe4f0",
        text: "#0f172a",
        muted: "#5b6b82",
        primary: "#5b8cff",
        primaryText: "#ffffff",
        pill: "#eef4ff",
        shadow: "0 18px 40px rgba(15,23,42,0.08)",
      };

  const shellTextClass = isDark ? "text-slate-100" : "text-slate-900";
  const mutedTextClass = isDark ? "text-slate-300" : "text-slate-600";
  const placeholderClass = isDark ? "placeholder:text-slate-500" : "placeholder:text-slate-400";

  const currentLocation = useMemo(() => {
    if (!selectedCity || !selectedRegion || !selectedCountry || !selectedContinent) return "";
    return `${selectedCity}, ${selectedRegion}, ${selectedCountry}, ${selectedContinent}`;
  }, [selectedCity, selectedRegion, selectedCountry, selectedContinent]);

  const signInDetailsReady =
    email.trim() !== "" &&
    phone.trim() !== "" &&
    selectedContinent !== "" &&
    selectedCountry !== "" &&
    selectedRegion !== "" &&
    selectedCity !== "";

  const signInPaymentReady = selectedPlan !== "";

  const planLabel = useMemo(() => {
    if (selectedPlan === "starter") return "Starter Plan — $1";
    if (selectedPlan === "pro") return "Pro Plan — $10/month";
    if (selectedPlan === "skip") return "Skip for Now — prototype access";
    return "No plan selected";
  }, [selectedPlan]);

  const adaptiveQuestions = useMemo<Question[]>(
    () => getAdaptiveQuestions(currentLocation, questionnaireAnswers),
    [currentLocation, questionnaireAnswers]
  );

  const currentQuestion = adaptiveQuestions[questionnaireStep] ?? adaptiveQuestions[0];

  const answeredCount = adaptiveQuestions.filter((question) => {
    const value = questionnaireAnswers[question.id];
    return String(value || "").trim().length > 0;
  }).length;

  const questionnaireComplete = answeredCount === adaptiveQuestions.length;
  const questionnaireProgressPercent = Math.round((answeredCount / adaptiveQuestions.length) * 100);

  const initials = useMemo(() => {
    if (!email) return "U";
    return email.slice(0, 2).toUpperCase();
  }, [email]);

  const filteredSharedProjects = useMemo<SharedProject[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sharedProjectsSeed;

    return sharedProjectsSeed.filter((project) => {
      const blob = [project.title, project.creator, project.category, project.location, project.description, ...project.tags]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [searchQuery]);

  const favoriteProjects = useMemo<SharedProject[]>(
    () => sharedProjectsSeed.filter((project) => favoriteProjectIds.includes(project.id)),
    [favoriteProjectIds]
  );

  const publicProjectsCount = useMemo<number>(
    () => userProjects.filter((project) => project.visibility === "public").length,
    [userProjects]
  );

  const groupedSummary = useMemo<Record<string, { id: string; label: string; value: string }[]>>(() => {
    const summary: Record<string, { id: string; label: string; value: string }[]> = {};
    adaptiveQuestions.forEach((question) => {
      if (!summary[question.category]) summary[question.category] = [];
      summary[question.category].push({
        id: question.id,
        label: question.label,
        value: questionnaireAnswers[question.id] || "Not answered yet",
      });
    });
    return summary;
  }, [adaptiveQuestions, questionnaireAnswers]);

  const recommendedProjects = useMemo<SharedProject[]>(() => {
    if (!questionnaireComplete) return [];

    const tokenSource = [currentLocation, ...Object.values(questionnaireAnswers)].join(" ");
    const tokens = normalizeTokens(tokenSource);

    return sharedProjectsSeed
      .map((project): SharedProject => {
        const blob = [project.location, project.category, project.description, ...project.tags, ...project.profileKeywords]
          .join(" ")
          .toLowerCase();

        let score = 0;
        const reasons: string[] = [];

        tokens.forEach((token) => {
          if (token.length > 2 && blob.includes(token)) {
            score += 1;
          }
        });

        const locationTokens = normalizeTokens(currentLocation);
        const locationHit = locationTokens.find((token) => project.location.toLowerCase().includes(token));

        if (locationHit) {
          score += 3;
          reasons.push(`Location fit: ${locationHit}`);
        }

        const projectType = String(questionnaireAnswers.project_type || "").toLowerCase();
        if (projectType && blob.includes(projectType.split(" ")[0])) {
          score += 3;
          reasons.push(`Project type fit: ${questionnaireAnswers.project_type}`);
        }

        const strength = String(questionnaireAnswers.primary_strength || "").toLowerCase();
        if (strength && blob.includes(strength.split(" ")[0])) {
          score += 2;
          reasons.push(`Matches your strength: ${questionnaireAnswers.primary_strength}`);
        }

        const lifestyle = String(questionnaireAnswers.food_lifestyle || "").toLowerCase();
        if (lifestyle && blob.includes(lifestyle.split(" ")[0])) {
          score += 2;
          reasons.push(`Lifestyle fit: ${questionnaireAnswers.food_lifestyle}`);
        }

        return {
          ...project,
          score,
          reasons: reasons.slice(0, 3),
        };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3);
  }, [currentLocation, questionnaireAnswers, questionnaireComplete]);

  const addActivity = (entry: string) => {
    setRecentActivity((prev) => [entry, ...prev].slice(0, 8));
  };

  const toggleFavorite = (projectId: number, title: string) => {
    setFavoriteProjectIds((prev) => {
      const exists = prev.includes(projectId);
      addActivity(exists ? `Removed ${title} from favorites` : `Saved ${title} to favorites`);
      return exists ? prev.filter((id) => id !== projectId) : [projectId, ...prev];
    });
  };

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setPage("project_detail");
    addActivity(`Viewed ${project.title}`);
  };

  const updateAnswer = (questionId: string, value: string) => {
    setQuestionnaireAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const createProject = () => {
    if (!projectTitle.trim() || !projectLocation.trim() || !projectDescription.trim()) return;

    const newProject: UserProject = {
      id: Date.now(),
      title: projectTitle.trim(),
      location: projectLocation.trim(),
      category: projectCategory,
      description: projectDescription.trim(),
      tags: projectTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      visibility: projectVisibility,
      creator: email || "You",
    };

    setUserProjects((prev) => [newProject, ...prev]);
    addActivity(`Created ${newProject.title}`);
    setProjectTitle("");
    setProjectLocation("");
    setProjectCategory("Community Living");
    setProjectDescription("");
    setProjectTags("");
    setProjectVisibility("private");
    setShowCreateForm(false);
    setPage("projects");
  };

  const ProjectCard = ({
    project,
    compact = false,
  }: {
    project: Project;
    compact?: boolean;
  }) => {
    const isFavorite = favoriteProjectIds.includes(project.id);

    return (
      <button onClick={() => openProjectDetail(project)} className="w-full text-left transition hover:-translate-y-0.5">
        <InfoCard themeStyles={themeStyles} className="h-full p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-semibold"
                style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.text }}
              >
                {project.thumbnail || project.title.slice(0, 2).toUpperCase()}
              </div>
              <div
                className="inline-flex rounded-full border px-2.5 py-1 text-xs"
                style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
              >
                {project.category}
              </div>
            </div>

            <button
              onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(project.id, project.title);
              }}
              className="rounded-full border p-2"
              style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border, color: themeStyles.text }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>

          <h3 className="text-lg font-semibold">{project.title}</h3>

          <div className={`mt-2 flex items-center gap-2 text-sm ${mutedTextClass}`}>
            <MapPin className="h-4 w-4" />
            <span>{project.location}</span>
          </div>

          <p className={`mt-3 text-sm leading-6 ${mutedTextClass}`}>
            {compact
              ? project.description.slice(0, 115) + (project.description.length > 115 ? "..." : "")
              : project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.text }}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </InfoCard>
      </button>
    );
  };

  if (appStage === "signin_details") {
    return (
      <div className={`min-h-screen ${shellTextClass}`} style={{ backgroundColor: themeStyles.appBg }}>
        <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div
              className="inline-flex rounded-full border px-4 py-1.5 text-sm"
              style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
            >
              Prototype 4
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight">Step 1: account details.</h1>
              <p className={`max-w-xl text-lg leading-8 ${mutedTextClass}`}>
                Enter your email, phone number, and location first. Payment and plan selection now happen in a separate step right after this.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "Step 1", text: "Enter email, phone, and location.", icon: User },
                { title: "Step 2", text: "Choose a plan and optionally enter payment info.", icon: CreditCard },
                { title: "Step 3", text: "See a short confirmation screen before Home.", icon: CheckCircle2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <InfoCard key={item.title} themeStyles={themeStyles} className="p-5">
                    <Icon className="mb-4 h-5 w-5" />
                    <p className="font-semibold">{item.title}</p>
                    <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>{item.text}</p>
                  </InfoCard>
                );
              })}
            </div>
          </div>

          <InfoCard themeStyles={themeStyles} className="p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold">Required account details</h2>
                <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                  Payment is no longer here. This step only collects account basics and location.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Email address</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-3.5 h-4 w-4 ${mutedTextClass}`} />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none ${placeholderClass}`}
                      style={{ backgroundColor: themeStyles.panel, color: themeStyles.text, borderColor: themeStyles.border }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Phone number</label>
                  <div className="relative">
                    <Phone className={`absolute left-4 top-3.5 h-4 w-4 ${mutedTextClass}`} />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none ${placeholderClass}`}
                      style={{ backgroundColor: themeStyles.panel, color: themeStyles.text, borderColor: themeStyles.border }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Continent</label>
                  <ThemeSelect
                    value={selectedContinent}
                    onChange={(e) => setSelectedContinent(e.target.value)}
                    options={CONTINENTS}
                    placeholder="Select continent"
                    themeStyles={themeStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Country</label>
                  <ThemeSelect
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    options={COUNTRIES}
                    placeholder="Select country"
                    themeStyles={themeStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">State / Province / Region</label>
                  <ThemeSelect
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    options={REGIONS}
                    placeholder="Select state / region"
                    themeStyles={themeStyles}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">City</label>
                  <ThemeSelect
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    options={CITIES}
                    placeholder="Select city"
                    themeStyles={themeStyles}
                  />
                </div>

                {currentLocation && (
                  <div
                    className="rounded-2xl border p-4 text-sm"
                    style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.text }}
                  >
                    <p className="font-medium">Saved location preview</p>
                    <p className={`mt-2 ${mutedTextClass}`}>{currentLocation}</p>
                  </div>
                )}
              </div>

              <ThemeButton
                themeStyles={themeStyles}
                active
                onClick={() => {
                  if (!signInDetailsReady) return;
                  addActivity("Completed account details step");
                  setAppStage("signin_payment");
                }}
                className="w-full justify-center py-3"
              >
                Continue to payment and plan
              </ThemeButton>
            </div>
          </InfoCard>
        </div>
      </div>
    );
  }

  if (appStage === "signin_payment") {
    return (
      <div className={`min-h-screen ${shellTextClass}`} style={{ backgroundColor: themeStyles.appBg }}>
        <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div
              className="inline-flex rounded-full border px-4 py-1.5 text-sm"
              style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
            >
              Prototype checkout step
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight">Step 2: plan and payment.</h1>
              <p className={`max-w-xl text-lg leading-8 ${mutedTextClass}`}>
                Choose a plan, optionally enter card details, and continue. This is still a prototype, so no real charge is being processed.
              </p>
            </div>

            <InfoCard themeStyles={themeStyles} className="p-5">
              <h3 className="text-lg font-semibold">Prototype note</h3>
              <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                This payment experience is only simulated for prototype testing. You can choose a plan and continue even if you leave the card fields empty.
              </p>
            </InfoCard>
          </div>

          <InfoCard themeStyles={themeStyles} className="p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold">Select plan and payment</h2>
                <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                  Pick a plan first. For now, every option remains skippable because this is still a prototype.
                </p>
              </div>

              <div className="grid gap-4">
                {PLAN_OPTIONS.map((plan) => {
                  const active = selectedPlan === plan.key;
                  return (
                    <button
                      key={plan.key}
                      onClick={() => setSelectedPlan(plan.key)}
                      className="rounded-3xl border p-5 text-left transition"
                      style={{
                        backgroundColor: active ? themeStyles.primary : themeStyles.card,
                        color: active ? themeStyles.primaryText : themeStyles.text,
                        borderColor: active ? themeStyles.primary : themeStyles.border,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold">{plan.title}</p>
                          <p className={`mt-2 text-sm leading-6 ${active ? "text-inherit" : mutedTextClass}`}>{plan.subtitle}</p>
                        </div>
                        <span className="text-lg font-semibold">{plan.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-3xl border p-5" style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}>
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <p className="font-medium">Card details</p>
                </div>
                <div className="grid gap-4">
                  <ThemeInput value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" themeStyles={themeStyles} />
                  <ThemeInput value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number" themeStyles={themeStyles} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <ThemeInput value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" themeStyles={themeStyles} />
                    <ThemeInput value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" themeStyles={themeStyles} />
                  </div>
                  <ThemeInput
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="Billing address"
                    themeStyles={themeStyles}
                    multiline
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <ThemeButton
                  themeStyles={themeStyles}
                  onClick={() => setAppStage("signin_details")}
                >
                  Back
                </ThemeButton>
                <ThemeButton
                  themeStyles={themeStyles}
                  onClick={() => {
                    setSelectedPlan("skip");
                    addActivity("Skipped payment details");
                    setAppStage("signin_confirmation");
                  }}
                >
                  Skip for now
                </ThemeButton>
                <ThemeButton
                  themeStyles={themeStyles}
                  active
                  onClick={() => {
                    if (!signInPaymentReady) return;
                    addActivity(`Selected ${planLabel}`);
                    setAppStage("signin_confirmation");
                  }}
                >
                  Continue to confirmation
                </ThemeButton>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    );
  }

  if (appStage === "signin_confirmation") {
    return (
      <div className={`min-h-screen ${shellTextClass}`} style={{ backgroundColor: themeStyles.appBg }}>
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
          <InfoCard themeStyles={themeStyles} className="w-full p-8 text-center">
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: themeStyles.primary, color: themeStyles.primaryText }}
            >
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-semibold">You’re all set.</h1>
            <p className={`mx-auto mt-3 max-w-2xl text-sm leading-7 ${mutedTextClass}`}>
              Your account details were saved for the prototype. Selected plan: <strong>{planLabel}</strong>. No real payment is being processed yet.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border p-4 text-left" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}>
                <p className="font-medium">Location</p>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>{currentLocation || "No location saved"}</p>
              </div>
              <div className="rounded-2xl border p-4 text-left" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}>
                <p className="font-medium">Billing status</p>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  {selectedPlan === "skip" ? "Skipped for now" : billingAddress || cardNumber ? "Payment details entered" : "Plan selected without card details"}
                </p>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <ThemeButton themeStyles={themeStyles} onClick={() => setAppStage("signin_payment")}>Back</ThemeButton>
              <ThemeButton
                themeStyles={themeStyles}
                active
                onClick={() => {
                  addActivity("Entered app from confirmation step");
                  setAppStage("app");
                  setPage("home");
                }}
              >
                Go to Home
              </ThemeButton>
            </div>
          </InfoCard>
        </div>
      </div>
    );
  }

  if (page === "questionnaire") {
    const question = currentQuestion;
    const currentValue = questionnaireAnswers[question.id] || "";

    return (
      <div className={`min-h-screen ${shellTextClass}`} style={{ backgroundColor: themeStyles.appBg }}>
        <div className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-10">
          <InfoCard themeStyles={themeStyles} className="w-full p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div
                  className="mb-3 inline-flex rounded-full border px-4 py-1.5 text-sm"
                  style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
                >
                  Account questionnaire
                </div>
                <h1 className="text-3xl font-semibold">
                  Question {questionnaireStep + 1} of {adaptiveQuestions.length}
                </h1>
                <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                  Adaptive one-at-a-time flow based on your previous answers and your location: {currentLocation || "not set yet"}.
                </p>
              </div>

              <ThemeButton themeStyles={themeStyles} onClick={() => setPage("account_info")}>Save and exit</ThemeButton>
            </div>

            <div className="mb-6 h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: themeStyles.pill }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(5, ((questionnaireStep + 1) / adaptiveQuestions.length) * 100)}%`,
                  backgroundColor: themeStyles.primary,
                }}
              />
            </div>

            <div className="mb-2 text-xs uppercase tracking-[0.2em]" style={{ color: themeStyles.muted }}>
              {question.category}
            </div>

            <h2 className="text-2xl font-semibold">{question.label}</h2>

            <div className="mt-6">
              {question.type === "select" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {(question.options || []).map((option) => {
                    const active = currentValue === option;
                    return (
                      <button
                        key={option}
                        onClick={() => updateAnswer(question.id, option)}
                        className="rounded-2xl border px-4 py-4 text-left text-sm font-medium transition"
                        style={{
                          backgroundColor: active ? themeStyles.primary : themeStyles.panel,
                          color: active ? themeStyles.primaryText : themeStyles.text,
                          borderColor: active ? themeStyles.primary : themeStyles.border,
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <ThemeInput
                  value={currentValue}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder || "Type your answer"}
                  themeStyles={themeStyles}
                  multiline
                />
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <ThemeButton
                themeStyles={themeStyles}
                onClick={() => setQuestionnaireStep((prev) => Math.max(0, prev - 1))}
                className="min-w-[120px]"
              >
                Back
              </ThemeButton>

              <div className={`text-sm ${mutedTextClass}`}>
                {answeredCount} of {adaptiveQuestions.length} answered
              </div>

              {questionnaireStep < adaptiveQuestions.length - 1 ? (
                <ThemeButton
                  themeStyles={themeStyles}
                  active
                  onClick={() => {
                    if (!String(currentValue || "").trim()) return;
                    setQuestionnaireStep((prev) => Math.min(adaptiveQuestions.length - 1, prev + 1));
                  }}
                  className="min-w-[120px]"
                >
                  Next
                </ThemeButton>
              ) : (
                <ThemeButton
                  themeStyles={themeStyles}
                  active
                  onClick={() => {
                    if (!String(currentValue || "").trim()) return;
                    addActivity("Completed adaptive questionnaire");
                    setPage("answers_summary");
                  }}
                  className="min-w-[170px]"
                >
                  Finish questionnaire
                </ThemeButton>
              )}
            </div>
          </InfoCard>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${shellTextClass}`} style={{ backgroundColor: themeStyles.appBg }}>
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r p-5 md:block" style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: themeStyles.muted }}>
              Prototype 4
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Workspace</h2>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setPage(item.key);
                    setProfileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition"
                  style={{
                    backgroundColor: active ? themeStyles.primary : "transparent",
                    color: active ? themeStyles.primaryText : themeStyles.text,
                    border: `1px solid ${active ? themeStyles.primary : "transparent"}`,
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <InfoCard themeStyles={themeStyles} className="mt-6 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              <h3 className="font-semibold">Recent activity</h3>
            </div>
            <div className="space-y-3 text-sm" style={{ color: themeStyles.muted }}>
              {recentActivity.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: themeStyles.primary }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </InfoCard>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <div
            className="mb-6 flex flex-col gap-4 rounded-3xl border p-4 md:flex-row md:items-center md:justify-between"
            style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border, boxShadow: themeStyles.shadow }}
          >
            <div
              className="flex w-full max-w-2xl items-center gap-3 rounded-2xl border px-4 py-3"
              style={{ backgroundColor: themeStyles.card, borderColor: themeStyles.border }}
            >
              <Search className="h-4 w-4" style={{ color: themeStyles.muted }} />
              <input
                className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400`}
                placeholder="Search projects by title, location, category, or tags"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: themeStyles.text }}
              />
            </div>

            <div className="relative flex items-center gap-3 self-end md:self-auto">
              <button
                className="rounded-full border p-3"
                style={{ backgroundColor: themeStyles.card, borderColor: themeStyles.border, color: themeStyles.text }}
              >
                <Bell className="h-4 w-4" />
              </button>

              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border px-2 py-1.5"
                style={{ backgroundColor: themeStyles.card, borderColor: themeStyles.border, color: themeStyles.text }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ backgroundColor: themeStyles.primary, color: themeStyles.primaryText }}
                >
                  {initials}
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 top-14 z-20 w-60 rounded-3xl border p-2"
                  style={{ backgroundColor: themeStyles.card, borderColor: themeStyles.border, boxShadow: themeStyles.shadow }}
                >
                  {[
                    { label: "Account Info", action: () => setPage("account_info" as PageKey) },
                    { label: "Answers Summary", action: () => setPage("answers_summary" as PageKey) },
                    { label: "Favorites", action: () => setPage("favorites" as PageKey) },
                    { label: "My Projects", action: () => setPage("projects" as PageKey) },
                    { label: "Settings", action: () => setPage("settings" as PageKey) },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm hover:opacity-90"
                      style={{ color: themeStyles.text }}
                    >
                      {item.label}
                    </button>
                  ))}

                  <div className="my-2 border-t" style={{ borderColor: themeStyles.border }} />

                  <button
                    onClick={() => {
                      setAppStage("signin_details");
                      setProfileMenuOpen(false);
                    }}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm"
                    style={{ color: themeStyles.text }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {page === "home" && (
            <div className="space-y-6">
              <InfoCard themeStyles={themeStyles} className="p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div
                      className="mb-3 inline-flex rounded-full border px-4 py-1.5 text-sm"
                      style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
                    >
                      Recommended projects
                    </div>
                    <h1 className="text-3xl font-semibold">Personalized project matches</h1>
                    <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedTextClass}`}>
                      Recommendations are based on your location plus your adaptive account questionnaire.
                    </p>
                  </div>
                  <Sparkles className="h-6 w-6" style={{ color: themeStyles.primary }} />
                </div>

                {!questionnaireComplete ? (
                  <div className="rounded-3xl border border-dashed p-6" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}>
                    <p className="text-lg font-semibold">No recommendations available.</p>
                    <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                      Please fill out the questionnaire to unlock personalized matches. General projects are still visible below.
                    </p>
                    <div className="mt-4">
                      <ThemeButton
                        themeStyles={themeStyles}
                        active
                        onClick={() => {
                          setQuestionnaireStep(0);
                          setPage("questionnaire");
                        }}
                      >
                        Fill out questionnaire
                      </ThemeButton>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-3">
                    {recommendedProjects.map((project) => (
                      <InfoCard key={project.id} themeStyles={themeStyles} className="p-4">
                        <button className="w-full text-left" onClick={() => openProjectDetail(project)}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-base font-semibold">{project.title}</div>
                            <Star className="h-4 w-4" style={{ color: themeStyles.primary }} />
                          </div>
                          <div className={`mt-2 flex items-center gap-2 text-sm ${mutedTextClass}`}>
                            <MapPin className="h-4 w-4" />
                            <span>{project.location}</span>
                          </div>
                          <ul className={`mt-3 space-y-2 text-sm leading-6 ${mutedTextClass}`}>
                            {project.reasons && project.reasons.length > 0 ? (
                              project.reasons.map((reason) => <li key={reason}>• {reason}</li>)
                            ) : (
                              <li>• Strong overall fit based on your profile.</li>
                            )}
                          </ul>
                        </button>
                      </InfoCard>
                    ))}
                  </div>
                )}
              </InfoCard>

              <InfoCard themeStyles={themeStyles} className="p-6">
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold">Discover projects</h2>
                  <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                    Click a project card to open the full project description page.
                  </p>
                </div>

                {filteredSharedProjects.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredSharedProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} compact />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed p-8 text-center text-sm" style={{ borderColor: themeStyles.border, color: themeStyles.muted }}>
                    No projects matched your search.
                  </div>
                )}
              </InfoCard>
            </div>
          )}

          {page === "favorites" && (
            <InfoCard themeStyles={themeStyles} className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold">Your favorites</h1>
                  <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>Every saved project appears here.</p>
                </div>
                <Heart className="h-6 w-6" style={{ color: themeStyles.primary }} />
              </div>

              {favoriteProjects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {favoriteProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed p-8 text-center text-sm" style={{ borderColor: themeStyles.border, color: themeStyles.muted }}>
                  You have no saved favorites yet.
                </div>
              )}
            </InfoCard>
          )}

          {page === "project_detail" && selectedProject && (
            <div className="space-y-6">
              <ThemeButton themeStyles={themeStyles} onClick={() => setPage("home")}>
                <ArrowLeft className="mr-2 inline h-4 w-4" /> Back to Home
              </ThemeButton>

              <InfoCard themeStyles={themeStyles} className="p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span
                        className="inline-flex rounded-full border px-3 py-1 text-xs"
                        style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
                      >
                        {selectedProject.category}
                      </span>
                      <span
                        className="inline-flex rounded-full border px-3 py-1 text-xs"
                        style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
                      >
                        <Globe className="mr-1 h-3 w-3" /> Public project
                      </span>
                    </div>

                    <h1 className="text-4xl font-semibold">{selectedProject.title}</h1>

                    <div className={`mt-4 flex items-center gap-2 text-sm ${mutedTextClass}`}>
                      <MapPin className="h-4 w-4" />
                      <span>{selectedProject.location}</span>
                    </div>

                    <p className={`mt-6 text-base leading-8 ${mutedTextClass}`}>{selectedProject.description}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
                          style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.text }}
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InfoCard themeStyles={themeStyles} className="p-5">
                      <h2 className="text-lg font-semibold">Project summary</h2>
                      <div className={`mt-4 space-y-3 text-sm ${mutedTextClass}`}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" /> Created by {selectedProject.creator}
                        </div>
                        <div className="flex items-center gap-2">
                          <Compass className="h-4 w-4" /> Category: {selectedProject.category}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Location: {selectedProject.location}
                        </div>
                      </div>
                    </InfoCard>

                    <div className="flex flex-wrap gap-3">
                      <ThemeButton
                        themeStyles={themeStyles}
                        active={favoriteProjectIds.includes(selectedProject.id)}
                        onClick={() => toggleFavorite(selectedProject.id, selectedProject.title)}
                      >
                        <Heart className={`mr-2 inline h-4 w-4 ${favoriteProjectIds.includes(selectedProject.id) ? "fill-current" : ""}`} />
                        {favoriteProjectIds.includes(selectedProject.id) ? "Saved" : "Save to favorites"}
                      </ThemeButton>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          )}

          {page === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold">My Projects</h1>
                  <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>Projects must include a title, location, and description.</p>
                </div>

                <ThemeButton themeStyles={themeStyles} active onClick={() => setShowCreateForm((prev) => !prev)}>
                  <Plus className="mr-2 inline h-4 w-4" /> {showCreateForm ? "Close form" : "Create project"}
                </ThemeButton>
              </div>

              {showCreateForm && (
                <InfoCard themeStyles={themeStyles} className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Title</label>
                      <ThemeInput value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Enter project title" themeStyles={themeStyles} />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Location</label>
                      <ThemeInput value={projectLocation} onChange={(e) => setProjectLocation(e.target.value)} placeholder="Enter project location" themeStyles={themeStyles} />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Category</label>
                      <select
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value as (typeof myProjectCategories)[number])}
                        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                        style={{ backgroundColor: themeStyles.panel, color: themeStyles.text, borderColor: themeStyles.border }}
                      >
                        {myProjectCategories.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Visibility</label>
                      <select
                        value={projectVisibility}
                        onChange={(e) => setProjectVisibility(e.target.value as "private" | "public")}
                        className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                        style={{ backgroundColor: themeStyles.panel, color: themeStyles.text, borderColor: themeStyles.border }}
                      >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium">Description</label>
                      <ThemeInput
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Describe the project"
                        themeStyles={themeStyles}
                        multiline
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium">Tags</label>
                      <ThemeInput value={projectTags} onChange={(e) => setProjectTags(e.target.value)} placeholder="Comma-separated tags" themeStyles={themeStyles} />
                    </div>
                  </div>

                  <div className="mt-5">
                    <ThemeButton themeStyles={themeStyles} active onClick={createProject}>
                      Create project
                    </ThemeButton>
                  </div>
                </InfoCard>
              )}

              {userProjects.length === 0 ? (
                <InfoCard themeStyles={themeStyles} className="p-10 text-center">
                  <FolderKanban className="mx-auto h-10 w-10" style={{ color: themeStyles.muted }} />
                  <h3 className="mt-4 text-xl font-semibold">No projects yet</h3>
                  <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>Create your first project to start building your workspace.</p>
                </InfoCard>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {userProjects.map((project) => (
                    <InfoCard key={project.id} themeStyles={themeStyles} className="p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span
                          className="inline-flex rounded-full border px-3 py-1 text-xs"
                          style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.muted }}
                        >
                          {project.category}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
                          style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.text }}
                        >
                          {project.visibility === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          {project.visibility}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold">{project.title}</h3>

                      <div className={`mt-2 flex items-center gap-2 text-sm ${mutedTextClass}`}>
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>

                      <p className={`mt-4 text-sm leading-6 ${mutedTextClass}`}>{project.description}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.length > 0 ? (
                          project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                              style={{ backgroundColor: themeStyles.pill, borderColor: themeStyles.border, color: themeStyles.text }}
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className={`text-xs ${mutedTextClass}`}>No tags yet</span>
                        )}
                      </div>
                    </InfoCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {page === "settings" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <InfoCard themeStyles={themeStyles} className="p-6">
                <h1 className="text-2xl font-semibold">Appearance</h1>
                <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>Dark mode now updates the full interface consistently.</p>

                <div className="mt-6 flex items-center justify-between rounded-3xl border p-5" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}>
                  <div>
                    <p className="font-semibold">Dark / Light mode</p>
                    <p className={`mt-1 text-sm ${mutedTextClass}`}>Choose the theme for the whole app.</p>
                  </div>

                  <ThemeButton themeStyles={themeStyles} active onClick={() => setTheme(isDark ? "light" : "dark")}>
                    {isDark ? <Sun className="mr-2 inline h-4 w-4" /> : <Moon className="mr-2 inline h-4 w-4" />}
                    {isDark ? "Switch to light" : "Switch to dark"}
                  </ThemeButton>
                </div>
              </InfoCard>

              <InfoCard themeStyles={themeStyles} className="p-6">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>Decide whether the app should surface alerts and activity updates.</p>

                <div className="mt-6 flex items-center justify-between rounded-3xl border p-5" style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}>
                  <div>
                    <p className="font-semibold">Enable notifications</p>
                    <p className={`mt-1 text-sm ${mutedTextClass}`}>Project updates, saved items, and activity reminders.</p>
                  </div>

                  <button
                    onClick={() => setNotificationsEnabled((prev) => !prev)}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{
                      backgroundColor: notificationsEnabled ? themeStyles.primary : themeStyles.card,
                      color: notificationsEnabled ? themeStyles.primaryText : themeStyles.text,
                      border: `1px solid ${themeStyles.border}`,
                    }}
                  >
                    {notificationsEnabled ? "On" : "Off"}
                  </button>
                </div>
              </InfoCard>
            </div>
          )}

          {page === "account_info" && (
            <div className="space-y-6">
              <InfoCard themeStyles={themeStyles} className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold"
                      style={{ backgroundColor: themeStyles.primary, color: themeStyles.primaryText }}
                    >
                      {initials}
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold">Account Info</h1>
                      <p className={`mt-1 text-sm ${mutedTextClass}`}>Basic account details, plan, billing, and questionnaire progress.</p>
                    </div>
                  </div>

                  <ThemeButton themeStyles={themeStyles} active onClick={() => setPage("questionnaire")}>
                    {questionnaireComplete ? "Edit questionnaire" : "Continue questionnaire"}
                  </ThemeButton>
                </div>
              </InfoCard>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <InfoCard themeStyles={themeStyles} className="p-6">
                  <h2 className="text-xl font-semibold">Basic account details</h2>
                  <div className="mt-5 space-y-4 text-sm">
                    {[
                      { label: "Email", value: email || "Not provided" },
                      { label: "Phone", value: phone || "Not provided" },
                      { label: "Current location", value: currentLocation || "Not provided" },
                      { label: "Selected plan", value: planLabel },
                      {
                        label: "Billing status",
                        value:
                          selectedPlan === "skip"
                            ? "Skipped for now"
                            : billingAddress || cardNumber
                            ? "Card details entered"
                            : "Plan selected without payment details",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border p-4"
                        style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}
                      >
                        <p className="font-medium">{item.label}</p>
                        <p className={`mt-2 leading-6 ${mutedTextClass}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </InfoCard>

                <InfoCard themeStyles={themeStyles} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Questionnaire progress</h2>
                      <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                        20 adaptive questions covering status, preferences, abilities, skills, and readiness.
                      </p>
                    </div>

                    <div
                      className="rounded-full px-4 py-2 text-sm font-semibold"
                      style={{ backgroundColor: themeStyles.primary, color: themeStyles.primaryText }}
                    >
                      {questionnaireProgressPercent}%
                    </div>
                  </div>

                  <div className="mt-5 h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: themeStyles.pill }}>
                    <div className="h-full rounded-full" style={{ width: `${questionnaireProgressPercent}%`, backgroundColor: themeStyles.primary }} />
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {categoryOrder.map((category) => {
                      const total = adaptiveQuestions.filter((item) => item.category === category).length;
                      const done = adaptiveQuestions.filter(
                        (item) => item.category === category && String(questionnaireAnswers[item.id] || "").trim()
                      ).length;

                      return (
                        <div
                          key={category}
                          className="rounded-2xl border p-4"
                          style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}
                        >
                          <p className="font-medium">{category}</p>
                          <p className={`mt-2 text-sm ${mutedTextClass}`}>
                            {done} of {total} answered
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <ThemeButton themeStyles={themeStyles} active onClick={() => setPage("questionnaire")}>
                      {questionnaireComplete ? "Edit questionnaire" : "Start questionnaire"}
                    </ThemeButton>
                    <ThemeButton themeStyles={themeStyles} onClick={() => setPage("answers_summary")}>
                      View answers summary
                    </ThemeButton>
                  </div>
                </InfoCard>
              </div>
            </div>
          )}

          {page === "answers_summary" && (
            <div className="space-y-6">
              <InfoCard themeStyles={themeStyles} className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-semibold">Answers Summary</h1>
                    <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                      Review the adaptive questionnaire responses and reopen the wizard to edit anything.
                    </p>
                  </div>

                  <ThemeButton themeStyles={themeStyles} active onClick={() => setPage("questionnaire")}>
                    <PenSquare className="mr-2 inline h-4 w-4" /> Edit questionnaire
                  </ThemeButton>
                </div>
              </InfoCard>

              {categoryOrder.map((category) => (
                <InfoCard key={category} themeStyles={themeStyles} className="p-6">
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {(groupedSummary[category] || []).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border p-4"
                        style={{ borderColor: themeStyles.border, backgroundColor: themeStyles.pill }}
                      >
                        <p className="font-medium">{item.label}</p>
                        <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import type {
  CurriculumDay,
  FaqItem,
  MasterclassConfig,
  OfferDetail,
  ProfileLink,
  ProofAsset,
  TrustMetric,
  WorkflowStep,
} from "@/types/masterclass";

/*
 * Phase 1 (this file) is UI-only. `checkoutEnabled: false` is what disables the
 * registration form's submit button — flip it only once SSLCommerz session
 * initiation and order validation actually exist server-side.
 */
export const masterclassConfig: MasterclassConfig = {
  masterclassId: "lead-generation-cold-email",
  batchId: "2026-10-02",
  priceBDT: 2000,
  currency: "BDT",
  checkoutEnabled: false,
};

export const masterclassMeta = {
  seoTitle: "Lead Generation ও Cold Email Outreach মাস্টারক্লাস | MasumDev",
  metaDescription:
    "২ দিনের LIVE মাস্টারক্লাসে শিখুন বাস্তব B2B Lead Generation, prospect list building ও Cold Email Outreach workflow — ১১ বছরের অভিজ্ঞতা থেকে।",
} as const;

export const header = {
  wordmark: "MasumDev",
  ctaLabel: "রেজিস্ট্রেশন করুন",
} as const;

export const hero = {
  eyebrow: "প্রথমবারের মতো ২ দিনের LIVE মাস্টারক্লাস",
  headline:
    "রাতারাতি লাখ টাকার গল্প নয়—শিখুন বাস্তব Lead Generation ও Cold Email Outreach",
  description:
    "১১ বছরের বাস্তব অভিজ্ঞতা এবং আন্তর্জাতিক ক্লায়েন্টদের সঙ্গে কাজের বাস্তব workflow থেকে শিখুন B2B Lead Generation, prospect list building, cold email infrastructure ও campaign setup।",
  credibilityLine:
    "Top Rated Upwork Freelancer • $100K+ Earnings • ২৪৪টি কাজ • ২২,৩০২+ ঘণ্টা",
  primaryCta: "এখনই ভর্তি হোন — ৳২,০০০",
  secondaryCta: "কী কী শিখবেন দেখুন",
  instructorImageAlt:
    "আব্দুল্লাহ আল মাসুম, Cold Email Outreach ও Lead Generation বিশেষজ্ঞ",
} as const;

export const offerDetails: readonly OfferDetail[] = [
  { label: "২ ও ৩ অক্টোবর ২০২৬" },
  { label: "প্রতিদিন রাত ৯টা" },
  { label: "লাইভ অনলাইন ক্লাস" },
  { label: "লাইভ প্রশ্নোত্তর পর্ব" },
];

/* Same figures as the hero credibility line, restated as a scannable strip. */
export const trustMetrics: readonly TrustMetric[] = [
  { value: "Top Rated", label: "Upwork স্ট্যাটাস" },
  { value: "$100K+", label: "Upwork lifetime earnings" },
  { value: "২৪৪+", label: "সম্পন্ন প্রজেক্ট" },
  { value: "২২,৩০২+", label: "কাজের ঘণ্টা" },
  { value: "৯১%", label: "Job Success Score" },
];

export const expectationStory = {
  label: "শুরুতেই স্পষ্ট কথা",
  heading: "এটা কোনো “রাতারাতি ধনী হওয়ার” কোর্স নয়",
  paragraphs: [
    "অনলাইনে অনেক বিজ্ঞাপনে বলা হয় দুই দিনেই লাখ টাকা আয় শুরু হয়ে যাবে। বাস্তবতা এমন নয়। Cold Email Outreach ও Lead Generation একটি বাস্তব দক্ষতা—এবং যেকোনো বাস্তব দক্ষতার মতোই এখানে সময়, চর্চা এবং ধৈর্য লাগে।",
    "এই মাস্টারক্লাসে কোনো income বা client পাওয়ার guarantee দেওয়া হয় না। যা দেওয়া হয় তা হলো একটি সঠিক foundation, একটি সম্পূর্ণ workflow এবং একটি বাস্তব roadmap—যা দিয়ে আপনি নিজে চর্চা করে এগিয়ে যেতে পারবেন।",
    "Deliverability ঠিক রাখা, সঠিক prospect খুঁজে বের করা এবং campaign optimize করা—এই তিনটি বিষয়ে দক্ষ হতে বাস্তব কাজের অভিজ্ঞতা প্রয়োজন। দুই দিনের ক্লাস আপনাকে সেই পথে সঠিকভাবে শুরু করিয়ে দেবে।",
  ],
} as const;

export const outcomes = {
  label: "মাস্টারক্লাস শেষে যা বুঝতে পারবেন",
  heading: "দুই দিন শেষে আপনি যা নিয়ে বাড়ি ফিরবেন",
  items: [
    "B2B Lead Generation আসলে কী এবং ক্লায়েন্টরা কেন এই service-এর জন্য টাকা দেয়",
    "একটি সঠিক Ideal Customer Profile বা ICP কীভাবে নির্ধারণ করতে হয়",
    "সঠিক decision-maker খুঁজে বের করে একটি client-ready prospect list তৈরির সম্পূর্ণ প্রক্রিয়া",
    "একটি cold email sending infrastructure—domain, inbox, SPF, DKIM, DMARC—কীভাবে সঠিকভাবে সেট আপ করতে হয়",
    "Deliverability বজায় রেখে কীভাবে একটি cold email campaign লঞ্চ ও পরিচালনা করতে হয়",
    "এই পুরো skill set-কে freelance service হিসেবে উপস্থাপন করার একটি বাস্তব roadmap",
  ],
} as const;

export const curriculumNote =
  "দুই দিনের এই ক্লাস আপনাকে সঠিক foundation ও একটি সম্পূর্ণ roadmap দেবে। কিন্তু deliverability, prospect research এবং campaign optimization-এ দক্ষ হতে চাই ধারাবাহিক চর্চা।";

export const curriculumDays: readonly CurriculumDay[] = [
  {
    id: "day-1",
    dayLabel: "প্রথম দিন",
    heading: "প্রথম দিন—Lead Generation ও Prospect List Building",
    items: [
      "Lead Generation কী এবং ক্লায়েন্ট কেন এই service-এর জন্য টাকা দেয়",
      "Niche এবং Ideal Customer Profile বা ICP নির্ধারণ",
      "Target company এবং সঠিক decision-maker খুঁজে বের করা",
      "Prospect-এর নাম, পদবি, email ও প্রয়োজনীয় তথ্য সংগ্রহ",
      "Email verification এবং bounce risk কমানো",
      "একটি পরিচ্ছন্ন client-ready prospect list তৈরি",
      "হাতে-কলমে একটি বাস্তব lead list তৈরি",
      "এই দক্ষতাকে freelance service হিসেবে উপস্থাপনের roadmap",
    ],
  },
  {
    id: "day-2",
    dayLabel: "দ্বিতীয় দিন",
    heading: "দ্বিতীয় দিন—সম্পূর্ণ Cold Email Outreach System",
    items: [
      "Outreach domain ও inbox-এর ভূমিকা",
      "Google Workspace এবং Microsoft 365 inbox setup process",
      "SPF, DKIM ও DMARC-এর মৌলিক বিষয়",
      "Email deliverability এবং spam placement",
      "Inbox warm-up",
      "Instantly-তে inbox connection",
      "Lead upload এবং campaign setup",
      "Sending schedule, daily limit এবং inbox rotation",
      "Cold email ও follow-up লেখা",
      "Campaign launch, monitoring এবং reply management",
    ],
  },
];

export const workflow = {
  label: "সম্পূর্ণ Workflow",
  heading: "একটি Offer থেকে একটি বাস্তব Opportunity পর্যন্ত",
  steps: [
    { label: "Offer" },
    { label: "ICP" },
    { label: "Lead List" },
    { label: "Verification" },
    { label: "Infrastructure" },
    { label: "Email Copy" },
    { label: "Campaign" },
    { label: "Replies" },
    { label: "Opportunity" },
  ] satisfies readonly WorkflowStep[],
} as const;

/*
 * Sanitized derivatives only — never the raw files in resources/master_class_assets/.
 * See CLAUDE.md for which source screenshots were excluded and why.
 */
export const resultsProof = {
  label: "বাস্তব কাজের প্রমাণ",
  heading: "দাবি নয়—বাস্তব কাজের ফলাফল",
  /* Links to the original file in public/masterclass/ — same label on every card. */
  viewFullSizeLabel: "ছবিটি বড় করে দেখুন ↗",
  assets: [
    {
      id: "campaign-volume",
      src: "/masterclass/campaign-total-sent.png",
      width: 610,
      height: 150,
      alt: "একটি পূর্ববর্তী cold email campaign-এ মোট 455.4K email পাঠানোর পরিসংখ্যান",
      caption:
        "একটি পূর্ববর্তী campaign-এর পাঠানো email-এর সংখ্যা। এটি অতীতের কাজের অভিজ্ঞতা দেখাচ্ছে—কোনো guaranteed ফলাফল নয়।",
    },
    {
      id: "campaign-chart",
      src: "/masterclass/campaign-chart.png",
      width: 1805,
      height: 370,
      alt: "কয়েক মাসের একটি cold email campaign-এর sent, open ও reply ট্র্যাক করা chart",
      caption: "একই campaign-এর কয়েক মাসের sending ও engagement ট্রেন্ড।",
    },
    {
      id: "inbox-placement",
      src: "/masterclass/inbox-placement-result.png",
      width: 920,
      height: 170,
      alt: "একটি inbox placement test-এ 3,875টি email-এর মধ্যে 100% inbox-এ পৌঁছানোর ফলাফল",
      caption:
        "একটি নির্দিষ্ট inbox placement test-এর ফলাফল। এটি কোনো guaranteed বা typical result নয়।",
    },
    {
      id: "client-feedback",
      src: "/masterclass/feedback-five-star.png",
      width: 814,
      height: 635,
      alt: "Upwork-এ cold email ও lead generation কাজের উপর তিনটি 5-star client feedback",
      caption: "Upwork-এ verified client-দের থেকে পাওয়া real feedback, হুবহু।",
    },
  ] satisfies readonly ProofAsset[],
} as const;

export const instructor = {
  label: "আপনার ইনস্ট্রাক্টর",
  heading: "আব্দুল্লাহ আল মাসুম",
  role: "Cold Email Outreach ও B2B Lead Generation বিশেষজ্ঞ",
  portraitAlt: "আব্দুল্লাহ আল মাসুম-এর ছবি",
  paragraphs: [
    "আমার যাত্রা শুরু হয়েছিল সাধারণ data-entry কাজ দিয়ে। ধীরে ধীরে আমি B2B Lead Generation এবং Cold Email Outreach-এ specialize করি—এবং গত প্রায় ১১ বছর ধরে এটাই আমার মূল কাজ।",
    "এই সময়ে আমি Upwork, Fiverr এবং direct client engagement-এর মাধ্যমে বিভিন্ন দেশের international client-দের সঙ্গে কাজ করেছি—email infrastructure সেট আপ, deliverability ঠিক রাখা, prospect research এবং campaign management নিয়ে।",
    "এটি আমার প্রথম public live মাস্টারক্লাস। আমি যা কাজে ব্যবহার করি, ঠিক সেই workflow-টাই এখানে শেখাচ্ছি—কোনো তত্ত্বনির্ভর কোর্স নয়।",
  ],
  proof: {
    src: "/masterclass/upwork-profile-proof.png",
    width: 1322,
    height: 898,
    alt: "আব্দুল্লাহ আল মাসুমের Upwork প্রোফাইল—Top Rated, $100K+ lifetime earnings, ২৪৪টি কাজ, ২২,৩০২ ঘণ্টা",
    caption:
      "Upwork প্রোফাইলের public পরিসংখ্যান। $100K+ figure-টি Upwork platform-এর lifetime earnings, ব্যক্তিগত income বা profit নয়।",
  },
  /* Verifiable public profiles — kept as data so the component never hardcodes a URL. */
  profileLinks: [
    {
      label: "Upwork প্রোফাইল যাচাই করুন ↗",
      href: "https://www.upwork.com/freelancers/~01a5eccfaf40a8a065",
    },
    {
      label: "Fiverr প্রোফাইল দেখুন ↗",
      href: "https://www.fiverr.com/expertlead?public_mode=true",
    },
  ] satisfies readonly ProfileLink[],
} as const;

export const audienceFit = {
  join: {
    label: "যাদের জন্য এই মাস্টারক্লাস",
    heading: "যারা যোগ দেবেন",
    items: [
      "যারা একদম শুরু থেকে B2B Lead Generation ও Cold Email Outreach শিখতে চান",
      "বিদ্যমান freelancer যারা একটি নতুন, চাহিদাসম্পন্ন service যোগ করতে চান",
      "যারা সরাসরি client outreach-এর প্রক্রিয়া বুঝতে চান—শুধু marketplace-নির্ভর না থেকে",
      "যারা চর্চা করার জন্য সময় ও ধৈর্য রাখতে প্রস্তুত",
    ],
  },
  skip: {
    label: "যাদের জন্য এটি নয়",
    heading: "যারা যোগ না দিলেই ভালো",
    items: [
      "যারা guaranteed income বা guaranteed client খুঁজছেন",
      "যারা মনে করেন দুই দিনেই সব শেখা শেষ হয়ে যাবে, চর্চা লাগবে না",
      "যারা “রাতারাতি ধনী হওয়ার” কোনো shortcut খুঁজছেন",
      "যারা এখনই বেসিক কম্পিউটার ও internet ব্যবহারে স্বচ্ছন্দ নন",
    ],
  },
} as const;

export const registration = {
  label: "রেজিস্ট্রেশন",
  heading: "আপনার সিট নিশ্চিত করুন",
  description:
    "নিচের ফর্মটি পূরণ করে রেজিস্ট্রেশন প্রক্রিয়া সম্পর্কে ধারণা নিন। Secure payment integration সম্পন্ন হওয়ার পর রেজিস্ট্রেশন উন্মুক্ত করা হবে।",
  priceLabel: "কোর্স ফি",
  priceValue: "৳২,০০০",
  dateLabel: "ক্লাসের তারিখ",
  dateValue: "২ ও ৩ অক্টোবর ২০২৬, প্রতিদিন রাত ৯টা",
  paymentNote:
    "SSLCommerz-এর নিরাপদ payment page-এর মাধ্যমে উপলভ্য mobile banking ও card ব্যবহার করে payment করা যাবে।",
  fields: {
    name: "পুরো নাম",
    namePlaceholder: "আপনার নাম লিখুন",
    email: "ইমেইল",
    emailPlaceholder: "you@example.com",
    phone: "মোবাইল নম্বর",
    phonePlaceholder: "01XXXXXXXXX",
  },
  submitEnabledLabel: "এখনই ভর্তি হোন — ৳২,০০০",
  submitDisabledLabel: "পেমেন্ট সেটআপ চলছে",
  /* Shown only while checkoutEnabled is false — never in production once it flips true. */
  devNotice:
    "Development note: Secure payment integration (SSLCommerz) এখনও সংযুক্ত করা হয়নি। এই ফর্মটি বর্তমানে শুধু preview হিসেবে দেখানো হচ্ছে; জমা দেওয়া সম্ভব নয়।",
} as const;

export const faqItems: readonly FaqItem[] = [
  {
    id: "beginners",
    question: "এই মাস্টারক্লাস কি একদম নতুনদের জন্য?",
    answer:
      "হ্যাঁ। কোনো আগের অভিজ্ঞতা ছাড়াই শুরু করা যায়—তবে বেসিক কম্পিউটার ও internet ব্যবহারে স্বচ্ছন্দ থাকা দরকার।",
  },
  {
    id: "two-days-enough",
    question: "দুই দিনে কি পুরো বিষয় শেখা সম্ভব?",
    answer:
      "দুই দিনে আপনি একটি সঠিক foundation, সম্পূর্ণ workflow এবং একটি বাস্তব roadmap পাবেন। কিন্তু deliverability, prospect research ও campaign optimization-এ দক্ষ হতে চর্চা প্রয়োজন—এটি কোনো এক-লাফে শেষ হওয়ার বিষয় নয়।",
  },
  {
    id: "live",
    question: "ক্লাস কি লাইভ হবে?",
    answer: "হ্যাঁ, দুই দিনই সম্পূর্ণ লাইভ অনলাইন ক্লাস, সঙ্গে লাইভ প্রশ্নোত্তর পর্ব।",
  },
  {
    id: "recording",
    question: "ক্লাসের recording দেওয়া হবে কি?",
    answer:
      "হ্যাঁ। লাইভ ক্লাস শেষ হওয়ার পর নিবন্ধিত শিক্ষার্থীরা ৭ দিন রেকর্ডিং দেখতে পারবেন। রেকর্ডিং দেখার নির্দেশনা নিবন্ধনের সময় দেওয়া ইমেইলে পাঠানো হবে।",
  },
  {
    id: "paid-tools",
    question: "অংশ নিতে কি paid tools প্রয়োজন?",
    answer:
      "ক্লাসে অংশ নিতে কোনো paid tool বাধ্যতামূলক নয়। ক্লাসে ব্যবহৃত কিছু tool-এর (যেমন Instantly) নিজস্ব pricing আছে, যা পরবর্তীতে বাস্তব কাজে ব্যবহার করতে চাইলে প্রয়োজন হতে পারে।",
  },
  {
    id: "income-guarantee",
    question: "এই মাস্টারক্লাস করলে কি income নিশ্চিত?",
    answer:
      "না। এখানে কোনো income বা client পাওয়ার guarantee দেওয়া হয় না। আপনি একটি সঠিক foundation ও সম্পূর্ণ workflow শিখবেন—ফলাফল নির্ভর করবে আপনার চর্চা ও প্রয়োগের উপর।",
  },
  {
    id: "confirmation",
    question: "Payment করার পর confirmation কীভাবে পাব?",
    answer:
      "পেমেন্ট সফলভাবে যাচাই হওয়ার পর আপনার দেওয়া ইমেইলে রেজিস্ট্রেশন কনফার্মেশন পাঠানো হবে। ক্লাসে যোগ দেওয়ার লিংক ও প্রয়োজনীয় নির্দেশনা ক্লাস শুরুর আগে আলাদা ইমেইলে পাঠানো হবে।",
  },
  {
    id: "questions",
    question: "ক্লাসে প্রশ্ন করার সুযোগ থাকবে কি?",
    answer: "হ্যাঁ, প্রতিদিনের ক্লাসের শেষে একটি লাইভ প্রশ্নোত্তর পর্ব থাকবে।",
  },
];

export const finalCta = {
  heading: "সঠিক foundation দিয়ে শুরু করুন",
  description:
    "কোনো shortcut নয়—একটি বাস্তব workflow শিখুন, যা দিয়ে আপনি নিজে চর্চা করে এগিয়ে যেতে পারবেন।",
  cta: "এখনই ভর্তি হোন — ৳২,০০০",
} as const;

export const footer = {
  positioning: "Abdullah Al Masum — Cold Email Outreach ও B2B Lead Generation বিশেষজ্ঞ।",
  copyright: "© ২০২৬ MasumDev। সর্বস্বত্ব সংরক্ষিত।",
  backToPortfolio: "মূল পোর্টফোলিওতে ফিরে যান",
} as const;

export const stickyCta = {
  price: "৳২,০০০",
  label: "ভর্তি হোন",
} as const;

export const profile = {
  name: "Shan Christian M. Platon",
  role: "Software & Web Developer",
  tagline:
    "Frontend-focused developer building web and mobile systems with React, React Native, and Supabase.",
  location: "Tanauan City, Batangas, PH",
  email: "platonshan0@gmail.com",
  phone: "0956 893 2434",
  // The same number in international form, so phones can call it.
  phoneHref: "tel:+639568932434",
  github: "https://github.com/ShanPla",

  // Add resume to /public and update this path when ready.
  // Example: "/Shan-Platon-Resume.pdf"
  resume: null,

  // Set to a path in public/ once a photo is available.
  // Example: "/profile.jpg"
  image: null,
};

// The hero's tiles. available: shows a green dot before the value.
// \u00a0 is a non-breaking space and \u2060 (after a hyphen) a word joiner;
// both stop a line break there, so a long value breaks only after a "·".
export const stats = [
  { label: "STATUS", value: "Final-\u2060year CS student" },
  { label: "OPEN TO", value: "OJT internship", available: true },
  { label: "STACK", value: "React\u00a0· React\u00a0Native\u00a0· Supabase" },
  { label: "BASED IN", value: "Tanauan City, Batangas" },
];

export const skills = [
  {
    number: "01",
    group: "Frontend",
    description:
      "Building responsive interfaces and reusable web experiences.",

    items: [
      {
        name: "React",
        detail: "Component architecture · state · routing",
      },
      {
        name: "Next.js",
        detail: "App Router · server and client components",
      },
      {
        name: "TypeScript",
        detail: "Typed components · interfaces · safer refactors",
      },
      {
        name: "JavaScript",
        detail: "ES6+ · async logic · browser APIs",
      },
      {
        name: "Tailwind CSS",
        detail: "Responsive UI · design systems · utility styling",
      },
      {
        name: "Vite",
        detail: "Fast development · builds · project tooling",
      },
    ],
  },

  {
    number: "02",
    group: "Mobile",
    description:
      "Creating cross-platform mobile interfaces with a focus on usability.",

    items: [
      {
        name: "React Native",
        detail: "Cross-platform UI · navigation · native components",
      },
      {
        name: "Expo",
        detail: "Development workflow · EAS · device testing",
      },
    ],
  },

  {
    number: "03",
    group: "Backend",
    description:
      "Connecting interfaces to data, authentication, APIs, and backend logic.",

    items: [
      {
        name: "Supabase",
        detail: "Auth · database · realtime",
      },
      {
        name: "PostgreSQL",
        detail: "SQL schemas · row-level security · triggers · functions",
      },
      {
        name: "Python",
        detail: "Backend logic · scripting · data processing",
      },
    ],
  },

  {
    number: "04",
    group: "Tooling",
    description:
      "The tools I use to build, ship, test, and manage projects.",

    items: [
      {
        name: "Git / GitHub",
        detail: "Version control · collaboration · repositories",
      },
      {
        name: "GitHub Actions",
        detail: "CI · lint, test, and build on every push",
      },
      {
        name: "Vitest",
        detail: "Unit tests · run in CI",
      },
      {
        name: "Vercel",
        detail: "Deployment · previews · production hosting",
      },
      {
        name: "EAS",
        detail: "Mobile builds · submissions · releases",
      },
      {
        name: "Node-RED",
        detail: "Visual workflows · integrations · automation",
      },
    ],
  },
];

// In the text below, \u00a0 is a non-breaking space and \u2060 (after a hyphen)
// a word joiner. Both stop a line break there, e.g. to keep "WCAG 2.2 AA" or
// "real-time" on one line.
export const projects = [
  {
    id: "lipaaction",
    name: "LipaAction",
    tag: "Thesis · Web Console",
    description:
      "A web console where barangay officials in Lipa\u00a0City review and route residents' incident reports, ranked by a machine-learning priority score.",
    overview:
      "LipaAction is a community incident-reporting system for Lipa City, Batangas, built as a three-person undergraduate thesis at De La Salle Lipa. Residents file emergency and minor reports from a mobile app, and a machine-learning classifier scores each report's priority. Barangay officials review and validate the reports, then route them to the responding agencies. The city government oversees the whole flow.",
    role: "Web Console Development",
    // team (optional): team size and adviser, shown under Role.
    team: "Team of 3\u00a0· Adviser:\u00a0Franze\u00a0V.\u00a0Garcia",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"],
    status: "SHIPPED",
    accent: "signal",
    github: "https://github.com/ShanPla/LipaAction-WebConsole",
    // live (optional): the running app's address, shown as a Live site link.
    // access (optional): shown under the links, e.g. to say why there is none.
    access:
      "No public demo: the live console is only for barangay officials, and the team issues their accounts.",

    contribution: [
      {
        title: "Barangay console",
        description:
          "Built the live triage queue where officials validate, reject, and route residents' reports to the responding agencies, plus duplicate detection, validation history, and reports.",
      },
      {
        title: "City dashboard",
        description:
          "Built the read-only city view: activity per barangay, a map of open reports, agency response times, and an access log.",
      },
      {
        title: "Backend integration",
        description:
          "Connected the console to the team's shared Supabase backend: two-step sign-in, row-\u2060level security, and real-time updates via Supabase Realtime.",
      },
    ],

    features: [
      "Live queue with an audible alert for emergencies",
      "Duplicate reports grouped into clusters on a map",
      "Reporter names never shown on any screen",
      "Access log of every report an official opens",
      "Full English / Tagalog interface switch",
      "WCAG\u00a02.2\u00a0AA contrast and 44\u00a0px touch targets",
    ],

    // Screenshots live in public/projects/<id>/.
    // image: card thumbnail and the large shot in the project page's Overview.
    // imageAlt: describes that shot for screen readers.
    // imageCaption: shown under that shot in the screenshot viewer.
    // screenshots: the captioned carousel under Selected Screens.
    // phoneScreenshots (optional): a row of phone-sized shots under the carousel.
    // shotSize / phoneShotSize: pixel size of those files, so the page keeps
    // their space before they load. image shares shotSize.
    shotSize: { width: 1900, height: 790 },
    image: "/projects/lipaaction/barangay-queue.webp",
    imageAlt:
      "Web console queue listing Critical Fire reports with priority scores and action buttons.",
    imageCaption:
      "Barangay queue: reports ranked by priority score, with Validate, Chat, and Reject on every card.",

    screenshots: [
      {
        src: "/projects/lipaaction/report-dialog.webp",
        caption:
          "Report details beside the chat with the resident; the reporter's identity stays withheld.",
        alt: "Report dialog with the reporter's answers on the left and an empty chat thread on the right.",
      },
      {
        src: "/projects/lipaaction/cluster-explorer.webp",
        caption:
          "Duplicate detection: reports of the same incident grouped together, with their locations on a map.",
        alt: "Cluster list, the members of one cluster, and a map with the selected report highlighted.",
      },
      {
        src: "/projects/lipaaction/queue-tagalog.webp",
        caption:
          "The same queue in Tagalog; the whole interface switches language.",
        alt: "Queue screen with Tagalog labels such as I-validate and Tanggihan.",
      },
      {
        src: "/projects/lipaaction/validation-history.webp",
        caption: "Validation history with totals, filters, and CSV export.",
        alt: "Summary tiles, filter controls, and a list of confirmed reports.",
      },
      {
        src: "/projects/lipaaction/city-map.webp",
        caption:
          "City map of open reports, colored by priority, with counts per barangay.",
        alt: "Map of Lipa and nearby towns with colored report dots and a legend.",
      },
      {
        src: "/projects/lipaaction/city-reports-detail.webp",
        caption:
          "City report list with a report's details open; the city view is read-only.",
        alt: "City report list with a side panel showing a Critical Fire report's details.",
      },
    ],
  },

  {
    id: "fire-detection",
    name: "ESP32 Fire Detection",
    tag: "Coursework · IoT System",
    description:
      "An ESP32 fire and gas monitor that shows four hazard levels on LEDs and a buzzer and sends alerts to a Blynk dashboard.",
    overview:
      "ESP32 Fire Detection is the final project for an IoT course at De La Salle Lipa. An ESP32 reads gas, temperature, humidity, and sound sensors and sets one of four hazard stages, from Normal to Critical, shown on five LEDs and a buzzer and sent to a Blynk dashboard. It builds on the team's midterm prototype with the same hardware. The final version ignores brief sensor spikes but still sounds the alarm at once for a critical reading, and it detects failed sensors and dropped connections.",
    role: "Firmware, Hardware & Dashboard",
    team: "Team of 3",
    stack: ["ESP32", "Arduino", "C++", "Blynk"],
    status: "COMPLETED",
    accent: "ok",
    github: "https://github.com/ShanPla/esp32-fire-detection-system",

    contribution: [
      {
        title: "Hazard detection",
        description:
          "Wrote the stage logic: three readings in a row to raise a Warning or Alert, an instant alarm at Critical, and a hysteresis band with a 2-\u2060second clear delay, so the LEDs and buzzer stop flickering near a threshold.",
      },
      {
        title: "Fault monitoring",
        description:
          "Added checks for a dead temperature sensor or a stuck gas sensor; gas detection keeps running through a temperature fault. Wi-\u2060Fi and Blynk outages are timed, and faults from the offline period are reported once the device reconnects.",
      },
      {
        title: "Blynk dashboard",
        description:
          "Set up the gauges, status text, and phone notifications for alarms, sensor faults, and restored connections, plus a test slider that simulates gas readings without real gas or flame.",
      },
      {
        title: "Hardware & docs",
        description:
          "Wired the ESP32, sensors, LEDs, and buzzer on a breadboard, and wrote the setup and demonstration guide.",
      },
    ],

    features: [
      "Four hazard stages on five LEDs, with a pulsing buzzer at Critical",
      "Brief gas spikes ignored; a critical reading alarms at once",
      "Hysteresis keeps the stage steady near a threshold",
      "Gas detection keeps running if the temperature sensor fails",
      "Faults from an outage reported as soon as the device reconnects",
      "Test mode simulates gas readings and turns off after 5\u00a0minutes",
    ],

    image: null,
  },

  {
    id: "chronicle",
    name: "The Chronicle",
    tag: "Personal · Social App",
    description:
      "A full-stack social media app with posts, comments, follows, notifications, and real-\u2060time chat.",
    overview:
      "The Chronicle is a full-stack social network with an editorial, newspaper-inspired look. People post text and photo collages, follow each other, comment in threads, like posts and comments, chat in real time one-on-one or in groups, and get notified about all of it. It runs entirely on Supabase with no custom backend server: the database, row-level security policies, triggers, and functions are the backend.",
    role: "Full-Stack Development",
    team: "Solo project",
    stack: ["React", "TypeScript", "Vite", "Supabase"],
    status: "SHIPPED",
    accent: "amber",
    github: "https://github.com/ShanPla/mini-social-app",
    live: "https://mini-social-app-dusky.vercel.app",

    contribution: [
      {
        title: "Design & frontend",
        description:
          "Designed and built every screen in React and TypeScript, styled in plain CSS with design tokens.",
      },
      {
        title: "Database & security",
        description:
          "Wrote the Supabase schema, its security policies, notification triggers, and the feed's database functions.",
      },
      {
        title: "Tests & deployment",
        description:
          "Set up Vitest tests, GitHub Actions CI, and deployment on Vercel.",
      },
    ],

    features: [
      "Real-time direct and group chat with typing indicators and seen receipts",
      "Photo posts with collage layouts and a full-screen viewer",
      "Threaded comments, likes, follows, and notifications",
      "Row-level security on every table, enforced in the database",
      "Dark mode that follows the device, AA contrast in both themes",
      "Lazy-loaded pages: first download cut from 540\u00a0kB to 31\u00a0kB",
    ],

    shotSize: { width: 1920, height: 1200 },
    phoneShotSize: { width: 780, height: 1688 },
    image: "/projects/chronicle/feed-light.webp",
    imageAlt:
      "Three-column feed with a profile card, a post with a four-photo grid, and sidebar cards.",
    imageCaption:
      "The feed: composer, a photo collage post, and sidebar cards for who is online, who to follow, recent chats, and the week's most active posters.",

    screenshots: [
      {
        src: "/projects/chronicle/feed-dark.webp",
        caption: "The feed in dark mode.",
        alt: "Dark three-column feed with a photo collage post.",
      },
      {
        src: "/projects/chronicle/post-comments-light.webp",
        caption: "A single post with its comment thread open.",
        alt: "A post with a café photo and a comment section beneath it.",
      },
      {
        src: "/projects/chronicle/messages-light.webp",
        caption:
          "Messages: conversation list and an open chat with a shared image; names and messages are blurred for privacy.",
        alt: "Two-pane messaging screen with chat bubbles and a sticker image.",
      },
      {
        src: "/projects/chronicle/chat-popups-light.webp",
        caption:
          "Chats open as floating popups while you keep browsing the feed; names and messages are blurred for privacy.",
        alt: "Feed page with two chat windows docked at the bottom right.",
      },
      {
        src: "/projects/chronicle/profile-light.webp",
        caption: "Profile page with bio, post, follower, and following counts.",
        alt: "Profile header with avatar initial, bio, and counts above the user's posts.",
      },
      {
        src: "/projects/chronicle/login-light.webp",
        caption: "Sign in, with the editorial art panel.",
        alt: "Sign-in form beside a dark panel reading The Chronicle.",
      },
    ],

    phoneScreenshots: [
      {
        src: "/projects/chronicle/feed-phone-light.webp",
        caption: "The feed on a phone.",
        alt: "Post composer with a Publish button above a photo post by Shintakai, and the Feed, Messages and Profile tabs at the bottom.",
      },
      {
        src: "/projects/chronicle/chat-phone-light.webp",
        caption: "A conversation on a phone; names and messages are blurred for privacy.",
        alt: "Chat thread with blurred message bubbles, a sticker, and the message box at the bottom.",
      },
      {
        src: "/projects/chronicle/profile-phone-light.webp",
        caption: "Profile on a phone.",
        alt: "Profile of Shintakai: avatar, bio, 3 posts, 2 followers, 3 following, and Edit Profile and Settings buttons.",
      },
      {
        src: "/projects/chronicle/feed-phone-dark.webp",
        caption: "The feed on a phone, in dark mode.",
        alt: "Dark post composer with a Publish button above a photo post, and the bottom tab bar.",
      },
    ],
  },
];
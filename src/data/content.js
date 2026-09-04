export const profile = {
  name: "Shan Christian M. Platon",
  role: "Software & Web Developer",
  tagline:
    "Frontend-focused developer building web and mobile systems with React, React Native, and Supabase.",
  location: "Tanauan City, Batangas, PH",
  email: "platonshan0@gmail.com",
  phone: "0956 893 2434",
  github: "https://github.com/ShanPla",

  // Add resume to /public and update this path when ready.
  // Example: "/Shan-Platon-Resume.pdf"
  resume: null,

  // Set to a path in public/ once a photo is available.
  // Example: "/profile.jpg"
  image: null,
};

export const stats = [
  { label: "STACK", value: "React / RN / Supabase" },
  { label: "FOCUS", value: "Frontend → Backend" },
  { label: "BASED IN", value: "Tanauan City, PH" },
  { label: "BUILDING", value: "Web & Mobile Systems" },
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
        name: "Firebase",
        detail: "Authentication · data · app services",
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

export const projects = [
  {
    id: "lipaaction",
    name: "LipaAction",
    tag: "Thesis",
    description:
      "A machine-learning-assisted incident reporting platform built for Lipa City, Batangas.",
    role: "Frontend Development",
    stack: ["React Native", "Expo", "Supabase"],
    status: "IN PROGRESS",
    accent: "signal",

    // Set to a path in public/projects/ once a screenshot is available,
    // e.g. "/projects/lipaaction.png".
    image: null,
  },

  {
    id: "iris",
    name: "IRIS",
    tag: "Integrated Recognition for Intrusion System",
    description:
      "A full-stack home security system with an admin dashboard and homeowner mobile app.",
    role: "Frontend Development",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "React Native",
      "Expo",
    ],
    status: "SHIPPED",
    accent: "ok",
    image: null,
  },

  {
    id: "luxestay",
    name: "LuxeStay",
    tag: "Hotel Booking App",
    description:
      "A mobile hotel booking app focused on clean UX and cross-platform usability.",
    role: "Frontend Development",
    stack: ["React Native", "Expo", "Firebase"],
    status: "SHIPPED",
    accent: "amber",
    image: null,
  },
];
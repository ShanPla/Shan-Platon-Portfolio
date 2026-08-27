export const profile = {
  name: "Shan Christian M. Platon",
  role: "Software & Web Developer",
  tagline:
    "BS Computer Science student building frontend systems with React, React Native, and Supabase — currently expanding into backend development.",
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
      "A machine-learning-assisted mobile incident reporting platform built for Lipa City, Batangas. The system is designed to make incident reporting and response more efficient and accountable.",
    role: "Frontend Development",
    stack: ["React Native", "Expo", "Supabase"],
    status: "IN PROGRESS",
    accent: "signal",

    contribution: [
      {
        title: "UI & Screens",
        description:
          "Designed and built the application's user interfaces and individual screens.",
      },
      {
        title: "Navigation",
        description:
          "Implemented navigation between the application's main flows and screens.",
      },
      {
        title: "Authentication",
        description:
          "Built the authentication experience and connected protected application flows.",
      },
      {
        title: "Supabase Integration",
        description:
          "Connected the frontend to Supabase services for application data and authentication.",
      },
      {
        title: "API Integration",
        description:
          "Integrated frontend screens with the APIs required by the application.",
      },
      {
        title: "Incident Reporting",
        description:
          "Built the frontend flow for submitting and handling incident reports.",
      },
    ],

    features: [
      "Incident reporting",
      "User authentication",
      "Report submission flow",
      "API-connected screens",
      "Supabase integration",
      "Mobile navigation",
    ],

    overview:
      "LipaAction is a thesis project focused on improving how incidents can be reported and routed for response in Lipa City, Batangas. The project is currently in development, with my work focused on the frontend experience and its connection to backend services.",

    screenshots: [],

    github: "https://github.com/ShanPla/LipaAction-WebConsole",
    githubLabel: "View Web Console",
  },

  {
    id: "iris",
    name: "IRIS",
    tag: "Integrated Recognition for Intrusion System",
    description:
      "A home security system concept combining an admin web dashboard with a homeowner mobile application for monitoring, alerts, and security management.",
    role: "Frontend Development & UI",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "React Native",
      "Expo",
    ],
    status: "SHIPPED",
    accent: "ok",

    contribution: [
      {
        title: "Admin Dashboard",
        description:
          "Designed and developed the interface for managing the security system from the admin side.",
      },
      {
        title: "Mobile App",
        description:
          "Worked on the homeowner-facing mobile application interface and its main user flows.",
      },
      {
        title: "Authentication",
        description:
          "Built the authentication interfaces for the system's users.",
      },
      {
        title: "Security Interfaces",
        description:
          "Created UI and mock interfaces for facial recognition, live camera monitoring, and security alerts.",
      },
      {
        title: "Real-time Data",
        description:
          "Worked on the frontend interfaces used to present real-time security information.",
      },
      {
        title: "User Management",
        description:
          "Built interfaces for managing users within the admin experience.",
      },
    ],

    features: [
      "Admin dashboard",
      "Homeowner mobile app",
      "Authentication",
      "Facial recognition interface",
      "Live camera interface",
      "Security alerts",
      "User management",
      "Real-time data views",
    ],

    overview:
      "IRIS is a home security system project with separate experiences for administrators and homeowners. My contribution focused on the frontend interfaces and mockups across the dashboard and mobile application, including authentication, monitoring, alerts, and user management.",

    screenshots: [],

    github: "https://github.com/ShanPla/IRIS-Website-Frontend",
    githubLabel: "View Frontend Repository",
  },

  {
    id: "luxestay",
    name: "LuxeStay",
    tag: "Hotel Booking App",
    description:
      "A mobile hotel booking application focused on clean navigation, booking flows, room discovery, and responsive cross-platform interfaces.",
    role: "Frontend Development",
    stack: ["React Native", "Expo", "Firebase"],
    status: "SHIPPED",
    accent: "amber",

    contribution: [
      {
        title: "Booking Experience",
        description:
          "Worked on the user-facing hotel browsing and booking experience.",
      },
      {
        title: "Room Management",
        description:
          "Built and refined the Manage Room interface used for hotel room administration.",
      },
      {
        title: "Room Details",
        description:
          "Connected the Room Detail experience to project data and refined its presentation.",
      },
      {
        title: "My Bookings",
        description:
          "Implemented and refined the My Bookings page, including booking information and date formatting.",
      },
      {
        title: "Authentication UI",
        description:
          "Worked on the registration and sign-in interfaces, including password visibility controls.",
      },
      {
        title: "UI & Layout",
        description:
          "Improved navigation, search interactions, animations, responsive layouts, and cross-platform keyboard behavior.",
      },
    ],

    features: [
      "Hotel browsing",
      "Featured rooms",
      "Room details",
      "Hotel booking",
      "My Bookings",
      "Admin room management",
      "Authentication",
      "Search experience",
    ],

    overview:
      "LuxeStay is a hotel booking application built as a cross-platform mobile experience. My work focused heavily on the frontend, from booking and room interfaces to authentication, navigation, admin screens, and responsive layout improvements.",

    screenshots: [],

    github: "https://github.com/ShanPla/webdev-finals-frontend",
    githubLabel: "View Frontend Repository",
  },
];
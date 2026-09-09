const CLASS_OF = 2028;

// Colgate's academic year rolls over in August. Deriving the class standing and
// the recruiting cycle from the graduation year keeps this copy correct on its
// own, instead of quietly going stale every September.
const STANDINGS = ['first-year', 'first-year', 'sophomore', 'junior', 'senior'];

function academicYearEnd(now = new Date()) {
  return now.getMonth() >= 7 ? now.getFullYear() + 1 : now.getFullYear();
}

function classStanding(gradYear, now = new Date()) {
  const index = 4 - (gradYear - academicYearEnd(now));
  return STANDINGS[Math.min(Math.max(index, 1), 4)];
}

const standing = classStanding(CLASS_OF);
// The summer you recruit for during the current academic year.
const targetSummer = academicYearEnd();

export const resumeData = {
  name: "Ali Abdullah",
  title: "CS & Applied Math @ Colgate | Alumni Memorial Scholar ’28",
  location: "Hamilton, New York, United States",
  email: "aliabdullah123478@gmail.com",
  linkedin: "https://www.linkedin.com/in/aliabdullah12347",
  linkedinHandle: "aliabdullah12347",
  github: "https://github.com/AliAbdullah12347",
  githubHandle: "AliAbdullah12347",
  vercelUrl: "https://aliabdullah.vercel.app/",
  classOf: String(CLASS_OF),
  standing,
  targetSummer,

  heroIntro:
    "Computer Science & Applied Math at Colgate, working where machine learning meets security and real-time graphics — adversarial tooling that keeps artwork out of training sets, agents that learn to play, and 3D environments running at 60fps inside a planetarium dome.",

  aboutText:
    "I gravitate toward problems that sit between disciplines. Most of what I have built lands somewhere between machine learning, security and real-time rendering: an adversarial noise tool that makes images unusable as scraped training data, an ensemble architecture for reducing bias in judicial AI, and Unreal Engine environments now used across four Colgate courses. Day to day that means Python, JavaScript and TypeScript, React and Next.js, with C# and Unreal Blueprints on the graphics side.",

  summaryText:
    `A ${standing} at Colgate studying Computer Science & Applied Math, focused on artificial intelligence and cybersecurity. I have published AI ethics research through a Stanford-affiliated program, shipped production C# fixes as a software engineering intern, and built 3D visualization systems that four university courses now depend on. Seeking Summer ${targetSummer} software engineering or AI/security internships where the problems are genuinely hard.`,

  stats: [
    { label: "Class Of", value: String(CLASS_OF) },
    { label: "Scholar", value: "Alumni Memorial ’28" },
    { label: "Focus", value: "AI & Cyber" }
  ],

  experience: [
    {
      company: "Colgate University",
      roles: [
        {
          title: "Immersive Visualization Developer",
          period: "August 2024 - Present",
          bullets: [
            "Developing and maintaining high-performance 3D visualization systems using Unreal Engine 5 and Blender to power interactive educational experiences for audiences of 50+ attendees.",
            "Optimize real-time rendering pipelines through LOD workflows and mesh topology best practices, consistently achieving 60fps on consumer hardware.",
            "Architect secure deployment workflows for public-facing workstations, including access control and system monitoring, while diagnosing live performance issues using event logs and profiling tools."
          ]
        },
        {
          title: "Teaching Assistant — Python Programming",
          period: "2025 - 2026",
          bullets: [
            "Assisting students in core Python syntax, algorithms, data structures, and secure coding practices."
          ]
        },
        {
          title: "RA - Recreating Noh Kuh",
          period: "May 2025 - July 2025",
          bullets: [
            "Built production-ready 3D environments (Tenochtitlán, Teotihuacán, Noh Kuh) in Unreal Engine 5, integrated into 4 university courses serving 200+ students annually.",
            "Implemented procedural generation scripts in Python and Blueprints to automate asset placement and terrain generation, reducing manual modeling time by 70%.",
            "Collaborated with faculty stakeholders using Agile workflows to deliver iterative prototypes on 2-week sprint cycles.",
            "Optimized large-scale scenes for real-time rendering by implementing occlusion culling, texture streaming, and GPU instancing techniques."
          ]
        }
      ]
    },
    {
      company: "Alterea, Inc.",
      roles: [
        {
          title: "Software Engineering Intern",
          period: "January 2026 - May 2026",
          location: "United States",
          bullets: [
            "Achieved a 30% increase in build stability through resolving critical C# logic errors in the physics engine and UI state-machine systems, using internal logging tools to catch regressions before release",
            "Caught 25+ edge-case failures across physics and input-handling systems through rigorous QA and regression testing, keeping gameplay mechanics at production standard",
            "Managed the full bug lifecycle across 60+ tickets in Git-based version control, cutting average resolution time by 20%"
          ]
        }
      ]
    },
    {
      company: "Polygence",
      roles: [
        {
          title: "AI Ethics Researcher",
          period: "June 2023 - June 2023",
          bullets: [
            "Published research on bias mitigation in judicial AI systems through Stanford-affiliated program. Primary author of 'Biases in Judicial AI: A Proposed Methodology for Combatting Biases'.",
            "Designed ensemble AI architecture reducing algorithmic bias in judicial decision-making by 30-40% (theoretical framework).",
            "Engineered multi-model coordination system using model heterogeneity and decision aggregation algorithms.",
            "Combined ML interpretability, fairness metrics, and legal ethics to create scalable bias mitigation protocols for high-stakes AI.",
            "Analyzed trade-offs between static vs. dynamic model updating strategies for production deployment."
          ]
        }
      ]
    },
    {
      company: "National University of Sciences and Technology (NUST)",
      roles: [
        {
          title: "Research Fellow",
          period: "June 2022 - June 2022",
          bullets: [
            "Selected as 1 of 30 students nationwide from 1,000+ applicants for competitive engineering program at Pakistan Innovation Foundation's National Engineering STEM School.",
            "Designed and prototyped automated greenhouse monitoring system using Arduino, integrating DHT22 temperature/humidity sensors with ESP8266 WiFi module for real-time data transmission.",
            "Developed web-based dashboard (HTML/CSS/JavaScript) displaying live environmental metrics, hosted on local server.",
            "Implemented sensor calibration algorithms and threshold-based alerting system to automate irrigation control."
          ]
        }
      ]
    }
  ],

  education: [
    {
      institution: "Colgate University",
      degree: "Bachelor of Arts, Computer Science & Applied Math",
      period: "August 2024 - May 2028",
      details: "Alumni Memorial Scholar ’28"
    },
    {
      institution: "International School Lahore",
      period: "August 2023 - June 2024"
    },
    {
      institution: "Aitchison College",
      period: "August 2012 - May 2023"
    }
  ],

  certifications: [
    "Tuck Business Bridge Program",
    "Building LLM Applications With Prompt Engineering"
  ],

  honors: [
    "Bronze Medalist – Singapore International Mathematics Olympiad",
    "Gold Medalist – American Mathematics Olympiad",
    "Top in Punjab; Additional Mathematics – IGCSE (Outstanding Cambridge Learner Award)",
    "Director’s Award for Academic Excellence",
    "Best Across Five Subjects – AS Levels (Cambridge High Achievement Award)"
  ],

  skills: [
    "Python", "JavaScript", "TypeScript", "Java", "C", "C#",
    "React", "Next.js", "Tailwind CSS",
    "PyTorch", "Supabase", "Prisma", "PostgreSQL",
    "Unreal Engine", "Blender", "Git/GitHub"
  ],

  languages: [
    { name: "English", level: "Native or Bilingual" },
    { name: "Urdu", level: "Native or Bilingual" },
    { name: "Hindi", level: "Full Professional" },
    { name: "Punjabi", level: "Professional Working" },
    { name: "Arabic", level: "Limited Working" },
  ],
  hobbies: [
    {
      name: "Table Tennis",
      focus: true,
      description: "An avid table tennis player focusing on high-speed spin control and aggressive offensive loops. The rapid reflex arcs and split-second tactical calculations on the table mirrors the microsecond decisions required when optimizing algorithms."
    },
    {
      name: "Urdu Poetry",
      focus: true,
      description: "Deeply passionate about classical Urdu Ghazals, studying complex rhythmic meters (baher) and symbolic metaphors of poets like Mirza Ghalib and Allama Iqbal. To me, a beautifully balanced couplet carries the same elegance as a perfectly engineered recursive function.",
      couplet: [
        "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے",
        "بہت نکلے میرے ارمان لیکن پھر بھی کم نکلے"
      ],
      coupletPoet: "Mirza Ghalib",
      coupletTranslation: "A thousand desires, each one worth dying for — many were fulfilled, yet still too few."
    },
    { name: "Badminton" },
    { name: "Travelling" },
    { name: "UFC" },
    { name: "Fragrance Collection" },
    { name: "Cricket" },
    { name: "3D Modelling & Animation" },
    { name: "Language Learning" }
  ]
};


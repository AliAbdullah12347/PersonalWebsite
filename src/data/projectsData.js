export const projectsData = [
  {
    id: 1,
    title: "Image Poisoning Web App",
    category: "AI / Security",
    image: "/images/projects/image_poisoning.jpg",
    desc: "A web application that safeguards digital images from unauthorized AI training by injecting invisible, model-disrupting noise.",
    longDesc: "A web application designed to protect artist intellectual property and digital images from unauthorized machine learning scraped training datasets. It injects imperceptible, adversarial noise perturbations into image pixel matrices, causing downstream generative AI models to fail or misclassify features while maintaining human visual clarity.",
    tech: ["Python", "PyTorch", "React", "Tailwind CSS"],
    github: "https://github.com/AliAbdullah12347/Image-Poisoning",
    liveUrl: "https://image-poisoning.vercel.app",
    threatModel: {
      spoofing: 2,
      tampering: 4,
      repudiation: 1,
      infoDisclosure: 3,
      dos: 3,
      elevationOfPrivilege: 2
    }
  },
  {
    id: 2,
    title: "Language Learning AI Tutor",
    category: "AI",
    image: "/images/projects/language_tutor.jpg",
    desc: "A web application that facilitates rapid language acquisition by decomposing complex syntactic structures into intuitive, interactive learning modules.",
    longDesc: "An AI-powered educational web surface that breaks down complex foreign language syntactic structures, idioms, and grammar into interactive learning steps. Utilizes LLM prompt engineering and real-time speech feedback to provide personalized language tutoring.",
    tech: ["TypeScript", "React", "Next.js", "Gemini API"],
    github: "https://github.com/AliAbdullah12347/Language-Learning-Website",
    liveUrl: "https://language-learning-website-brown.vercel.app",
    threatModel: {
      spoofing: 1,
      tampering: 2,
      repudiation: 1,
      infoDisclosure: 2,
      dos: 2,
      elevationOfPrivilege: 1
    }
  },
  {
    id: 3,
    title: "Full-Stack Note-Taking AI App",
    category: "Full-Stack",
    image: "/images/projects/1.png",
    desc: "Built a full-stack web application using Next.js 15, Supabase, Prisma, Tailwind CSS, and Gemini API for AI-assisted + cloud-synced note-taking and organization.",
    longDesc: "AI-Powered Full-Stack Notes App – A modern Next.js 15 + Supabase + Prisma notes app with AI summarization (Gemini), sleek Tailwind + shadcn/ui design, and deploy-ready architecture. Built to showcase clean component hierarchy, server actions, and cloud database persistence.",
    tech: ["Next.js 15", "Supabase", "Prisma", "Tailwind CSS", "Gemini API", "PostgreSQL"],
    github: "https://github.com/AliAbdullah12347/noteshelperapp",
    liveUrl: "https://noteshelperapp.vercel.app",
    threatModel: {
      spoofing: 2,
      tampering: 3,
      repudiation: 2,
      infoDisclosure: 3,
      dos: 3,
      elevationOfPrivilege: 3
    }
  },
  {
    id: 4,
    title: "Flappy Bird AI",
    category: "AI",
    image: "/images/projects/2.png",
    desc: "Built an AI agent that learns to play Flappy Bird using reinforcement learning techniques in Python, experimenting with neural networks and training strategies.",
    longDesc: "Flappy Bird AI (NEAT + Custom Enhancements) – An implementation of the Flappy Bird game with a genetic algorithm (NEAT) that trains neural networks to play autonomously. Includes graphical modifications, custom rewards, and neural network visualization.",
    tech: ["Python", "PyTorch", "Pygame", "NEAT / RL"],
    github: "https://github.com/AliAbdullah12347/flappyBirdAI",
    liveUrl: null,
    threatModel: {
      spoofing: 1,
      tampering: 1,
      repudiation: 1,
      infoDisclosure: 1,
      dos: 2,
      elevationOfPrivilege: 1
    }
  },
  {
    id: 5,
    title: "Karaoke Dome Projection Visualizer",
    category: "Graphics / Systems",
    image: "/images/projects/karaoke_dome.jpg",
    desc: "Created a karaoke lyric display system and audio visualizer compatible with dome projection using Unreal Engine 5.3 and Blueprints.",
    longDesc: "Real-time 3D immersive visualization system built inside Unreal Engine 5.3 for planetarium and 360° dome projections. Features real-time FFT audio spectrum analysis driving particle Niagara effects, custom Blueprint shader networks, and synchronized fish-eye dome camera rendering.",
    tech: ["Unreal Engine 5.3", "Blueprints", "Blender", "HLSL"],
    github: "https://github.com/AliAbdullah12347/Vulnerability-Scanner",
    liveUrl: null,
    threatModel: {
      spoofing: 1,
      tampering: 2,
      repudiation: 1,
      infoDisclosure: 1,
      dos: 3,
      elevationOfPrivilege: 2
    }
  },
  {
    id: 6,
    title: "Portfolio Website",
    category: "Web Dev",
    image: "/images/projects/portfolio_website.jpg",
    desc: "Developed a personal portfolio website using React and Tailwind CSS to showcase projects and skills.",
    longDesc: "Cyberpunk HUD-themed, fully responsive personal portfolio website built with React, Vite, and custom CSS design tokens. Features Web Audio API retro sound feedback, interactive command shell terminal, bento grid layout, and Vercel cloud deployment readiness.",
    tech: ["React", "Vite", "Vanilla CSS", "Vercel"],
    github: "https://github.com/AliAbdullah12347/PersonalWebsite",
    liveUrl: "https://aliabdullah.vercel.app/",
    threatModel: {
      spoofing: 1,
      tampering: 1,
      repudiation: 1,
      infoDisclosure: 1,
      dos: 2,
      elevationOfPrivilege: 1
    }
  }
];

"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "Full-Stack Note-Taking AI App",
    description: "Built a full-stack web application using Next.js 15, Supabase, Prisma, Tailwind CSS, and Gemini API for AI-assisted + cloud-synced note-taking and organization.",
    image: "/images/projects/1.png",
    tag: ["All", "Web", "AI"],
    gitUrl: "https://github.com/AliAbdullah12347/noteshelperapp",
    previewUrl: "https://noteshelperapp.vercel.app/",
  },
  {
    id: 2,
    title: "Flappy Bird AI",
    description: "Built an AI agent that learns to play Flappy Bird using reinforcement learning techniques in Python, experimenting with neural networks and training strategies.",
    image: "/images/projects/2.png",
    tag: ["All", "AI", "Python"],
    gitUrl: "https://github.com/AliAbdullah12347/flappyBirdAI",
    previewUrl: "https://github.com/AliAbdullah12347/flappyBirdAI",
  },
  {
    id: 3,
    title: "Karaoke Dome Projection Visualizer",
    description: "Created a karaoke lyric display system and audio visualizer compatible with dome projection using Unreal Engine 5.3 and Blueprints.",
    image: "/images/projects/4.png",
    tag: ["All", "Unreal Engine", "Interactive"],
    gitUrl: "https://github.com/SoloFausto/Karaoke-Visualizer",
    previewUrl: "#",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Developed a personal portfolio website using React and Tailwind CSS to showcase projects and skills.",
    image: "/images/projects/3.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/AliAbdullah12347/portfolio-website",
    previewUrl: "#",
  },
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects">
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
      
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;

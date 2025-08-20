"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-2">
        <li>JavaScript</li>
        <li>Java</li>
        <li>C</li>
        <li>Python</li>
        <li>React</li>
        <li>Next.js</li>
        <li>Tailwind CSS</li>
        <li>Supabase</li>
        <li>Prisma</li>
        <li>PostgreSQL</li>
        <li>Unreal Engine</li>
        <li>Blender</li>
        <li>Git/Github</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2">
        <li>Colgate University – Computer Science & Applied Mathematics</li>
        <li>International School Lahore – High School Diploma (A Levels)</li>
        <li>Aitchison College – High School Diploma (IGCSE & AS Levels)</li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-2">
        <li>CS50: Introduction to Computer Science</li>
        <li>Polygence Research Program: Biases in Judicial AI</li>
        <li>Data Structures & Algorithms</li>
        <li>Artificial Intelligence & Machine Learning</li>
        <li>Computer Systems & Architecture</li>
        <li>Software Engineering & Full-Stack Development</li>
        <li>Calculus (Single & Multivariable) & Linear Algebra</li>
        <li>Probability, Statistics, & Mathematical Modeling</li>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section className="text-white" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <Image src="/images/about-image1.png" width={500} height={500} />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-base lg:text-lg">
            I am a full-stack developer and AI/ML enthusiast with experience building interactive and responsive applications. I work with JavaScript, Python, React, Next.js, Tailwind CSS, Supabase, Prisma, Unreal Engine, and Git. I enjoy learning new technologies, tackling challenging problems, and collaborating on projects that combine creativity with technical precision.
          </p>
          <div className="flex flex-row justify-start mt-8">
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
            >
              {" "}
              Skills{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              {" "}
              Education{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
            >
              {" "}
              Certifications{" "}
            </TabButton>
          </div>
          <div className="mt-8">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

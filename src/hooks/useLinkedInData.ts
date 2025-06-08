
import { useLinkedInIntegration } from "./useLinkedInIntegration";
import { createLinkedInDemoData } from "@/utils/linkedInDataUtils";

export const useLinkedInData = () => {
  const { profile, isConnected } = useLinkedInIntegration();

  const linkedInData = isConnected ? createLinkedInDemoData(profile) : null;
  const experiences = isConnected ? createExperienceData() : [];

  return {
    linkedInData,
    experiences,
    loading: false,
  };
};

const createExperienceData = () => [
  {
    title: "Senior Full Stack Developer",
    companyName: "Tech Innovation Corp",
    startDate: "2022-01-01",
    endDate: "",
    isCurrent: true,
    location: "San Francisco, CA",
    description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and driving technical architecture decisions."
  },
  {
    title: "Full Stack Developer",
    companyName: "Digital Solutions Inc",
    startDate: "2020-06-01",
    endDate: "2021-12-31",
    isCurrent: false,
    location: "Remote",
    description: "Developed and maintained multiple client-facing web applications. Collaborated with cross-functional teams to deliver high-quality software solutions."
  },
  {
    title: "Frontend Developer",
    companyName: "Startup Hub",
    startDate: "2019-03-01",
    endDate: "2020-05-31",
    isCurrent: false,
    location: "New York, NY",
    description: "Built responsive user interfaces and implemented modern JavaScript frameworks. Worked closely with designers to create engaging user experiences."
  },
  {
    title: "Junior Developer",
    companyName: "Code Academy",
    startDate: "2018-01-01",
    endDate: "2019-02-28",
    isCurrent: false,
    location: "Boston, MA",
    description: "Started my career as a junior developer, learning best practices and contributing to various web development projects."
  }
];

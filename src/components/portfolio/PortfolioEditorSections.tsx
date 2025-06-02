
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import EducationSection from "./sections/EducationSection";
import SocialLinksSection from "./sections/SocialLinksSection";

interface PortfolioEditorSectionsProps {
  portfolioData: any;
  onChange: (data: any) => void;
  templateName: string;
}

const sections = [
  {
    id: "personal",
    label: "Personal Info",
    component: PersonalInfoSection,
  },
  {
    id: "skills",
    label: "Skills",
    component: SkillsSection,
  },
  {
    id: "experience",
    label: "Experience",
    component: ExperienceSection,
  },
  {
    id: "projects",
    label: "Projects",
    component: ProjectsSection,
  },
  {
    id: "education",
    label: "Education",
    component: EducationSection,
  },
  {
    id: "social",
    label: "Social Links",
    component: SocialLinksSection,
  },
];

export default function PortfolioEditorSections({
  portfolioData,
  onChange,
  templateName,
}: PortfolioEditorSectionsProps) {
  const [activeSection, setActiveSection] = useState("personal");

  const handleSectionChange = (sectionId: string, sectionData: any) => {
    onChange({
      [sectionId]: sectionData,
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">Template:</span>
        <Badge variant="outline">{templateName}</Badge>
      </div>

      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid grid-cols-6 w-full">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="text-xs">
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => {
          const SectionComponent = section.component;
          return (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              <SectionComponent
                data={portfolioData[section.id] || {}}
                onChange={(data: any) => handleSectionChange(section.id, data)}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

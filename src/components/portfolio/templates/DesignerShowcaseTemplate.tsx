import React from "react";
import { PortfolioData } from "@/types/templates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Palette, Briefcase } from "lucide-react";

interface DesignerShowcaseTemplateProps {
  data: PortfolioData;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
}

export const DesignerShowcaseTemplate: React.FC<
  DesignerShowcaseTemplateProps
> = ({ data, theme }) => {
  const { personalInfo, projects, skills } = data;

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{ fontFamily: theme.fontFamily }}
    >
      <header className="relative h-96 w-full">
        <img
          src={personalInfo.profilePicture || "/placeholder.svg"}
          alt="Header"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-7xl font-extrabold tracking-tight">
            {personalInfo.name}
          </h1>
          <p className="text-2xl mt-2">{personalInfo.title}</p>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <section id="about" className="text-center max-w-3xl mx-auto my-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: theme.primaryColor }}
          >
            About Me
          </h2>
          <p className="text-lg text-gray-700">{personalInfo.bio}</p>
        </section>

        {projects && projects.length > 0 && (
          <section id="portfolio" className="my-16">
            <h2
              className="text-4xl font-bold text-center mb-12 flex items-center justify-center"
              style={{ color: theme.primaryColor }}
            >
              <Camera className="mr-4" /> My Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: "white",
                          }}
                        >
                          View Project
                        </Button>
                      </a>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold">{project.title}</h3>
                    <p className="text-gray-600 mt-2">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {skills && skills.length > 0 && (
          <section id="skills" className="my-16">
            <h2
              className="text-4xl font-bold text-center mb-12 flex items-center justify-center"
              style={{ color: theme.primaryColor }}
            >
              <Palette className="mr-4" /> Skills & Expertise
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white px-6 py-3 rounded-full shadow-md text-lg font-medium text-gray-800"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-800 text-white text-center p-8">
        <h3 className="text-3xl font-bold mb-4">Let's Connect</h3>
        <p className="text-lg mb-4">{personalInfo.email}</p>
        <div className="flex justify-center space-x-6">
          {personalInfo.socialLinks?.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

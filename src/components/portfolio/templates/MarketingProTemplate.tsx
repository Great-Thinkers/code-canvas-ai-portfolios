import React from "react";
import { PortfolioData } from "@/types/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, BarChart2, Target, Award } from "lucide-react";

interface MarketingProTemplateProps {
  data: PortfolioData;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
}

export const MarketingProTemplate: React.FC<MarketingProTemplateProps> = ({
  data,
  theme,
}) => {
  const { personalInfo, projects, experience, skills, seo } = data;

  return (
    <div className="bg-white" style={{ fontFamily: theme.fontFamily }}>
      <header
        className="p-12 text-center bg-gray-50"
        style={{ borderBottom: `4px solid ${theme.primaryColor}` }}
      >
        <h1
          className="text-6xl font-bold"
          style={{ color: theme.primaryColor }}
        >
          {personalInfo.name}
        </h1>
        <p className="text-2xl text-gray-600 mt-2">{personalInfo.title}</p>
        <p className="max-w-3xl mx-auto mt-4 text-gray-500">
          {personalInfo.bio}
        </p>
      </header>

      <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          {projects && projects.length > 0 && (
            <section className="mb-12">
              <h2
                className="text-4xl font-bold mb-6 flex items-center"
                style={{ color: theme.primaryColor }}
              >
                <Target className="mr-4" /> Marketing Campaigns
              </h2>
              <div className="space-y-8">
                {projects.map((project, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <Badge
                              key={i}
                              style={{
                                backgroundColor: theme.primaryColor,
                                color: "white",
                              }}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section>
              <h2
                className="text-4xl font-bold mb-6 flex items-center"
                style={{ color: theme.primaryColor }}
              >
                <Briefcase className="mr-4" /> Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <Card
                    key={index}
                    className="shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl">{exp.role}</CardTitle>
                      <p className="text-lg text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <Card className="shadow-lg text-center p-6">
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              Contact
            </h3>
            <p className="text-gray-700">{personalInfo.email}</p>
            <p className="text-gray-700">{personalInfo.phone}</p>
            <p className="text-gray-700">{personalInfo.location}</p>
          </Card>

          {skills && skills.length > 0 && (
            <Card className="shadow-lg mt-8 p-6">
              <h3
                className="text-2xl font-bold mb-4 flex items-center justify-center"
                style={{ color: theme.primaryColor }}
              >
                <Award className="mr-2" /> Key Skills
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {seo && (
            <Card className="shadow-lg mt-8 p-6">
              <h3
                className="text-2xl font-bold mb-4 flex items-center justify-center"
                style={{ color: theme.primaryColor }}
              >
                <BarChart2 className="mr-2" /> SEO Keywords
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {seo.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>

      <footer className="text-center py-6 bg-gray-50 text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {personalInfo.name}. All Rights
          Reserved.
        </p>
        <p className="text-sm">Powered by AI Portfolio Creator</p>
      </footer>
    </div>
  );
};

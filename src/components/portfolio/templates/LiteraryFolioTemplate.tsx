import React from "react";
import { PortfolioData } from "@/types/templates";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiteraryFolioTemplateProps {
  data: PortfolioData;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
}

export const LiteraryFolioTemplate: React.FC<LiteraryFolioTemplateProps> = ({
  data,
  theme,
}) => {
  const { personalInfo, projects, articles } = data;

  return (
    <div className="p-8 bg-gray-50" style={{ fontFamily: theme.fontFamily }}>
      <header
        className="flex items-center space-x-6 mb-12 border-b-2 pb-6"
        style={{ borderColor: theme.primaryColor }}
      >
        <Avatar
          className="w-24 h-24 border-4"
          style={{ borderColor: theme.primaryColor }}
        >
          <AvatarImage
            src={personalInfo.profilePicture}
            alt={personalInfo.name}
          />
          <AvatarFallback>{personalInfo.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1
            className="text-5xl font-bold"
            style={{ color: theme.primaryColor }}
          >
            {personalInfo.name}
          </h1>
          <p className="text-xl text-gray-600">{personalInfo.title}</p>
          <div className="flex space-x-4 mt-2">
            {personalInfo.socialLinks?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          {articles && articles.length > 0 && (
            <section className="mb-12">
              <h2
                className="text-3xl font-bold border-b-2 pb-2 mb-6"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                }}
              >
                Featured Publications
              </h2>
              <div className="space-y-8">
                {articles.map((article, index) => (
                  <Card
                    key={index}
                    className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {article.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Published on{" "}
                        {new Date(article.publicationDate).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{article.summary}</p>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold"
                        style={{ color: theme.primaryColor }}
                      >
                        Read More &rarr;
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {projects && projects.length > 0 && (
            <section>
              <h2
                className="text-3xl font-bold border-b-2 pb-2 mb-6"
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                }}
              >
                Writing Projects
              </h2>
              <div className="space-y-8">
                {projects.map((project, index) => (
                  <Card
                    key={index}
                    className="shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle style={{ color: theme.primaryColor }}>
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">{personalInfo.bio}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p>{personalInfo.email}</p>
                </div>
                <div>
                  <h4 className="font-bold">Phone</h4>
                  <p>{personalInfo.phone}</p>
                </div>
                <div>
                  <h4 className="font-bold">Location</h4>
                  <p>{personalInfo.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {data.skills && data.skills.length > 0 && (
            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: theme.primaryColor }}>
                  Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </aside>
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Portfolio generated with AI Portfolio Creator</p>
      </footer>
    </div>
  );
};

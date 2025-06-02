import React from "https://esm.sh/react@18.2.0";
import BaseTemplate, { BaseTemplateProps } from "./BaseTemplate.tsx"; // Adjusted path
import { Badge } from "./Badge.tsx"; // Adjusted path
import { Card, CardContent } from "./Card.tsx"; // Adjusted path

// Attempt to import lucide icons from esm.sh
// Note: These are dynamic imports, which might behave differently in Deno/SSR.
// For robust SSR, pre-bundling or ensuring these are statically analyzable is better.
// If these cause issues, they will be removed/replaced.
import Github from "https://esm.sh/lucide-react/dist/esm/icons/github.js";
import Linkedin from "https://esm.sh/lucide-react/dist/esm/icons/linkedin.js";
import Twitter from "https://esm.sh/lucide-react/dist/esm/icons/twitter.js";
import Globe from "https://esm.sh/lucide-react/dist/esm/icons/globe.js";
import Mail from "https://esm.sh/lucide-react/dist/esm/icons/mail.js";
import MapPin from "https://esm.sh/lucide-react/dist/esm/icons/map-pin.js";
import Calendar from "https://esm.sh/lucide-react/dist/esm/icons/calendar.js";
import ExternalLink from "https://esm.sh/lucide-react/dist/esm/icons/external-link.js";

// Simplified BaseTemplateProps for SSR context
interface ModernMinimalTemplateProps {
  portfolioData: any;
  customization?: { sections?: { visibility?: { [key: string]: boolean } } };
  // template prop from original BaseTemplateProps is omitted for now
}

export default function ModernMinimalTemplate({
  portfolioData,
  customization,
}: ModernMinimalTemplateProps) {
  const personal = portfolioData.personal || {};
  const skills = portfolioData.skills || {};
  const experience = portfolioData.experience || {};
  const projects = portfolioData.projects || {};
  const education = portfolioData.education || {};
  const social = portfolioData.social || {};

  const sectionVisibility = customization?.sections?.visibility || {};
  const isVisible = (sectionId: string) => sectionVisibility[sectionId] !== false;

  // Fallback for icons if esm.sh imports don't work as expected in Deno.
  const IconFallback = ({ name }: { name: string }) => <span className="icon-placeholder">{`[${name}]`}</span>;

  const socialIcons: { [key: string]: React.ElementType } = {
    github: Github || (() => <IconFallback name="Github" />),
    linkedin: Linkedin || (() => <IconFallback name="Linkedin" />),
    twitter: Twitter || (() => <IconFallback name="Twitter" />),
    website: Globe || (() => <IconFallback name="Globe" />),
    email: Mail || (() => <IconFallback name="Mail" />),
  };

  const SafeMapPin = MapPin || (() => <IconFallback name="MapPin" />);
  const SafeCalendar = Calendar || (() => <IconFallback name="Calendar" />);
  const SafeExternalLink = ExternalLink || (() => <IconFallback name="ExternalLink" />);


  return (
    // BaseTemplate now expects customization prop directly for this SSR version.
    <BaseTemplate portfolioData={portfolioData} customization={customization}>
      <div className="space-y-12"> {/* Tailwind class */}
        {/* Header Section */}
        {isVisible('personal') && (
          <header className="text-center space-y-6"> {/* Tailwind classes */}
            {personal.avatar && (
              <div className="flex justify-center"> {/* Tailwind class */}
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg" // Tailwind classes
                />
              </div>
            )}
            <div>
              <h1
                className="text-4xl md:text-5xl mb-2" // Tailwind classes
                style={{
                  fontWeight: 'var(--template-heading-weight)',
                  color: 'var(--template-primary)',
                }}
              >
                {personal.name || 'Your Name'}
              </h1>
              <p
                className="text-xl mb-4" // Tailwind class
                style={{ color: 'var(--template-secondary)' }}
              >
                {personal.title || 'Your Professional Title'}
              </p>
              {personal.bio && (
                <p
                  className="max-w-2xl mx-auto leading-relaxed" // Tailwind classes
                  style={{ color: 'var(--template-text-secondary)' }}
                >
                  {personal.bio}
                </p>
              )}
              {personal.location && (
                <div className="flex items-center justify-center gap-2 mt-4"> {/* Tailwind classes */}
                  <SafeMapPin className="h-4 w-4" style={{ color: 'var(--template-secondary)' }} />
                  <span style={{ color: 'var(--template-text-secondary)' }}>
                    {personal.location}
                  </span>
                </div>
              )}
            </div>
          </header>
        )}

        {/* Social Links */}
        {isVisible('social') && Object.values(social).some(link => link) && (
          <div className="flex justify-center gap-4"> {/* Tailwind classes */}
            {Object.entries(social).map(([platform, url]) => {
              if (!url) return null;
              const IconComponent = socialIcons[platform as keyof typeof socialIcons];
              if (!IconComponent) return null;

              return (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full transition-colors hover:scale-110" // Tailwind classes
                  style={{
                    backgroundColor: 'var(--template-surface)',
                    color: 'var(--template-primary)',
                  }}
                >
                  <IconComponent className="h-5 w-5" /> {/* Tailwind class */}
                </a>
              );
            })}
          </div>
        )}

        {/* Skills Section */}
        {isVisible('skills') && skills.technical?.length > 0 && (
          <section>
            <h2
              className="text-2xl mb-6" // Tailwind classes
              style={{
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2"> {/* Tailwind classes */}
              {skills.technical.map((skill: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1" // Tailwind classes
                  style={{
                    borderColor: 'var(--template-primary)',
                    color: 'var(--template-primary)',
                  }}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {isVisible('experience') && experience.positions?.length > 0 && (
          <section>
            <h2
              className="text-2xl mb-6" // Tailwind classes
              style={{
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Experience
            </h2>
            <div className="space-y-6"> {/* Tailwind class */}
              {experience.positions.map((position: any, index: number) => (
                <Card key={index} style={{ backgroundColor: 'var(--template-surface)' }}>
                  <CardContent className="p-6"> {/* Tailwind class, CardContent already has p-6 pt-0, this will override if cn is structured to allow it or add to it. Given our simple cn, it just adds it. */}
                    <div className="flex justify-between items-start mb-2"> {/* Tailwind classes */}
                      <h3
                        className="text-lg font-semibold" // Tailwind class
                        style={{ color: 'var(--template-text)' }}
                      >
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--template-text-secondary)' }}> {/* Tailwind classes */}
                        <SafeCalendar className="h-4 w-4" /> {/* Tailwind class */}
                        {position.startDate} - {position.endDate || 'Present'}
                      </div>
                    </div>
                    <p
                      className="font-medium mb-2" // Tailwind classes
                      style={{ color: 'var(--template-secondary)' }}
                    >
                      {position.company}
                    </p>
                    {position.description && (
                      <p style={{ color: 'var(--template-text-secondary)' }}>
                        {position.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {isVisible('projects') && projects.items?.length > 0 && (
          <section>
            <h2
              className="text-2xl mb-6" // Tailwind classes
              style={{
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Tailwind classes */}
              {projects.items.map((project: any, index: number) => (
                <Card key={index} style={{ backgroundColor: 'var(--template-surface)' }}>
                  <CardContent className="p-6"> {/* Tailwind class */}
                    <div className="flex justify-between items-start mb-2"> {/* Tailwind classes */}
                      <h3
                        className="text-lg font-semibold" // Tailwind class
                        style={{ color: 'var(--template-text)' }}
                      >
                        {project.name}
                      </h3>
                      {(project.github || project.demo) && (
                        <div className="flex gap-2"> {/* Tailwind classes */}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--template-primary)' }}
                            >
                              <socialIcons.github className="h-4 w-4" /> {/* Tailwind class */}
                            </a>
                          )}
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--template-primary)' }}
                            >
                              <SafeExternalLink className="h-4 w-4" /> {/* Tailwind class */}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {project.description && (
                      <p
                        className="mb-3" // Tailwind class
                        style={{ color: 'var(--template-text-secondary)' }}
                      >
                        {project.description}
                      </p>
                    )}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1"> {/* Tailwind classes */}
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <Badge
                            key={techIndex}
                            variant="secondary" // This was 'secondary' in original, check our adapted Badge
                            className="text-xs" // Tailwind class
                            style={{
                              backgroundColor: 'var(--template-accent)', // This will likely override Badge's variant bg
                              color: 'white', // This will likely override Badge's variant text color
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

        {/* Education Section */}
        {isVisible('education') && education.institutions?.length > 0 && (
          <section>
            <h2
              className="text-2xl mb-6" // Tailwind classes
              style={{
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Education
            </h2>
            <div className="space-y-4"> {/* Tailwind class */}
              {education.institutions.map((edu: any, index: number) => (
                <Card key={index} style={{ backgroundColor: 'var(--template-surface)' }}>
                  <CardContent className="p-6"> {/* Tailwind class */}
                    <div className="flex justify-between items-start"> {/* Tailwind classes */}
                      <div>
                        <h3
                          className="text-lg font-semibold" // Tailwind class
                          style={{ color: 'var(--template-text)' }}
                        >
                          {edu.degree}
                        </h3>
                        <p
                          className="font-medium" // Tailwind class
                          style={{ color: 'var(--template-secondary)' }}
                        >
                          {edu.institution}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--template-text-secondary)' }}> {/* Tailwind classes */}
                        <SafeCalendar className="h-4 w-4" /> {/* Tailwind class */}
                        {edu.year}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </BaseTemplate>
  );
}

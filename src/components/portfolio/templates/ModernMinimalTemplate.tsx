
import { BaseTemplateProps } from './BaseTemplate';
import BaseTemplate from './BaseTemplate';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';

export default function ModernMinimalTemplate({
  portfolioData,
  template,
  customization,
}: BaseTemplateProps) {
  const personal = portfolioData.personal || {};
  const skills = portfolioData.skills || {};
  const experience = portfolioData.experience || {};
  const projects = portfolioData.projects || {};
  const education = portfolioData.education || {};
  const social = portfolioData.social || {};

  const sectionVisibility = customization?.sections?.visibility || {};
  const isVisible = (sectionId: string) => sectionVisibility[sectionId] !== false;

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
    email: Mail,
  };

  return (
    <BaseTemplate portfolioData={portfolioData} template={template} customization={customization}>
      <div className="space-y-12">
        {/* Header Section */}
        {isVisible('personal') && (
          <header className="text-center space-y-6">
            {personal.avatar && (
              <div className="flex justify-center">
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
              </div>
            )}
            <div>
              <h1 
                className="text-4xl md:text-5xl mb-2"
                style={{ 
                  fontWeight: 'var(--template-heading-weight)',
                  color: 'var(--template-primary)',
                }}
              >
                {personal.name || 'Your Name'}
              </h1>
              <p 
                className="text-xl mb-4"
                style={{ color: 'var(--template-secondary)' }}
              >
                {personal.title || 'Your Professional Title'}
              </p>
              {personal.bio && (
                <p 
                  className="max-w-2xl mx-auto leading-relaxed"
                  style={{ color: 'var(--template-text-secondary)' }}
                >
                  {personal.bio}
                </p>
              )}
              {personal.location && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <MapPin className="h-4 w-4" style={{ color: 'var(--template-secondary)' }} />
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
          <div className="flex justify-center gap-4">
            {Object.entries(social).map(([platform, url]) => {
              if (!url) return null;
              const IconComponent = socialIcons[platform as keyof typeof socialIcons];
              if (!IconComponent) return null;
              
              return (
                <a
                  key={platform}
                  href={String(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full transition-colors hover:scale-110"
                  style={{ 
                    backgroundColor: 'var(--template-surface)',
                    color: 'var(--template-primary)',
                  }}
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        )}

        {/* Skills Section */}
        {isVisible('skills') && skills.technical?.length > 0 && (
          <section>
            <h2 
              className="text-2xl mb-6"
              style={{ 
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.technical.map((skill: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1"
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
              className="text-2xl mb-6"
              style={{ 
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Experience
            </h2>
            <div className="space-y-6">
              {experience.positions.map((position: any, index: number) => (
                <Card key={index} style={{ backgroundColor: 'var(--template-surface)' }}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: 'var(--template-text)' }}
                      >
                        {position.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--template-text-secondary)' }}>
                        <Calendar className="h-4 w-4" />
                        {position.startDate} - {position.endDate || 'Present'}
                      </div>
                    </div>
                    <p 
                      className="font-medium mb-2"
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
              className="text-2xl mb-6"
              style={{ 
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.items.map((project: any, index: number) => (
                <Card key={index} style={{ backgroundColor: 'var(--template-surface)' }}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: 'var(--template-text)' }}
                      >
                        {project.name}
                      </h3>
                      {(project.github || project.demo) && (
                        <div className="flex gap-2">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--template-primary)' }}
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--template-primary)' }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {project.description && (
                      <p 
                        className="mb-3"
                        style={{ color: 'var(--template-text-secondary)' }}
                      >
                        {project.description}
                      </p>
                    )}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: 'var(--template-accent)',
                              color: 'white',
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
              className="text-2xl mb-6"
              style={{ 
                fontWeight: 'var(--template-heading-weight)',
                color: 'var(--template-primary)',
              }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.institutions.map((edu: any, index: number) => (
                <Card key={index} style={{ backgroundColor: 'var(--template-surface)' }}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 
                          className="text-lg font-semibold"
                          style={{ color: 'var(--template-text)' }}
                        >
                          {edu.degree}
                        </h3>
                        <p 
                          className="font-medium"
                          style={{ color: 'var(--template-secondary)' }}
                        >
                          {edu.institution}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--template-text-secondary)' }}>
                        <Calendar className="h-4 w-4" />
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

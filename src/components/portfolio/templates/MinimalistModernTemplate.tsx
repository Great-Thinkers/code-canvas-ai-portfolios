
import { ReactNode } from 'react';
import { TemplateTheme, TemplateCustomization } from '@/types/templates';
import BaseTemplate from './BaseTemplate';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface MinimalistModernTemplateProps {
  portfolioData: any;
  template: TemplateTheme;
  customization?: TemplateCustomization;
  children: ReactNode;
}

export default function MinimalistModernTemplate({
  portfolioData,
  template,
  customization,
  children,
}: MinimalistModernTemplateProps) {
  const personal = portfolioData.personal || {};
  const skills = portfolioData.skills || {};
  const experience = portfolioData.experience || {};
  const projects = portfolioData.projects || {};
  const education = portfolioData.education || {};
  const social = portfolioData.social || {};

  const sectionVisibility = customization?.sections?.visibility || {};
  const isVisible = (sectionId: string) => sectionVisibility[sectionId] !== false;

  return (
    <BaseTemplate portfolioData={portfolioData} template={template} customization={customization}>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-light">
                {personal.name || 'Portfolio'}
              </div>
              <div className="hidden md:flex space-x-12 text-sm uppercase tracking-wider">
                <a href="#about" className="hover:text-gray-600 transition-colors">About</a>
                <a href="#work" className="hover:text-gray-600 transition-colors">Work</a>
                <a href="#projects" className="hover:text-gray-600 transition-colors">Projects</a>
                <a href="#contact" className="hover:text-gray-600 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        {isVisible('personal') && (
          <section id="about" className="pt-32 pb-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <h1 className="text-6xl lg:text-8xl font-light leading-none mb-6">
                      {personal.name || 'Your Name'}
                    </h1>
                    <div className="w-24 h-px bg-gray-900 mb-6"></div>
                    <p className="text-xl text-gray-600 font-light">
                      {personal.title || 'Creative Professional'}
                    </p>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
                    {personal.bio || 'I create meaningful digital experiences through thoughtful design and development. My work focuses on simplicity, functionality, and human-centered solutions.'}
                  </p>
                  {personal.location && (
                    <div className="text-sm text-gray-500 uppercase tracking-wider">
                      Based in {personal.location}
                    </div>
                  )}
                </div>
                {personal.avatar && (
                  <div className="flex justify-center lg:justify-end">
                    <img
                      src={personal.avatar}
                      alt={personal.name}
                      className="w-96 h-96 object-cover rounded-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {isVisible('skills') && skills.technical?.length > 0 && (
          <section className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-light mb-4">Expertise</h2>
              <div className="w-24 h-px bg-gray-900 mb-16"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {skills.technical.map((skill: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-sm uppercase tracking-wider text-gray-600">
                      {skill.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {isVisible('experience') && experience.positions?.length > 0 && (
          <section id="work" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-light mb-4">Experience</h2>
              <div className="w-24 h-px bg-gray-900 mb-16"></div>
              <div className="space-y-16">
                {experience.positions.map((position: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                      <h3 className="text-2xl font-light mb-2">{position.company}</h3>
                      <p className="text-gray-600 mb-4">{position.title}</p>
                      <div className="text-sm text-gray-500 uppercase tracking-wider">
                        {position.startDate} — {position.endDate || 'Present'}
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="text-gray-700 leading-relaxed">
                        {position.description || 'Responsibilities and achievements in this role.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {isVisible('projects') && projects.items?.length > 0 && (
          <section id="projects" className="py-24 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-light mb-4">Selected Work</h2>
              <div className="w-24 h-px bg-gray-900 mb-16"></div>
              <div className="space-y-24">
                {projects.items.map((project: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                      <div className="aspect-video bg-gray-200 rounded-none"></div>
                    </div>
                    <div className={index % 2 === 0 ? 'order-2' : 'order-1'}>
                      <h3 className="text-3xl font-light mb-4">{project.name}</h3>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {project.description || 'Project description goes here.'}
                      </p>
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-6">
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <span key={techIndex} className="text-sm text-gray-500 uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-6">
                        {project.github && (
                          <a href={project.github} className="text-sm uppercase tracking-wider border-b border-gray-900 hover:border-gray-400 transition-colors">
                            View Code
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} className="text-sm uppercase tracking-wider border-b border-gray-900 hover:border-gray-400 transition-colors">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {isVisible('social') && (
          <section id="contact" className="py-24 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl font-light mb-4">Let's Connect</h2>
              <div className="w-24 h-px bg-gray-900 mx-auto mb-16"></div>
              <p className="text-xl text-gray-600 font-light mb-12 max-w-2xl mx-auto">
                I'm always interested in new opportunities and collaborations.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
                {social.email && (
                  <a href={`mailto:${social.email}`} className="text-lg border-b border-gray-900 hover:border-gray-400 transition-colors">
                    {social.email}
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} className="text-lg border-b border-gray-900 hover:border-gray-400 transition-colors">
                    LinkedIn
                  </a>
                )}
                {social.github && (
                  <a href={social.github} className="text-lg border-b border-gray-900 hover:border-gray-400 transition-colors">
                    GitHub
                  </a>
                )}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">
                © {new Date().getFullYear()} {personal.name || 'Portfolio'}
              </div>
            </div>
          </section>
        )}
      </div>
    </BaseTemplate>
  );
}

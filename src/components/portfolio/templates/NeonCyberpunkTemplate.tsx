
import { ReactNode } from 'react';
import { TemplateTheme, TemplateCustomization } from '@/types/templates';
import BaseTemplate from './BaseTemplate';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface NeonCyberpunkTemplateProps {
  portfolioData: any;
  template: TemplateTheme;
  customization?: TemplateCustomization;
  children: ReactNode;
}

export default function NeonCyberpunkTemplate({
  portfolioData,
  template,
  customization,
  children,
}: NeonCyberpunkTemplateProps) {
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
      <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
        {/* Animated grid background */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-green-400/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-green-400 animate-pulse">
                {'>'} {personal.name?.toUpperCase() || 'PORTFOLIO'}_
              </div>
              <div className="hidden md:flex space-x-8 text-sm">
                <a href="#bio" className="hover:text-white transition-colors">[ABOUT]</a>
                <a href="#exp" className="hover:text-white transition-colors">[EXP]</a>
                <a href="#proj" className="hover:text-white transition-colors">[PROJ]</a>
                <a href="#contact" className="hover:text-white transition-colors">[CONTACT]</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        {isVisible('personal') && (
          <section id="bio" className="pt-24 pb-20 px-6 relative">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="text-sm animate-pulse">$ sudo whoami</div>
                  <h1 className="text-4xl lg:text-6xl font-bold">
                    <span className="text-white">root@</span>
                    <span className="text-green-400">{personal.name?.toLowerCase().replace(' ', '-') || 'developer'}</span>
                    <span className="animate-pulse">_</span>
                  </h1>
                  <div className="bg-green-400 text-black px-4 py-2 inline-block font-bold">
                    [{personal.title?.toUpperCase() || 'SYSTEM ADMINISTRATOR'}]
                  </div>
                  <div className="border border-green-400 p-4 bg-green-400/5">
                    <div className="text-xs text-green-300 mb-2">/* Bio */</div>
                    <p className="text-sm leading-relaxed">
                      {personal.bio || 'Experienced system architect with expertise in cybersecurity, full-stack development, and digital infrastructure. Passionate about creating secure, innovative solutions.'}
                    </p>
                  </div>
                  {personal.location && (
                    <div className="flex items-center gap-2 text-green-300">
                      <span>📍</span>
                      <span className="text-xs">LOCATION: {personal.location.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                {personal.avatar && (
                  <div className="flex-shrink-0 relative">
                    <div className="relative">
                      <div className="absolute inset-0 border-2 border-green-400 animate-pulse"></div>
                      <img
                        src={personal.avatar}
                        alt={personal.name}
                        className="w-72 h-72 object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                        style={{ filter: 'grayscale(1) contrast(1.2) brightness(0.8)' }}
                      />
                      <div className="absolute inset-0 bg-green-400/10"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {isVisible('skills') && skills.technical?.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">
                <span className="text-green-400">$</span> cat /etc/skills.conf
              </h2>
              <div className="border border-green-400 bg-green-400/5 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {skills.technical.map((skill: any, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="text-green-400">{'>'}</span> {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {isVisible('experience') && experience.positions?.length > 0 && (
          <section id="exp" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-white">
                <span className="text-green-400">$</span> history | grep "work_experience"
              </h2>
              <div className="space-y-6">
                {experience.positions.map((position: any, index: number) => (
                  <div key={index} className="border border-green-400/30 bg-green-400/5 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{position.company}</h3>
                        <p className="text-green-300">{position.title}</p>
                      </div>
                      <div className="text-xs text-green-400">
                        [{position.startDate} - {position.endDate || 'CURRENT'}]
                      </div>
                    </div>
                    <div className="text-sm text-green-200">
                      <span className="text-green-400"># </span>
                      {position.description || 'System administration and development tasks.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {isVisible('projects') && projects.items?.length > 0 && (
          <section id="proj" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-white">
                <span className="text-green-400">$</span> ls -la ~/projects/
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.items.map((project: any, index: number) => (
                  <div key={index} className="border border-green-400/30 bg-green-400/5 p-6 hover:bg-green-400/10 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{project.name}</h3>
                      <div className="flex gap-2">
                        {project.github && (
                          <a href={project.github} className="text-green-400 hover:text-white">
                            [GIT]
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} className="text-green-400 hover:text-white">
                            [DEMO]
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-green-200 mb-4">
                      {project.description || 'Project description not available.'}
                    </p>
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <span key={techIndex} className="text-xs text-black bg-green-400 px-2 py-1">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {isVisible('social') && (
          <section id="contact" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-white">
                <span className="text-green-400">$</span> cat /etc/contact.cfg
              </h2>
              <div className="border border-green-400 bg-green-400/5 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-green-400">email:</span> {social.email || 'admin@domain.com'}
                      </div>
                      <div>
                        <span className="text-green-400">github:</span> {social.github || 'github.com/username'}
                      </div>
                      <div>
                        <span className="text-green-400">linkedin:</span> {social.linkedin || 'linkedin.com/in/username'}
                      </div>
                      <div>
                        <span className="text-green-400">location:</span> {personal.location || 'Earth'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-green-400 animate-pulse">
                      [{new Date().getFullYear()}]
                    </div>
                    <div className="text-sm text-green-300">SYSTEM ONLINE</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </BaseTemplate>
  );
}

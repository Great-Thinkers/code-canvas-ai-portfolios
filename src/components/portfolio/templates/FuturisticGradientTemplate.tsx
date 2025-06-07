
import { ReactNode } from 'react';
import { TemplateTheme, TemplateCustomization } from '@/types/templates';
import BaseTemplate from './BaseTemplate';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface FuturisticGradientTemplateProps {
  portfolioData: any;
  template: TemplateTheme;
  customization?: TemplateCustomization;
  children: ReactNode;
}

export default function FuturisticGradientTemplate({
  portfolioData,
  template,
  customization,
  children,
}: FuturisticGradientTemplateProps) {
  const personal = portfolioData.personal || {};
  const skills = portfolioData.skills || {};
  const experience = portfolioData.experience || {};
  const projects = portfolioData.projects || {};
  const education = portfolioData.education || {};
  const social = portfolioData.social || {};

  const sectionVisibility = customization?.sections?.visibility || {};
  const isVisible = (sectionId: string) => sectionVisibility[sectionId] !== false;

  const socialIcons: { [key: string]: React.ElementType } = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
    email: Mail,
  };

  return (
    <BaseTemplate portfolioData={portfolioData} template={template} customization={customization}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {personal.name?.toUpperCase() || 'PORTFOLIO'}
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#about" className="hover:text-cyan-400 transition-colors">ABOUT ME</a>
                <a href="#experience" className="hover:text-cyan-400 transition-colors">EXPERIENCE</a>
                <a href="#projects" className="hover:text-cyan-400 transition-colors">PROJECTS</a>
                <a href="#contact" className="hover:text-cyan-400 transition-colors">CONTACT</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        {isVisible('personal') && (
          <section id="about" className="pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                  <div className="text-sm text-cyan-400 font-mono">Hello !!!</div>
                  <h1 className="text-5xl lg:text-7xl font-bold">
                    I'm {personal.name || 'Your Name'}
                  </h1>
                  <div className="inline-block bg-gradient-to-r from-cyan-400 to-blue-400 text-black px-4 py-2 rounded font-mono text-sm">
                    {personal.title || 'PROFESSIONAL TITLE'}
                  </div>
                  <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                    {personal.bio || 'Your professional bio will appear here. Describe your expertise, passion, and what drives you in your field.'}
                  </p>
                  {personal.location && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{personal.location}</span>
                    </div>
                  )}
                </div>
                {personal.avatar && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg blur-lg opacity-30"></div>
                      <img
                        src={personal.avatar}
                        alt={personal.name}
                        className="relative w-80 h-80 object-cover rounded-lg"
                      />
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
              <h2 className="text-3xl font-bold mb-4">Skill & Interest</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-400 mb-12"></div>
              <div className="flex flex-wrap gap-4">
                {skills.technical.map((skill: any, index: number) => (
                  <div
                    key={index}
                    className="px-6 py-3 border border-gray-600 rounded-full hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {isVisible('experience') && experience.positions?.length > 0 && (
          <section id="experience" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold">EXPERIENCE</h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-400 mt-4"></div>
                </div>
                <div className="text-6xl font-bold text-gray-700">
                  2021 - 2023
                </div>
              </div>
              <div className="space-y-8">
                {experience.positions.map((position: any, index: number) => (
                  <div key={index} className="flex items-start gap-6">
                    <div className="text-cyan-400 text-2xl">»</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-cyan-400">{position.company}</h3>
                      <p className="text-gray-300 mb-2">{position.title} {position.startDate} - {position.endDate || 'Present'}</p>
                      <p className="text-gray-400 leading-relaxed max-w-3xl">
                        {position.description || 'Experience description will appear here.'}
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
          <section id="projects" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold">SELECTED PROJECT</h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-400 mt-4"></div>
                </div>
                <div className="text-6xl font-bold text-gray-700">
                  2022 - 2023
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.items.map((project: any, index: number) => (
                  <div key={index} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 h-64 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                        <p className="text-sm text-gray-300">
                          {project.description || 'Project description will appear here.'}
                        </p>
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
          <section id="contact" className="py-20 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-4">GET IN TOUCH</h2>
              <p className="text-cyan-400 text-lg mb-12">Let's Work Together</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-bold mb-2">Email & Website</h3>
                  <p className="text-gray-400 text-sm">{social.email || 'hello@example.com'}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-bold mb-2">Address</h3>
                  <p className="text-gray-400 text-sm">{personal.location || 'Your Location'}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-bold mb-2">Social Media</h3>
                  <p className="text-gray-400 text-sm">@yourhandle</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Github className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-bold mb-2">Portfolio</h3>
                  <p className="text-gray-400 text-sm">2023</p>
                </div>
              </div>

              <div className="text-center">
                <div className="text-8xl font-bold text-gray-800 tracking-wider mb-4">
                  {personal.name?.toUpperCase() || 'YOUR NAME'}
                </div>
                <div className="text-xl text-gray-500">PORTFOLIO 2023</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </BaseTemplate>
  );
}

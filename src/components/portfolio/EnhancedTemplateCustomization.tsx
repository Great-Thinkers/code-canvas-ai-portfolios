
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Github, Linkedin, Sparkles } from 'lucide-react';
import { useGitHubData } from '@/hooks/useGitHubData';
import { useLinkedInData } from '@/hooks/useLinkedInData';
import AIContentGenerator from './AIContentGenerator';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  role: string;
  style: string[];
  features: string[];
  tags: string[];
  previewUrl: string;
  isPremium?: boolean;
}

interface UserData {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  title: string;
  bio: string;
  skills: string[];
  projects: number;
}

interface EnhancedTemplateCustomizationProps {
  template: Template;
  onNext: (userData: UserData) => void;
  onBack: () => void;
}

export default function EnhancedTemplateCustomization({
  template,
  onNext,
  onBack,
}: EnhancedTemplateCustomizationProps) {
  const { gitHubData, repositories, languages } = useGitHubData();
  const { linkedInData, experiences } = useLinkedInData();

  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    github: '',
    linkedin: '',
    title: '',
    bio: '',
    skills: [],
    projects: 0,
  });

  const [skillInput, setSkillInput] = useState('');

  // Auto-populate data from integrations
  useEffect(() => {
    if (gitHubData || linkedInData) {
      setUserData(prev => ({
        ...prev,
        name: linkedInData?.firstName && linkedInData?.lastName 
          ? `${linkedInData.firstName} ${linkedInData.lastName}`
          : gitHubData?.name || prev.name,
        email: gitHubData?.email || prev.email,
        github: gitHubData?.login || prev.github,
        title: linkedInData?.headline || prev.title,
        bio: linkedInData?.summary || gitHubData?.bio || prev.bio,
        projects: repositories?.length || prev.projects,
      }));

      // Auto-populate skills from GitHub languages and LinkedIn data
      if (languages && languages.length > 0) {
        setUserData(prev => ({
          ...prev,
          skills: [...new Set([...prev.skills, ...languages])],
        }));
      }
    }
  }, [gitHubData, linkedInData, repositories, languages]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !userData.skills.includes(skillInput.trim())) {
      setUserData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = () => {
    if (userData.name && userData.title) {
      onNext(userData);
    }
  };

  const isFormValid = userData.name.trim() !== '' && userData.title.trim() !== '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold mb-2">
          Customize Your Portfolio Data
        </h2>
        <p className="text-muted-foreground">
          We've auto-filled some information from your connected accounts. Feel free to customize or add more details.
        </p>
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Connected Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span className="text-sm">
                GitHub: {gitHubData ? '✅ Connected' : '❌ Not connected'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <span className="text-sm">
                LinkedIn: {linkedInData ? '✅ Connected' : '❌ Not connected'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="title">Professional Title *</Label>
              <Input
                id="title"
                value={userData.title}
                onChange={(e) => setUserData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Full Stack Developer"
              />
            </div>

            <div>
              <Label htmlFor="github">GitHub Username</Label>
              <Input
                id="github"
                value={userData.github}
                onChange={(e) => setUserData(prev => ({ ...prev, github: e.target.value }))}
                placeholder="your-github-username"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio Section with AI */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <AIContentGenerator
              type="bio"
              context={{
                name: userData.name,
                title: userData.title,
                skills: userData.skills,
                experience: experiences,
                repositories: repositories,
                role: template.role,
              }}
              value={userData.bio}
              onChange={(bio) => setUserData(prev => ({ ...prev, bio }))}
              placeholder="Tell people about yourself and your professional journey..."
              label="Bio"
            />
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill (e.g., React, Python, UI/UX Design)"
              className="flex-1"
            />
            <Button onClick={handleAddSkill} variant="outline">
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {userData.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemoveSkill(skill)}
              >
                {skill} ×
              </Badge>
            ))}
          </div>

          {userData.skills.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No skills added yet. Add some skills to showcase your expertise.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Projects Summary */}
      {repositories && repositories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>GitHub Projects Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{repositories.length}</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Stars</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{languages.length}</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {repositories.filter(repo => !repo.language?.includes('fork')).length}
                </div>
                <div className="text-sm text-muted-foreground">Original Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="bg-brand-500 hover:bg-brand-600"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

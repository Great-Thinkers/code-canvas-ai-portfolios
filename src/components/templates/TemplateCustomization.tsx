import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Github, Linkedin, Code, Palette, RefreshCw, Zap } from "lucide-react";
import { useGitHubData } from "@/hooks/useGitHubData";
import { useLinkedInData } from "@/hooks/useLinkedInData";
import { toast } from "sonner";

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

interface TemplateCustomizationProps {
  template: Template;
  onNext: (userData: UserData) => void;
  onBack: () => void;
}

export default function TemplateCustomization({
  template,
  onNext,
  onBack,
}: TemplateCustomizationProps) {
  const { gitHubData, languages, loading: githubLoading } = useGitHubData();
  const { linkedInData, experiences, loading: linkedinLoading } = useLinkedInData();
  
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john@example.com",
    github: "johndoe",
    linkedin: "johndoe",
    title: "Full Stack Developer",
    bio: "Passionate developer with 5+ years of experience building web applications.",
    skills: ["React", "Node.js", "TypeScript", "Python"],
    projects: 12,
  });

  const [newSkill, setNewSkill] = useState("");

  // Auto-populate data when GitHub/LinkedIn data is available
  useEffect(() => {
    if (gitHubData || linkedInData) {
      const updatedData: Partial<UserData> = {};

      if (gitHubData) {
        updatedData.name = gitHubData.name || userData.name;
        updatedData.email = gitHubData.email || userData.email;
        updatedData.github = gitHubData.login || userData.github;
        updatedData.bio = gitHubData.bio || userData.bio;
        updatedData.projects = gitHubData.public_repos || userData.projects;
        
        // Use programming languages from repositories as skills
        if (languages.length > 0) {
          updatedData.skills = [...new Set([...languages, ...userData.skills])];
        }
      }

      if (linkedInData) {
        updatedData.name = `${linkedInData.firstName} ${linkedInData.lastName}`.trim() || updatedData.name;
        updatedData.linkedin = updatedData.name?.toLowerCase().replace(/\s+/g, '') || userData.linkedin;
        updatedData.title = linkedInData.headline || updatedData.title;
        updatedData.bio = linkedInData.summary || updatedData.bio;
      }

      setUserData(prev => ({ ...prev, ...updatedData }));
      
      if (gitHubData || linkedInData) {
        toast.success("Data auto-populated from your connected accounts!");
      }
    }
  }, [gitHubData, linkedInData, languages]);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setUserData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleNext = () => {
    onNext(userData);
  };

  const addLanguagesAsSkills = () => {
    if (languages.length > 0) {
      const newSkills = languages.filter(lang => !userData.skills.includes(lang));
      setUserData((prev) => ({
        ...prev,
        skills: [...prev.skills, ...newSkills],
      }));
      toast.success(`Added ${newSkills.length} programming languages as skills!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">
            Customize Your Portfolio
          </h2>
          <p className="text-muted-foreground">
            Preview how the {template.name} template will look with your
            information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {template.category}
          </Badge>
          {(gitHubData || linkedInData) && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Zap className="h-3 w-3 mr-1" />
              Auto-populated
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
                {(githubLoading || linkedinLoading) && (
                  <RefreshCw className="h-4 w-4 animate-spin ml-auto" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={userData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills & Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github">GitHub Username</Label>
                  <Input
                    id="github"
                    value={userData.github}
                    onChange={(e) =>
                      handleInputChange("github", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn Username</Label>
                  <Input
                    id="linkedin"
                    value={userData.linkedin}
                    onChange={(e) =>
                      handleInputChange("linkedin", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Skills</Label>
                  {languages.length > 0 && (
                    <Button
                      onClick={addLanguagesAsSkills}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Github className="h-3 w-3 mr-1" />
                      Add Languages ({languages.length})
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5" />
            <h3 className="font-semibold">Live Preview</h3>
          </div>

          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 p-6 relative">
              {/* Mock portfolio preview */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 h-full overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{userData.name}</h2>
                    <p className="text-muted-foreground">{userData.title}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {userData.bio}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {userData.skills.slice(0, 6).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {userData.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{userData.skills.length - 6} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    {userData.github}
                  </div>
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4" />
                    {userData.linkedin}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </div>
                </div>
              </div>

              <div className="absolute top-2 right-2">
                <Badge className="bg-brand-500 text-white">
                  {template.name}
                </Badge>
              </div>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            This is a simplified preview. The actual template will include your
            full portfolio with projects, experience, and more detailed
            sections.
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back to Templates
        </Button>
        <Button
          onClick={handleNext}
          className="bg-brand-500 hover:bg-brand-600"
        >
          Create Portfolio
        </Button>
      </div>
    </div>
  );
}

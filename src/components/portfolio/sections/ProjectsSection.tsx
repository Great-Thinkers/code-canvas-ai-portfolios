
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import AIContentButton from "../AIContentButton";
import AIContentGeneratorDialog from "../AIContentGeneratorDialog";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

interface ProjectsSectionProps {
  data: { projects?: Project[] };
  onChange: (data: { projects: Project[] }) => void;
}

export default function ProjectsSection({ data, onChange }: ProjectsSectionProps) {
  const [aiDialogProject, setAiDialogProject] = useState<string | null>(null);
  const projects = data.projects || [];

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
    };
    onChange({ projects: [...projects, newProject] });
  };

  const removeProject = (id: string) => {
    onChange({ projects: projects.filter(p => p.id !== id) });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange({
      projects: projects.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const addTechnology = (projectId: string, tech: string) => {
    if (!tech.trim()) return;
    
    const project = projects.find(p => p.id === projectId);
    if (project && !project.technologies.includes(tech)) {
      updateProject(projectId, 'technologies', [...project.technologies, tech]);
    }
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProject(projectId, 'technologies', project.technologies.filter(t => t !== tech));
    }
  };

  const getProjectContext = (project: Project) => ({
    name: project.name,
    technologies: project.technologies,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    currentDescription: project.description,
  });

  const handleAIDescriptionGenerated = (projectId: string, content: string) => {
    updateProject(projectId, 'description', content);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Button onClick={addProject} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No projects added yet. Click "Add Project" to get started.
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Project {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Featured Project</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={project.featured || false}
                        onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Highlight this project</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Description</Label>
                    <div className="flex gap-2">
                      <AIContentButton
                        contentType="project"
                        context={getProjectContext(project)}
                        onContentGenerated={(content) => handleAIDescriptionGenerated(project.id, content)}
                        size="sm"
                      >
                        Generate Description
                      </AIContentButton>
                      <AIContentButton
                        contentType="project"
                        context={getProjectContext(project)}
                        onContentGenerated={() => setAiDialogProject(project.id)}
                        variant="ghost"
                        size="sm"
                      >
                        Advanced
                      </AIContentButton>
                    </div>
                  </div>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Describe your project, the technologies used, challenges solved, and its impact..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Live URL</Label>
                    <Input
                      value={project.liveUrl || ''}
                      onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                      placeholder="https://myproject.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                      value={project.githubUrl || ''}
                      onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Image URL</Label>
                  <Input
                    value={project.imageUrl || ''}
                    onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                    placeholder="https://example.com/project-screenshot.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTechnology(project.id, tech)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Type a technology and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTechnology(project.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {aiDialogProject && (
        <AIContentGeneratorDialog
          open={!!aiDialogProject}
          onOpenChange={() => setAiDialogProject(null)}
          contentType="project"
          context={getProjectContext(projects.find(p => p.id === aiDialogProject)!)}
          onAccept={(content) => handleAIDescriptionGenerated(aiDialogProject, content)}
          initialContent={projects.find(p => p.id === aiDialogProject)?.description}
        />
      )}
    </div>
  );
}

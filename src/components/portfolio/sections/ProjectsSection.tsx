import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit3, ExternalLink, Github } from "lucide-react";
import AIContentButton from "../AIContentButton";

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

interface ProjectsSectionProps {
  data: {
    projects?: Project[];
  };
  onChange: (data: any) => void;
}

export default function ProjectsSection({
  data,
  onChange,
}: ProjectsSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: "",
    name: "",
    description: "",
    technologies: [],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
  });
  const [newTech, setNewTech] = useState("");

  const handleAddProject = () => {
    const newProject = {
      ...currentProject,
      id: Date.now().toString(),
    };
    const updatedProjects = [...(data.projects || []), newProject];
    onChange({
      ...data,
      projects: updatedProjects,
    });
    resetCurrentProject();
  };

  const handleEditProject = (index: number) => {
    setEditingIndex(index);
    setCurrentProject(data.projects![index]);
  };

  const handleUpdateProject = () => {
    if (editingIndex !== null) {
      const updatedProjects = [...(data.projects || [])];
      updatedProjects[editingIndex] = currentProject;
      onChange({
        ...data,
        projects: updatedProjects,
      });
      setEditingIndex(null);
      resetCurrentProject();
    }
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = (data.projects || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      projects: updatedProjects,
    });
  };

  const resetCurrentProject = () => {
    setCurrentProject({
      id: "",
      name: "",
      description: "",
      technologies: [],
      liveUrl: "",
      githubUrl: "",
      imageUrl: "",
    });
  };

  const handleAddTechnology = () => {
    if (newTech.trim()) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, newTech.trim()],
      });
      setNewTech("");
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter(
        (tech) => tech !== techToRemove
      ),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Projects */}
        {(data.projects || []).map((project, index) => (
          <div key={project.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-muted text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {project.liveUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(project.liveUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(project.githubUrl, "_blank")}
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditProject(index)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProject(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
        ))}

        {/* Add/Edit Project Form */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
          <h4 className="font-medium">
            {editingIndex !== null ? "Edit Project" : "Add New Project"}
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={currentProject.name}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. E-commerce Platform"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <AIContentButton
                  contentType="project_description"
                  currentContent={currentProject.description}
                  onContentGenerated={(content) =>
                    setCurrentProject({
                      ...currentProject,
                      description: content,
                    })
                  }
                  size="sm"
                />
              </div>
              <Textarea
                value={currentProject.description}
                onChange={(e) =>
                  setCurrentProject({
                    ...currentProject,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your project..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input
                  value={currentProject.liveUrl}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      liveUrl: e.target.value,
                    })
                  }
                  placeholder="https://your-project.com"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={currentProject.githubUrl}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      githubUrl: e.target.value,
                    })
                  }
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology (e.g. React, Node.js)"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTechnology()}
                />
                <Button onClick={handleAddTechnology} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-xs rounded flex items-center gap-1"
                  >
                    {tech}
                    <button
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button
            onClick={
              editingIndex !== null ? handleUpdateProject : handleAddProject
            }
            disabled={!currentProject.name || !currentProject.description}
          >
            <Plus className="h-4 w-4 mr-2" />
            {editingIndex !== null ? "Update Project" : "Add Project"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

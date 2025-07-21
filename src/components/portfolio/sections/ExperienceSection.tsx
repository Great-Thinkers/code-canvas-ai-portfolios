import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit3 } from "lucide-react";
import AIContentGenerator from "../AIContentGenerator";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface ExperienceSectionProps {
  data: {
    experiences?: Experience[];
    experienceSummary?: string;
  };
  onChange: (data: {
    experiences?: Experience[];
    experienceSummary?: string;
  }) => void;
}

export default function ExperienceSection({
  data,
  onChange,
}: ExperienceSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: "",
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  const handleAddExperience = () => {
    const newExperience = {
      ...currentExperience,
      id: Date.now().toString(),
    };
    const updatedExperiences = [...(data.experiences || []), newExperience];
    onChange({
      ...data,
      experiences: updatedExperiences,
    });
    setCurrentExperience({
      id: "",
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
  };

  const handleEditExperience = (index: number) => {
    setEditingIndex(index);
    setCurrentExperience(data.experiences![index]);
  };

  const handleUpdateExperience = () => {
    if (editingIndex !== null) {
      const updatedExperiences = [...(data.experiences || [])];
      updatedExperiences[editingIndex] = currentExperience;
      onChange({
        ...data,
        experiences: updatedExperiences,
      });
      setEditingIndex(null);
      setCurrentExperience({
        id: "",
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = (data.experiences || []).filter(
      (_, i) => i !== index
    );
    onChange({
      ...data,
      experiences: updatedExperiences,
    });
  };

  const handleSummaryChange = (summary: string) => {
    onChange({
      ...data,
      experienceSummary: summary,
    });
  };

  return (
    <div className="space-y-6">
      {/* Experience Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <AIContentGenerator
            type="experience_summary"
            context={{
              experience: data.experiences,
            }}
            value={data.experienceSummary || ""}
            onChange={handleSummaryChange}
            placeholder="Summarize your professional experience..."
            label="Experience Summary"
          />
        </CardContent>
      </Card>

      {/* Experience List */}
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Experiences */}
          {(data.experiences || []).map((experience, index) => (
            <div key={experience.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{experience.title}</h3>
                  <p className="text-muted-foreground">{experience.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {experience.startDate} -{" "}
                    {experience.isCurrent ? "Present" : experience.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditExperience(index)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm">{experience.description}</p>
            </div>
          ))}

          {/* Add/Edit Experience Form */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <h4 className="font-medium">
              {editingIndex !== null ? "Edit Experience" : "Add New Experience"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={currentExperience.title}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={currentExperience.company}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      company: e.target.value,
                    })
                  }
                  placeholder="e.g. Tech Corp"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={currentExperience.startDate}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={currentExperience.endDate}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      endDate: e.target.value,
                    })
                  }
                  disabled={currentExperience.isCurrent}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={currentExperience.isCurrent}
                onCheckedChange={(checked) =>
                  setCurrentExperience({
                    ...currentExperience,
                    isCurrent: checked as boolean,
                  })
                }
              />
              <Label htmlFor="current">I currently work here</Label>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={currentExperience.description}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your role and achievements..."
                rows={3}
              />
            </div>
            <Button
              onClick={
                editingIndex !== null
                  ? handleUpdateExperience
                  : handleAddExperience
              }
              disabled={!currentExperience.title || !currentExperience.company}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null ? "Update Experience" : "Add Experience"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

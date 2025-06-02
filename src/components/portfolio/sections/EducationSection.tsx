import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit3 } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface EducationSectionProps {
  data: {
    education?: Education[];
  };
  onChange: (data: any) => void;
}

export default function EducationSection({
  data,
  onChange,
}: EducationSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    id: "",
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleAddEducation = () => {
    const newEducation = {
      ...currentEducation,
      id: Date.now().toString(),
    };
    const updatedEducation = [...(data.education || []), newEducation];
    onChange({
      ...data,
      education: updatedEducation,
    });
    resetCurrentEducation();
  };

  const handleEditEducation = (index: number) => {
    setEditingIndex(index);
    setCurrentEducation(data.education![index]);
  };

  const handleUpdateEducation = () => {
    if (editingIndex !== null) {
      const updatedEducation = [...(data.education || [])];
      updatedEducation[editingIndex] = currentEducation;
      onChange({
        ...data,
        education: updatedEducation,
      });
      setEditingIndex(null);
      resetCurrentEducation();
    }
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = (data.education || []).filter(
      (_, i) => i !== index
    );
    onChange({
      ...data,
      education: updatedEducation,
    });
  };

  const resetCurrentEducation = () => {
    setCurrentEducation({
      id: "",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Education */}
        {(data.education || []).map((education, index) => (
          <div key={education.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">
                  {education.degree} in {education.fieldOfStudy}
                </h3>
                <p className="text-muted-foreground">{education.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {education.startDate} - {education.endDate}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditEducation(index)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEducation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {education.description && (
              <p className="text-sm">{education.description}</p>
            )}
          </div>
        ))}

        {/* Add/Edit Education Form */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
          <h4 className="font-medium">
            {editingIndex !== null ? "Edit Education" : "Add Education"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input
                value={currentEducation.institution}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    institution: e.target.value,
                  })
                }
                placeholder="e.g. University of Technology"
              />
            </div>
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input
                value={currentEducation.degree}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    degree: e.target.value,
                  })
                }
                placeholder="e.g. Bachelor of Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                value={currentEducation.fieldOfStudy}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <Input
                type="number"
                value={currentEducation.endDate}
                onChange={(e) =>
                  setCurrentEducation({
                    ...currentEducation,
                    endDate: e.target.value,
                  })
                }
                placeholder="2024"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea
              value={currentEducation.description}
              onChange={(e) =>
                setCurrentEducation({
                  ...currentEducation,
                  description: e.target.value,
                })
              }
              placeholder="Additional details about your education..."
              rows={2}
            />
          </div>
          <Button
            onClick={
              editingIndex !== null ? handleUpdateEducation : handleAddEducation
            }
            disabled={
              !currentEducation.institution ||
              !currentEducation.degree ||
              !currentEducation.fieldOfStudy
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            {editingIndex !== null ? "Update Education" : "Add Education"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

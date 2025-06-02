
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import AIContentGenerator from "../AIContentGenerator";

interface SkillsSectionProps {
  data: {
    skills?: string[];
    skillSummary?: string;
  };
  onChange: (data: any) => void;
}

export default function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...(data.skills || []), newSkill.trim()];
      onChange({
        ...data,
        skills: updatedSkills,
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = (data.skills || []).filter(
      (skill) => skill !== skillToRemove
    );
    onChange({
      ...data,
      skills: updatedSkills,
    });
  };

  const handleSummaryChange = (summary: string) => {
    onChange({
      ...data,
      skillSummary: summary,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill (e.g. React, Python, AWS)"
              onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            />
            <Button onClick={handleAddSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(data.skills || []).map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <AIContentGenerator
            type="skill_summary"
            context={{
              skills: data.skills,
            }}
            value={data.skillSummary || ""}
            onChange={handleSummaryChange}
            placeholder="Describe your technical expertise and skill set..."
            label="Skills Summary"
          />
        </CardContent>
      </Card>
    </div>
  );
}

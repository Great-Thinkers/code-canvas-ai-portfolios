
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AIContentGenerator from "../AIContentGenerator";

interface PersonalInfoSectionProps {
  data: {
    name?: string;
    title?: string;
    bio?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  onChange: (data: any) => void;
}

export default function PersonalInfoSection({
  data,
  onChange,
}: PersonalInfoSectionProps) {
  const handleFieldChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={data.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={data.title || ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="e.g. Full Stack Developer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email || ""}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.phone || ""}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.location || ""}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="City, State, Country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <AIContentGenerator
            type="bio"
            context={{
              name: data.name,
              title: data.title,
            }}
            value={data.bio || ""}
            onChange={(value) => handleFieldChange("bio", value)}
            placeholder="Tell your professional story..."
            label="Bio"
          />
        </CardContent>
      </Card>
    </div>
  );
}

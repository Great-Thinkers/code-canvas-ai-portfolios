
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AIContentButton from "../AIContentButton";
import AIContentGeneratorDialog from "../AIContentGeneratorDialog";

interface PersonalInfoData {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  bio?: string;
  avatar?: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const [showAIDialog, setShowAIDialog] = useState(false);

  const updateField = (field: keyof PersonalInfoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAIBioGenerated = (content: string) => {
    updateField('bio', content);
  };

  const getBioContext = () => ({
    fullName: data.fullName,
    title: data.title,
    location: data.location,
    website: data.website,
    // Add any other relevant context for bio generation
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={data.fullName || ''}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={data.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Full Stack Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={data.website || ''}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://johndoe.dev"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={data.avatar || ''}
              onChange={(e) => updateField('avatar', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Bio</Label>
              <div className="flex gap-2">
                <AIContentButton
                  contentType="bio"
                  context={getBioContext()}
                  onContentGenerated={handleAIBioGenerated}
                  size="sm"
                >
                  Generate Bio
                </AIContentButton>
                <AIContentButton
                  contentType="bio"
                  context={getBioContext()}
                  onContentGenerated={() => setShowAIDialog(true)}
                  variant="ghost"
                  size="sm"
                >
                  Advanced
                </AIContentButton>
              </div>
            </div>
            <Textarea
              id="bio"
              value={data.bio || ''}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell us about yourself, your passion for development, and what makes you unique..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <AIContentGeneratorDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        contentType="bio"
        context={getBioContext()}
        onAccept={handleAIBioGenerated}
        initialContent={data.bio}
      />
    </div>
  );
}


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Globe, Mail } from "lucide-react";

interface SocialLinksSectionProps {
  data: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
  onChange: (data: any) => void;
}

const socialLinks = [
  {
    key: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
  },
  {
    key: "website",
    label: "Personal Website",
    icon: Globe,
    placeholder: "https://yourwebsite.com",
  },
  {
    key: "email",
    label: "Email",
    icon: Mail,
    placeholder: "your.email@example.com",
  },
];

export default function SocialLinksSection({
  data,
  onChange,
}: SocialLinksSectionProps) {
  const handleFieldChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links & Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <div key={link.key} className="space-y-2">
              <Label htmlFor={link.key} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {link.label}
              </Label>
              <Input
                id={link.key}
                value={data[link.key as keyof typeof data] || ""}
                onChange={(e) => handleFieldChange(link.key, e.target.value)}
                placeholder={link.placeholder}
                type={link.key === "email" ? "email" : "url"}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Experience {
  title: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location?: string;
  description?: string;
}

interface LinkedInExperienceCardProps {
  experiences: Experience[];
}

export default function LinkedInExperienceCard({ experiences }: LinkedInExperienceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Experience</CardTitle>
        <CardDescription>Your latest professional roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {experiences.slice(0, 3).map((exp, index) => (
            <div key={index} className="border-l-2 border-muted pl-4">
              <div className="space-y-1">
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                <p className="text-xs text-muted-foreground">
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  {exp.location && ` • ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {exp.description.length > 100 
                      ? `${exp.description.substring(0, 100)}...`
                      : exp.description
                    }
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

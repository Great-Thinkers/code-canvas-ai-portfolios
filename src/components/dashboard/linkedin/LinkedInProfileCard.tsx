
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LinkedInData {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  profilePictureUrl?: string;
  location: string;
  industry: string;
}

interface LinkedInProfileCardProps {
  linkedInData: LinkedInData;
}

export default function LinkedInProfileCard({ linkedInData }: LinkedInProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Profile</CardTitle>
        <CardDescription>Your LinkedIn profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {linkedInData.profilePictureUrl && (
            <img
              src={linkedInData.profilePictureUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <h3 className="font-medium">
              {linkedInData.firstName} {linkedInData.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {linkedInData.headline}
            </p>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Location: </span>
          {linkedInData.location}
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Industry: </span>
          {linkedInData.industry}
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Summary: </span>
          <p className="mt-1 text-muted-foreground">
            {linkedInData.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

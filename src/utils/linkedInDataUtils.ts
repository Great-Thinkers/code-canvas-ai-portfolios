
interface LinkedInProfile {
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  summary: string | null;
  profile_picture_url: string | null;
  location: string | null;
  industry: string | null;
}

interface LinkedInData {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  profilePictureUrl?: string;
  location: string;
  industry: string;
}

export const createLinkedInDemoData = (profile: LinkedInProfile | null): LinkedInData => {
  return {
    firstName: profile?.first_name || "Demo",
    lastName: profile?.last_name || "User",
    headline: profile?.headline || "Software Developer at Demo Company",
    summary: profile?.summary || "Experienced developer with expertise in web technologies, passionate about creating innovative solutions and driving digital transformation.",
    profilePictureUrl: profile?.profile_picture_url || undefined,
    location: profile?.location || "San Francisco, CA",
    industry: profile?.industry || "Information Technology",
  };
};

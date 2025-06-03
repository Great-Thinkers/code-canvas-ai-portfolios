import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LinkedInProfile {
  id: string;
  firstName: {
    localized: { [key: string]: string };
  };
  lastName: {
    localized: { [key: string]: string };
  };
  headline: {
    localized: { [key: string]: string };
  };
  profilePicture?: {
    displayImage: string;
  };
}

interface LinkedInUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: {
    country: string;
    language: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Get LinkedIn profile from database
    const { data: linkedinProfileRecord, error: profileError } = await supabase
      .from("linkedin_profiles")
      .select("access_token")
      .eq("user_id", user_id)
      .single();

    if (profileError || !linkedinProfileRecord?.access_token) {
      throw new Error("LinkedIn profile not found or access token missing");
    }

    const accessToken = linkedinProfileRecord.access_token;
    let apiMessage = "LinkedIn sync timestamp updated.";
    const updateData: { [key: string]: any } = {
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      console.log(`Fetching LinkedIn user info for user ${user_id}`);
      const userInfoResponse = await fetch(
        "https://api.linkedin.com/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "DevPortfolio-Generator/1.0",
          },
        },
      );

      if (userInfoResponse.ok) {
        const userInfo: LinkedInUserInfo = await userInfoResponse.json();

        if (userInfo.sub) {
          updateData.linkedin_user_id = userInfo.sub;
        }
        if (userInfo.given_name) {
          updateData.first_name = userInfo.given_name;
        }
        if (userInfo.family_name) {
          updateData.last_name = userInfo.family_name;
        }
        if (userInfo.picture) {
          updateData.profile_picture_url = userInfo.picture;
        }
        // Add other fields as necessary, e.g., email if your table has it
        // if (userInfo.email) {
        //   updateData.email = userInfo.email;
        // }

        apiMessage = "LinkedIn basic profile data synced.";
        console.log(`Successfully fetched and processed LinkedIn user info for user ${user_id}`);
      } else {
        const errorBody = await userInfoResponse.text();
        console.error(
          `Failed to fetch LinkedIn user info for user ${user_id}. Status: ${userInfoResponse.status}, Body: ${errorBody}`,
        );
        apiMessage =
          `LinkedIn UserInfo API request failed with status ${userInfoResponse.status}. Timestamp updated.`;
      }
    } catch (apiError) {
      console.error(`Error during LinkedIn API call for user ${user_id}:`, apiError);
      apiMessage =
        `Error calling LinkedIn API: ${apiError.message}. Timestamp updated.`;
    }

    const { error: updateError } = await supabase
      .from("linkedin_profiles")
      .update(updateData)
      .eq("user_id", user_id);

    if (updateError) {
      // Log this error but don't necessarily overwrite the apiMessage
      // if the API call itself was the primary issue.
      console.error(`Error updating Supabase for user ${user_id}:`, updateError);
      throw new Error(`Failed to update LinkedIn profile in database: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${apiMessage} Full API integration requires further permissions.`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in LinkedIn sync function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to sync LinkedIn data",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});

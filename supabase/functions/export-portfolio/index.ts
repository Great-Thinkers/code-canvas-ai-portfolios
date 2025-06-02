
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import React from "https://esm.sh/react@18.2.0";
import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";
import * as fflate from "https://esm.sh/fflate@0.8.0"; // ZIP library
import ModernMinimalTemplate from "./ModernMinimalTemplate.tsx"; // Ensure this path is correct

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  exportId: string;
  portfolioId: string;
  exportType: 'zip' | 'github-pages' | 'netlify';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { exportId, portfolioId, exportType }: ExportRequest = await req.json();

    console.log(`Starting export process for portfolio ${portfolioId}, export ${exportId}, type ${exportType}`);

    // Update export status to processing
    await supabaseClient
      .from('portfolio_exports')
      .update({ status: 'processing' })
      .eq('id', exportId);

    // Get portfolio data
    const { data: portfolio, error: portfolioError } = await supabaseClient
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();

    if (portfolioError) {
      console.error('Error fetching portfolio:', portfolioError);
      await supabaseClient
        .from('portfolio_exports')
        .update({ 
          status: 'failed',
          error_message: 'Failed to fetch portfolio data'
        })
        .eq('id', exportId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to fetch portfolio' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate the portfolio HTML/CSS/JS
    // Generate the portfolio HTML
    const portfolioHtml = generatePortfolioHtml(portfolio);

    if (exportType === 'zip') {
      try {
        // 1. Fetch Tailwind CSS content
        const cssResponse = await fetch("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
        if (!cssResponse.ok) {
          throw new Error(`Failed to fetch Tailwind CSS: ${cssResponse.statusText}`);
        }
        const cssContent = await cssResponse.text();

        // 2. Create ZIP archive
        const zipData: { [key: string]: Uint8Array } = {};
        zipData["index.html"] = new TextEncoder().encode(portfolioHtml);
        zipData["style.css"] = new TextEncoder().encode(cssContent);
        
        const zipBlob = new Blob([fflate.zipSync(zipData)], { type: "application/zip" });

        // 3. Upload to Supabase Storage
        const filePath = `portfolio-${portfolioId}-${exportId}.zip`;
        const { data: uploadData, error: uploadError } = await supabaseClient
          .storage
          .from('portfolio-exports') // Ensure this bucket exists
          .upload(filePath, zipBlob, {
            contentType: 'application/zip',
            upsert: true // Overwrite if file already exists for this exportId
          });

        if (uploadError) {
          console.error('Error uploading ZIP to storage:', uploadError);
          throw new Error(`Failed to upload ZIP: ${uploadError.message}`);
        }
        
        // Construct the public URL. Assumes bucket is public or using a known URL structure.
        // For non-public buckets, you'd generate a signed URL here.
        const { data: { publicUrl } } = supabaseClient
          .storage
          .from('portfolio-exports')
          .getPublicUrl(filePath);

        if (!publicUrl) {
            throw new Error('Failed to get public URL for ZIP file.');
        }
        const downloadUrl = publicUrl;

        // 4. Update database records
        await supabaseClient
          .from('portfolio_exports')
          .update({
            status: 'completed',
            download_url: downloadUrl,
            error_message: null,
          })
          .eq('id', exportId);

        await supabaseClient
          .from('portfolios')
          .update({
            export_status: 'completed',
            export_url: downloadUrl,
            last_exported_at: new Date().toISOString(),
          })
          .eq('id', portfolioId);
        
        console.log(`Portfolio ZIP created and uploaded successfully: ${downloadUrl}`);
        return new Response(
          JSON.stringify({ success: true, downloadUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (zipError) {
        console.error('Error during ZIP export process:', zipError);
        await supabaseClient
          .from('portfolio_exports')
          .update({
            status: 'failed',
            error_message: zipError.message,
          })
          .eq('id', exportId);
        return new Response(
          JSON.stringify({ error: 'ZIP export failed', message: zipError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Handle other export types (premium features)
      const errorMessage = 'This export type is not yet fully implemented.';
       await supabaseClient
        .from('portfolio_exports')
        .update({ status: 'failed', error_message: errorMessage })
        .eq('id', exportId);
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    // Catch errors from initial setup (supabaseClient, req.json, initial DB updates)
    console.error('Overall error in export function:', error);
    // Attempt to update export status to failed if exportId is available
    // This part might be tricky if req.json() itself failed.
    // Consider how to get exportId reliably if the primary try block for req.json() fails.
    // For now, we assume exportId might not be available here if req.json() failed.
    // A more robust solution would handle this by parsing req body in a separate try-catch.
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generatePortfolioHtml(portfolio: any): string {
  const { name, portfolio_data, customization } = portfolio;
  const templateId = portfolio_data?.template || 'modern-minimal'; // Default or from data

  // For now, we assume ModernMinimalTemplate is the one to use.
  // A more dynamic approach would select the template based on `templateId` or `template_name`.
  const renderedComponent = ReactDOMServer.renderToStaticMarkup(
    React.createElement(ModernMinimalTemplate, {
      portfolioData: portfolio_data || {},
      customization: customization || portfolio_data?.customization || {},
      // template prop is not used by the adapted ModernMinimalTemplate directly
    })
  );

  // Construct CSS variables from customization if available
  let cssVariablesStyle = "";
  if (portfolio_data?.customization?.colors) {
    cssVariablesStyle += "<style>\n:root {\n";
    for (const [key, value] of Object.entries(portfolio_data.customization.colors)) {
      cssVariablesStyle += `  --template-${key}: ${value};\n`;
    }
    // Add other theme vars like font family, weights, max-width etc.
    if (portfolio_data.customization.font) {
       cssVariablesStyle += `  --template-font-family: "${portfolio_data.customization.font.family}";\n`;
       cssVariablesStyle += `  --template-heading-weight: ${portfolio_data.customization.font.headingWeight || '700'};\n`;
       cssVariablesStyle += `  --template-body-weight: ${portfolio_data.customization.font.bodyWeight || '400'};\n`;
    }
     if (portfolio_data.customization.layout) {
        cssVariablesStyle += `  --template-max-width: ${portfolio_data.customization.layout.maxWidth || '1200px'};\n`;
     }

    cssVariablesStyle += "}\n</style>\n";
  }


  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name || 'Portfolio'}</title>
  <link rel="stylesheet" href="style.css">
  ${cssVariablesStyle}
  <!-- Add any other global styles or font links here -->
</head>
<body>
  ${renderedComponent}
</body>
</html>`;
}


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const portfolioHtml = generatePortfolioHtml(portfolio);
    
    let downloadUrl = '';
    let errorMessage = '';
    
    try {
      if (exportType === 'zip') {
        // For now, we'll simulate the ZIP creation process
        // In a real implementation, you would:
        // 1. Generate all HTML/CSS/JS files
        // 2. Create a ZIP archive
        // 3. Upload to storage
        // 4. Return the download URL
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        downloadUrl = `https://example.com/downloads/portfolio-${portfolioId}.zip`;
        
        console.log(`Generated ZIP download URL: ${downloadUrl}`);
      } else {
        // Premium features (GitHub Pages, Netlify) would be implemented here
        errorMessage = 'Premium export features are not yet implemented';
        throw new Error(errorMessage);
      }

      // Update export record with success
      await supabaseClient
        .from('portfolio_exports')
        .update({ 
          status: 'completed',
          download_url: downloadUrl
        })
        .eq('id', exportId);

      // Update portfolio export status
      await supabaseClient
        .from('portfolios')
        .update({
          export_status: 'completed',
          export_url: downloadUrl,
          last_exported_at: new Date().toISOString()
        })
        .eq('id', portfolioId);

      console.log(`Export completed successfully for portfolio ${portfolioId}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          downloadUrl,
          message: 'Portfolio exported successfully'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('Export processing error:', error);
      
      await supabaseClient
        .from('portfolio_exports')
        .update({ 
          status: 'failed',
          error_message: errorMessage || error.message
        })
        .eq('id', exportId);

      await supabaseClient
        .from('portfolios')
        .update({
          export_status: 'failed'
        })
        .eq('id', portfolioId);

      return new Response(
        JSON.stringify({ 
          error: 'Export failed',
          message: errorMessage || error.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
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
  // This is a simplified HTML generation
  // In a real implementation, you would use the template system
  // and portfolio data to generate a complete static site
  
  const { name, portfolio_data, template_name } = portfolio;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 40px 20px;
      background: #fafafa;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #2563eb; margin-bottom: 10px; }
    .template-info { color: #666; margin-bottom: 30px; }
    .section { margin-bottom: 30px; }
    .section h2 { border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${name}</h1>
    <div class="template-info">Template: ${template_name}</div>
    
    <div class="section">
      <h2>About</h2>
      <p>This is a generated portfolio created with the Dev Portfolio Generator.</p>
    </div>
    
    <div class="section">
      <h2>Portfolio Data</h2>
      <pre>${JSON.stringify(portfolio_data, null, 2)}</pre>
    </div>
  </div>
</body>
</html>`;
}

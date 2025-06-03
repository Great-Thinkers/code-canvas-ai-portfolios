
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type ExportType = 'zip' | 'github-pages' | 'netlify';

interface ExportStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  errorMessage?: string;
}

export function usePortfolioExport() {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus | null>(null);

  const startExport = async (portfolioId: string, exportType: ExportType = 'zip') => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      // Create export record with user_id
      const { data: exportRecord, error: createError } = await supabase
        .from('portfolio_exports')
        .insert({
          portfolio_id: portfolioId,
          export_type: exportType,
          status: 'pending',
          user_id: user.id,
        })
        .select('id')
        .single();

      if (createError) {
        throw new Error('Failed to create export record');
      }

      setExportStatus({
        id: exportRecord.id,
        status: 'pending',
      });

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('export-portfolio', {
        body: {
          exportId: exportRecord.id,
          portfolioId,
          exportType,
        },
      });

      if (error) {
        throw new Error(error.message || 'Export failed');
      }

      // Poll for status updates
      pollExportStatus(exportRecord.id);

    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to start export');
      setIsExporting(false);
      setExportStatus({
        id: '',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const pollExportStatus = async (exportId: string) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_exports')
          .select('status, download_url, error_message')
          .eq('id', exportId)
          .single();

        if (error) {
          throw new Error('Failed to check export status');
        }

        setExportStatus({
          id: exportId,
          status: data.status as ExportStatus['status'],
          downloadUrl: data.download_url || undefined,
          errorMessage: data.error_message || undefined,
        });

        if (data.status === 'completed') {
          setIsExporting(false);
          toast.success('Export completed successfully!');
          return;
        }

        if (data.status === 'failed') {
          setIsExporting(false);
          toast.error(`Export failed: ${data.error_message || 'Unknown error'}`);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setIsExporting(false);
          toast.error('Export timeout - please try again');
          setExportStatus({
            id: exportId,
            status: 'failed',
            errorMessage: 'Export timeout',
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
        setIsExporting(false);
        toast.error('Failed to check export status');
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 5000);
  };

  const downloadExport = (downloadUrl: string, portfolioName: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${portfolioName}-portfolio.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    isExporting,
    exportStatus,
    startExport,
    downloadExport,
  };
}


import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Github, 
  Globe, 
  Loader2, 
  CheckCircle, 
  XCircle,
  FileArchive,
  ExternalLink 
} from 'lucide-react';
import { usePortfolioExport, ExportType } from '@/hooks/usePortfolioExport';

interface PortfolioExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId: string;
  portfolioName: string;
}

const exportOptions = [
  {
    type: 'zip' as ExportType,
    title: 'Download ZIP',
    description: 'Download your portfolio as a ZIP file with HTML, CSS, and assets',
    icon: FileArchive,
    isPremium: false,
    features: ['Static HTML/CSS files', 'Offline viewing', 'Easy hosting'],
  },
  {
    type: 'github-pages' as ExportType,
    title: 'GitHub Pages',
    description: 'Deploy directly to GitHub Pages for free hosting',
    icon: Github,
    isPremium: true,
    features: ['Automatic deployment', 'Custom domain support', 'GitHub integration'],
  },
  {
    type: 'netlify' as ExportType,
    title: 'Netlify Deploy',
    description: 'Deploy to Netlify with continuous deployment',
    icon: Globe,
    isPremium: true,
    features: ['CDN hosting', 'Form handling', 'Analytics'],
  },
];

export default function PortfolioExportDialog({
  open,
  onOpenChange,
  portfolioId,
  portfolioName,
}: PortfolioExportDialogProps) {
  const [selectedExportType, setSelectedExportType] = useState<ExportType>('zip');
  const { isExporting, exportStatus, startExport, downloadExport } = usePortfolioExport();

  const handleExport = async () => {
    await startExport(portfolioId, selectedExportType);
  };

  const handleDownload = () => {
    if (exportStatus?.downloadUrl) {
      downloadExport(exportStatus.downloadUrl, portfolioName);
    }
  };

  const getStatusIcon = () => {
    if (!exportStatus) return null;
    
    switch (exportStatus.status) {
      case 'pending':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (!exportStatus) return '';
    
    switch (exportStatus.status) {
      case 'pending':
        return 'Preparing export...';
      case 'processing':
        return 'Generating portfolio files...';
      case 'completed':
        return 'Export completed successfully!';
      case 'failed':
        return `Export failed: ${exportStatus.errorMessage || 'Unknown error'}`;
      default:
        return '';
    }
  };

  const getProgressValue = () => {
    if (!exportStatus) return 0;
    
    switch (exportStatus.status) {
      case 'pending':
        return 25;
      case 'processing':
        return 75;
      case 'completed':
        return 100;
      case 'failed':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Portfolio</DialogTitle>
          <DialogDescription>
            Choose how you'd like to export "{portfolioName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          {!isExporting && !exportStatus && (
            <div className="grid grid-cols-1 gap-4">
              {exportOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedExportType === option.type;
                
                return (
                  <Card
                    key={option.type}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    } ${option.isPremium ? 'opacity-75' : ''}`}
                    onClick={() => !option.isPremium && setSelectedExportType(option.type)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5" />
                          <CardTitle className="text-base">{option.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          {option.isPremium && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                              Premium
                            </Badge>
                          )}
                          {isSelected && !option.isPremium && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {option.isPremium && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Available with Pro subscription
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Export Progress */}
          {(isExporting || exportStatus) && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <span className="font-medium">{getStatusText()}</span>
                  </div>
                  
                  {exportStatus?.status !== 'failed' && (
                    <Progress value={getProgressValue()} className="h-2" />
                  )}

                  {exportStatus?.status === 'completed' && exportStatus.downloadUrl && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleDownload} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Portfolio
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(exportStatus.downloadUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {exportStatus?.status === 'failed' && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleExport} variant="outline" className="flex-1">
                        Try Again
                      </Button>
                      <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {!isExporting && !exportStatus && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleExport}
                disabled={exportOptions.find(opt => opt.type === selectedExportType)?.isPremium}
              >
                <Download className="h-4 w-4 mr-2" />
                Start Export
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

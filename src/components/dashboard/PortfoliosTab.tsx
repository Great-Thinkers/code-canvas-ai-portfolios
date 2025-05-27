
import { Link } from 'react-router-dom';
import PortfolioCard from '@/components/dashboard/PortfolioCard';

// Sample data - in a real app this would come from your backend
const samplePortfolios = [
  {
    id: '1',
    name: 'My Professional Portfolio',
    template: 'Modern Minimal',
    lastUpdated: '2 days ago',
    isPublished: true,
    previewUrl: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Side Project Showcase',
    template: 'Tech Stack',
    lastUpdated: '1 week ago',
    isPublished: false,
    previewUrl: '/placeholder.svg',
  },
];

export default function PortfoliosTab() {
  return (
    <div className="mt-6">
      {samplePortfolios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePortfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} {...portfolio} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first portfolio to get started
          </p>
        </div>
      )}
    </div>
  );
}

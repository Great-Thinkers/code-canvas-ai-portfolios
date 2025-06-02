
import { BaseTemplateProps } from './BaseTemplate';
import BaseTemplate from './BaseTemplate';

export default function TechModernTemplate({
  portfolioData,
  template,
  customization,
}: BaseTemplateProps) {
  return (
    <BaseTemplate portfolioData={portfolioData} template={template} customization={customization}>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--template-primary)' }}>
          Tech Modern Template
        </h1>
        <p style={{ color: 'var(--template-text-secondary)' }}>
          This template is under development. Coming soon!
        </p>
      </div>
    </BaseTemplate>
  );
}

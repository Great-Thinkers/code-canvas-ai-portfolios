import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Settings } from "lucide-react";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import EducationSection from "./sections/EducationSection";
import SocialLinksSection from "./sections/SocialLinksSection";
import TemplateSelector from "./TemplateSelector";
import ThemeCustomizer from "./ThemeCustomizer";
import TemplatePreviewModal from "./TemplatePreviewModal";
import { getTemplateById } from "@/data/templates";
import {
  TemplateTheme,
  TemplateCustomization,
  PortfolioData,
} from "@/types/templates";

interface PortfolioEditorSectionsProps {
  portfolioData: PortfolioData;
  onChange: (data: PortfolioData) => void;
  templateName: string;
}

const contentSections = [
  {
    id: "personal",
    label: "Personal Info",
    component: PersonalInfoSection,
  },
  {
    id: "skills",
    label: "Skills",
    component: SkillsSection,
  },
  {
    id: "experience",
    label: "Experience",
    component: ExperienceSection,
  },
  {
    id: "projects",
    label: "Projects",
    component: ProjectsSection,
  },
  {
    id: "education",
    label: "Education",
    component: EducationSection,
  },
  {
    id: "social",
    label: "Social Links",
    component: SocialLinksSection,
  },
];

export default function PortfolioEditorSections({
  portfolioData,
  onChange,
  templateName,
}: PortfolioEditorSectionsProps) {
  const [activeSection, setActiveSection] = useState("content");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateTheme | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [orderedSections, setOrderedSections] = useState(contentSections);

  useEffect(() => {
    if (portfolioData.sectionOrder) {
      const newOrderedSections = portfolioData.sectionOrder
        .map((id: string) =>
          contentSections.find((section) => section.id === id)
        )
        .filter(
          (section): section is (typeof contentSections)[0] =>
            section !== undefined
        );
      // Add any missing sections from contentSections
      contentSections.forEach((section) => {
        if (!newOrderedSections.find((s) => s.id === section.id)) {
          newOrderedSections.push(section);
        }
      });
      setOrderedSections(newOrderedSections);
    } else {
      // Initialize sectionOrder if not present
      onChange({
        ...portfolioData,
        sectionOrder: contentSections.map((s) => s.id),
      });
      setOrderedSections(contentSections);
    }
  }, [portfolioData, onChange]);

  const currentTemplateId = portfolioData.template || templateName;
  const currentTemplate =
    getTemplateById(currentTemplateId) || getTemplateById("modern-minimal")!;
  const customization: TemplateCustomization = portfolioData.customization || {
    templateId: currentTemplate.id,
  };

  const handleSectionChange = (
    sectionId: string,
    sectionData: Partial<PortfolioData>
  ) => {
    onChange({
      ...portfolioData,
      [sectionId]: sectionData,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedSections(items);
    onChange({
      ...portfolioData,
      sectionOrder: items.map((section) => section.id),
    });
  };

  const handleTemplateSelect = (template: TemplateTheme) => {
    onChange({
      template: template.id,
      customization: {
        templateId: template.id,
      },
    });
  };

  const handleCustomizationChange = (
    newCustomization: TemplateCustomization
  ) => {
    onChange({
      customization: newCustomization,
    });
  };

  const handleResetCustomization = () => {
    onChange({
      customization: {
        templateId: currentTemplate.id,
      },
    });
  };

  const handleTemplatePreview = (template: TemplateTheme) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Current Template:
          </span>
          <Badge variant="outline">{currentTemplate.name}</Badge>
          {currentTemplate.isPremium && (
            <Badge className="bg-amber-500 text-white text-xs">Premium</Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSection("template")}
        >
          <Palette className="h-4 w-4 mr-2" />
          Change Template
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="customize">
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Tabs
              value={orderedSections[0]?.id || "personal"}
              onValueChange={() => {}}
            >
              <Droppable droppableId="sections" direction="horizontal">
                {(provided) => (
                  <TabsList
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-6 w-full"
                  >
                    {orderedSections.map((section, index) => (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided) => (
                          <TabsTrigger
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            value={section.id}
                            className="text-xs"
                          >
                            {section.label}
                          </TabsTrigger>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TabsList>
                )}
              </Droppable>

              {orderedSections.map((section) => {
                const SectionComponent = section.component;
                return (
                  <TabsContent
                    key={section.id}
                    value={section.id}
                    className="mt-6"
                  >
                    <SectionComponent
                      data={
                        portfolioData[section.id as keyof PortfolioData] || {}
                      }
                      onChange={(data: Partial<PortfolioData>) =>
                        handleSectionChange(section.id, data)
                      }
                    />
                  </TabsContent>
                );
              })}
            </Tabs>
          </DragDropContext>
        </TabsContent>

        {/* Template Tab */}
        <TabsContent value="template" className="mt-6">
          <TemplateSelector
            selectedTemplateId={currentTemplate.id}
            onTemplateSelect={handleTemplateSelect}
            onPreview={handleTemplatePreview}
          />
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize" className="mt-6">
          <ThemeCustomizer
            template={currentTemplate}
            customization={customization}
            onChange={handleCustomizationChange}
            onReset={handleResetCustomization}
          />
        </TabsContent>
      </Tabs>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        open={showPreview}
        onOpenChange={setShowPreview}
        onSelect={handleTemplateSelect}
        isSelected={previewTemplate?.id === currentTemplate.id}
      />
    </div>
  );
}

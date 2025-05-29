import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft, ArrowRight, Crown } from "lucide-react";
import EnhancedTemplateCustomization from "@/components/portfolio/EnhancedTemplateCustomization";

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  role: string;
  style: string[];
  features: string[];
  tags: string[];
  previewUrl: string;
  isPremium?: boolean;
}

interface UserData {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  title: string;
  bio: string;
  skills: string[];
  projects: number;
}

interface TemplateSelectionFlowProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (template: Template, userData: UserData) => void;
}

type FlowStep = "preview" | "customize" | "confirm";

export default function TemplateSelectionFlow({
  template,
  isOpen,
  onClose,
  onComplete,
}: TemplateSelectionFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("preview");
  const [userData, setUserData] = useState<UserData | null>(null);

  if (!template) return null;

  const steps = [
    {
      id: "preview",
      label: "Preview Template",
      completed: currentStep !== "preview",
    },
    {
      id: "customize",
      label: "Customize Data",
      completed: currentStep === "confirm",
    },
    { id: "confirm", label: "Create Portfolio", completed: false },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep === "preview") {
      setCurrentStep("customize");
    } else if (currentStep === "customize" && userData) {
      setCurrentStep("confirm");
    }
  };

  const handleBack = () => {
    if (currentStep === "customize") {
      setCurrentStep("preview");
    } else if (currentStep === "confirm") {
      setCurrentStep("customize");
    }
  };

  const handleCustomizationNext = (data: UserData) => {
    setUserData(data);
    setCurrentStep("confirm");
  };

  const handleComplete = () => {
    if (userData) {
      onComplete(template, userData);
      onClose();
      // Reset state
      setCurrentStep("preview");
      setUserData(null);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "preview":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold mb-2">
                {template.name} Template
              </h2>
              <p className="text-muted-foreground">
                Perfect for {template.role.replace("-", " ")} developers
              </p>
            </div>

            <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
              <img
                src={template.previewUrl}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Style</h4>
                <div className="flex flex-wrap gap-2">
                  {template.style.map((style) => (
                    <Badge key={style} variant="outline" className="capitalize">
                      {style.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {template.features.slice(0, 3).map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="capitalize"
                    >
                      {feature.replace("-", " ")}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge variant="outline">
                      +{template.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Category</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{template.category}</Badge>
                  {template.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>
          </div>
        );

      case "customize":
        return (
          <EnhancedTemplateCustomization
            template={template}
            onNext={handleCustomizationNext}
            onBack={handleBack}
          />
        );

      case "confirm":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">
                Ready to Create Your Portfolio!
              </h2>
              <p className="text-muted-foreground">
                Your portfolio will be created with the {template.name} template
                and your custom data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Template Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template:</span>
                    <span>{template.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="capitalize">
                      {template.role.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{template.isPremium ? "Premium" : "Free"}</span>
                  </div>
                </div>
              </div>

              {userData && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Your Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{userData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span>{userData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skills:</span>
                      <span>{userData.skills.length} skills</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GitHub:</span>
                      <span>@{userData.github}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>What happens next?</strong> We'll create your portfolio
                with this template and data. You can always customize it further
                after creation.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Progress Header */}
        <div className="space-y-4 pb-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Create Portfolio</h1>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : index === currentStepIndex
                        ? "bg-brand-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }
                `}
                >
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="py-6">{renderStepContent()}</div>

        {/* Footer Actions */}
        {currentStep !== "customize" && (
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === "preview"}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep === "confirm" ? (
              <Button
                onClick={handleComplete}
                className="bg-brand-500 hover:bg-brand-600"
              >
                Create Portfolio
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-brand-500 hover:bg-brand-600"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

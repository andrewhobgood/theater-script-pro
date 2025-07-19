import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Image, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  Info,
  X,
  Plus
} from "lucide-react";

interface ScriptUploadWizardProps {
  onClose: () => void;
  onComplete: (scriptData: any) => void;
}

export const ScriptUploadWizard = ({ onClose, onComplete }: ScriptUploadWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    subtitle: "",
    description: "",
    genre: [] as string[],
    themes: [] as string[],
    language: "English",
    ageRating: "",
    
    // Cast & Technical
    castMin: 1,
    castMax: 10,
    castFlexible: false,
    duration: 90,
    pages: 50,
    characters: [] as any[],
    sets: [] as string[],
    specialRequirements: [] as string[],
    
    // Files
    scriptFile: null as File | null,
    thumbnailFile: null as File | null,
    additionalFiles: [] as File[],
    
    // Licensing
    basePrice: 100,
    royaltyRate: 8,
    educationalDiscount: 25,
    isPublic: true,
    isActive: false // Will be set to true after review
  });

  const steps = [
    { title: "Basic Information", description: "Title, genre, and description" },
    { title: "Cast & Technical", description: "Characters, sets, and requirements" },
    { title: "File Upload", description: "Script files and media" },
    { title: "Licensing Terms", description: "Pricing and availability" },
    { title: "Review & Submit", description: "Confirm all details" }
  ];

  const genres = ["Drama", "Comedy", "Tragedy", "Musical", "Classical", "Contemporary", "Romance", "Thriller", "Historical", "Fantasy", "Mystery"];
  const themes = ["Love", "Family", "Power", "Revenge", "Identity", "Justice", "Mortality", "Friendship", "Betrayal", "Redemption", "Coming of Age", "War", "Hope"];
  const ageRatings = ["G", "PG", "PG-13", "R", "Adult"];

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre) 
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleThemeToggle = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(theme) 
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const addCharacter = () => {
    setFormData(prev => ({
      ...prev,
      characters: [...prev.characters, {
        name: "",
        description: "",
        ageRange: "",
        gender: "any",
        isLead: false,
        voiceType: ""
      }]
    }));
  };

  const removeCharacter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.filter((_, i) => i !== index)
    }));
  };

  const updateCharacter = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.map((char, i) => 
        i === index ? { ...char, [field]: value } : char
      )
    }));
  };

  const addSet = (set: string) => {
    if (set.trim() && !formData.sets.includes(set.trim())) {
      setFormData(prev => ({
        ...prev,
        sets: [...prev.sets, set.trim()]
      }));
    }
  };

  const removeSet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (file: File, type: 'script' | 'thumbnail' | 'additional') => {
    if (type === 'script') {
      setFormData(prev => ({ ...prev, scriptFile: file }));
    } else if (type === 'thumbnail') {
      setFormData(prev => ({ ...prev, thumbnailFile: file }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        additionalFiles: [...prev.additionalFiles, file] 
      }));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.title && formData.description && formData.genre.length > 0;
      case 1:
        return formData.castMin && formData.castMax && formData.duration;
      case 2:
        return formData.scriptFile;
      case 3:
        return formData.basePrice > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold theater-heading">Upload New Script</h2>
            <p className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep ? 'bg-primary text-primary-foreground' :
                  index === currentStep ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-semibold">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter script title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Optional subtitle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a compelling description of your script..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Genres * (Select at least one)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={formData.genre.includes(genre)}
                          onCheckedChange={() => handleGenreToggle(genre)}
                        />
                        <Label htmlFor={`genre-${genre}`} className="text-sm">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Themes (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.slice(0, 10).map((theme) => (
                      <div key={theme} className="flex items-center space-x-2">
                        <Checkbox
                          id={`theme-${theme}`}
                          checked={formData.themes.includes(theme)}
                          onCheckedChange={() => handleThemeToggle(theme)}
                        />
                        <Label htmlFor={`theme-${theme}`} className="text-sm">
                          {theme}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageRating">Age Rating</Label>
                  <Select value={formData.ageRating} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRating: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageRatings.map((rating) => (
                        <SelectItem key={rating} value={rating}>
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Cast & Technical */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cast Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="castMin">Minimum Cast *</Label>
                      <Input
                        id="castMin"
                        type="number"
                        min="1"
                        value={formData.castMin}
                        onChange={(e) => setFormData(prev => ({ ...prev, castMin: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="castMax">Maximum Cast *</Label>
                      <Input
                        id="castMax"
                        type="number"
                        min="1"
                        value={formData.castMax}
                        onChange={(e) => setFormData(prev => ({ ...prev, castMax: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="castFlexible"
                        checked={formData.castFlexible}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, castFlexible: !!checked }))}
                      />
                      <Label htmlFor="castFlexible" className="text-sm">
                        Flexible casting
                      </Label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 90 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Script Pages</Label>
                      <Input
                        id="pages"
                        type="number"
                        min="1"
                        value={formData.pages}
                        onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || 50 }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Characters</CardTitle>
                  <CardDescription>Add main characters (optional but recommended)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.characters.map((character, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Character {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCharacter(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Character name"
                          value={character.name}
                          onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Age range (e.g., 25-35)"
                          value={character.ageRange}
                          onChange={(e) => updateCharacter(index, 'ageRange', e.target.value)}
                        />
                      </div>
                      
                      <Textarea
                        placeholder="Character description"
                        value={character.description}
                        onChange={(e) => updateCharacter(index, 'description', e.target.value)}
                        rows={2}
                      />
                      
                      <div className="flex items-center gap-4">
                        <Select 
                          value={character.gender} 
                          onValueChange={(value) => updateCharacter(index, 'gender', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`lead-${index}`}
                            checked={character.isLead}
                            onCheckedChange={(checked) => updateCharacter(index, 'isLead', !!checked)}
                          />
                          <Label htmlFor={`lead-${index}`} className="text-sm">
                            Lead role
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addCharacter}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Character
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional steps would continue here... */}
          {currentStep >= 2 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Step {currentStep + 1} content would be implemented here...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} className="spotlight-button">
                Submit for Review
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="spotlight-button"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
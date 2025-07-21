import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, User, Briefcase, GraduationCap, Award, Star, FolderOpen } from 'lucide-react';
import { useCustomProfileData, CustomProfileData } from '@/hooks/useCustomProfileData';

const PROFESSION_OPTIONS = [
  'Software Developer',
  'Designer',
  'Writer',
  'Marketer',
  'Engineer', 
  'Architect',
  'Photographer',
  'Project Manager',
  'Data Scientist',
  'Sales Professional',
  'Other'
];

const DATA_TYPE_OPTIONS = [
  { value: 'experience', label: 'Work Experience', icon: Briefcase },
  { value: 'project', label: 'Project', icon: FolderOpen },
  { value: 'skill', label: 'Skill', icon: Star },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'certification', label: 'Certification', icon: Award },
  { value: 'award', label: 'Award', icon: Award },
] as const;

interface CustomDataFormProps {
  onSubmit: (data: Omit<CustomProfileData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  initialData?: Partial<CustomProfileData>;
}

const CustomDataForm: React.FC<CustomDataFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    profession: initialData?.profession || '',
    data_type: initialData?.data_type || 'experience' as const,
    title: initialData?.title || '',
    organization: initialData?.organization || '',
    description: initialData?.description || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    is_current: initialData?.is_current || false,
    location: initialData?.location || '',
    url: initialData?.url || '',
    skills: initialData?.skills || [],
    technologies: initialData?.technologies || [],
    achievements: initialData?.achievements || [],
    media_urls: initialData?.media_urls || [],
    metadata: initialData?.metadata || {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addArrayItem = (field: 'skills' | 'technologies' | 'achievements' | 'media_urls', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: 'skills' | 'technologies' | 'achievements' | 'media_urls', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="profession">Profession</Label>
          <Select value={formData.profession} onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              {PROFESSION_OPTIONS.map(profession => (
                <SelectItem key={profession} value={profession}>{profession}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="data_type">Type</Label>
          <Select value={formData.data_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, data_type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATA_TYPE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Senior Software Engineer, Brand Identity Project"
          required
        />
      </div>

      <div>
        <Label htmlFor="organization">Organization/Company</Label>
        <Input
          id="organization"
          value={formData.organization}
          onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
          placeholder="e.g., Google, Personal Project"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your role, project, or achievement..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            disabled={formData.is_current}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_current"
          checked={formData.is_current}
          onChange={(e) => setFormData(prev => ({ ...prev, is_current: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="is_current">Currently active</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., San Francisco, CA"
          />
        </div>
        <div>
          <Label htmlFor="url">URL/Link</Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export const CustomProfileDataCard: React.FC = () => {
  const { data, loading, addData, updateData, deleteData, getDataByType } = useCustomProfileData();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomProfileData | null>(null);

  const handleSubmit = async (formData: Omit<CustomProfileData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingItem) {
      await updateData(editingItem.id, formData);
      setEditingItem(null);
    } else {
      await addData(formData);
    }
    setShowForm(false);
  };

  const handleEdit = (item: CustomProfileData) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteData(id);
    }
  };

  const getDataTypeIcon = (type: CustomProfileData['data_type']) => {
    const option = DATA_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.icon : User;
  };

  const getDataTypeLabel = (type: CustomProfileData['data_type']) => {
    const option = DATA_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Profile Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Custom Profile Data
            </CardTitle>
            <CardDescription>
              Add custom information for professions without specific platform integrations
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <CustomDataForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              initialData={editingItem || undefined}
            />
          </div>
        )}

        {data.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No custom data yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your professional information, projects, skills, and achievements
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item) => {
              const IconComponent = getDataTypeIcon(item.data_type);
              return (
                <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-4 w-4" />
                      <Badge variant="outline">
                        {getDataTypeLabel(item.data_type)}
                      </Badge>
                      <Badge variant="secondary">
                        {item.profession}
                      </Badge>
                    </div>
                    <h5 className="font-medium">{item.title}</h5>
                    {item.organization && (
                      <p className="text-sm text-muted-foreground">{item.organization}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      {item.start_date && (
                        <span>
                          {new Date(item.start_date).toLocaleDateString()} - {' '}
                          {item.is_current ? 'Present' : item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Present'}
                        </span>
                      )}
                      {item.location && (
                        <span>• {item.location}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Total items: {data.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
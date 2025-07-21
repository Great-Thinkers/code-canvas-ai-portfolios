import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CustomProfileData {
  id: string;
  user_id: string;
  profession: string;
  data_type: 'experience' | 'project' | 'skill' | 'education' | 'certification' | 'award';
  title: string;
  organization: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  url: string | null;
  skills: string[];
  technologies: string[];
  achievements: string[];
  media_urls: string[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useCustomProfileData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CustomProfileData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: customData, error } = await supabase
        .from('custom_profile_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom profile data:', error);
        return;
      }

      setData((customData as CustomProfileData[]) || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addData = async (newData: Omit<CustomProfileData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('You must be logged in to add data');
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_profile_data')
        .insert({
          ...newData,
          user_id: user.id,
        });

      if (error) {
        console.error('Error adding custom data:', error);
        toast.error('Failed to add data');
        return;
      }

      await fetchData();
      toast.success('Data added successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to add data');
    }
  };

  const updateData = async (id: string, updates: Partial<CustomProfileData>) => {
    try {
      const { error } = await supabase
        .from('custom_profile_data')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating custom data:', error);
        toast.error('Failed to update data');
        return;
      }

      await fetchData();
      toast.success('Data updated successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to update data');
    }
  };

  const deleteData = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_profile_data')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting custom data:', error);
        toast.error('Failed to delete data');
        return;
      }

      await fetchData();
      toast.success('Data deleted successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to delete data');
    }
  };

  const getDataByType = (type: CustomProfileData['data_type']) => {
    return data.filter(item => item.data_type === type);
  };

  const getDataByProfession = (profession: string) => {
    return data.filter(item => item.profession === profession);
  };

  return {
    data,
    loading,
    addData,
    updateData,
    deleteData,
    getDataByType,
    getDataByProfession,
    refetch: fetchData,
  };
};
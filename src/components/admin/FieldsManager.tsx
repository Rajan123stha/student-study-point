
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, Save, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

interface Field {
  id: string;
  name: string;
  created_at?: string;
}

const FieldsManager = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [newField, setNewField] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState<Field | null>(null);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setFields(data || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      toast({
        title: "Error",
        description: "Failed to load fields",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = async () => {
    if (!newField.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('fields')
        .insert({ name: newField.trim() })
        .select()
        .single();
      
      if (error) throw error;
      
      setFields([...fields, data]);
      setNewField('');
      toast({
        title: "Success",
        description: `Field "${newField}" has been added`,
      });
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Error",
        description: "Failed to add field",
        variant: "destructive"
      });
    }
  };

  const handleDeleteField = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFields(fields.filter(field => field.id !== id));
      toast({
        title: "Success",
        description: "Field has been deleted",
      });
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Error",
        description: "Failed to delete field. Make sure there are no subjects or resources using this field.",
        variant: "destructive"
      });
    }
  };

  const startEditing = (field: Field) => {
    setEditingField({...field});
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const handleUpdateField = async () => {
    if (!editingField || !editingField.name.trim()) return;
    
    try {
      const { error } = await supabase
        .from('fields')
        .update({ name: editingField.name.trim() })
        .eq('id', editingField.id);
      
      if (error) throw error;
      
      setFields(fields.map(field => 
        field.id === editingField.id ? {...field, name: editingField.name.trim()} : field
      ));
      
      setEditingField(null);
      toast({
        title: "Success",
        description: "Field has been updated",
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Error",
        description: "Failed to update field",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Fields of Study</h2>
      
      <div className="flex space-x-2 mb-6">
        <Input
          placeholder="Add new field (e.g., BCA, BBA, BIM)"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleAddField}>
          <Plus className="h-4 w-4 mr-2" /> Add Field
        </Button>
      </div>
      
      {isLoading ? (
        <p className="text-center py-4">Loading fields...</p>
      ) : fields.length > 0 ? (
        <div className="border rounded-md divide-y">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between py-3 px-4">
              {editingField?.id === field.id ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={editingField.name}
                    onChange={(e) => setEditingField({...editingField, name: e.target.value})}
                    className="max-w-md"
                  />
                  <Button variant="ghost" size="sm" onClick={handleUpdateField}>
                    <Save className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEditing}>
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{field.name}</span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEditing(field)}>
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">
          No fields added yet. Add your first field above.
        </p>
      )}
    </div>
  );
};

export default FieldsManager;

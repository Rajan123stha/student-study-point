
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Trash2, 
  Pencil, 
  Save, 
  X, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { SEMESTERS } from "@/data/mockData";

interface Field {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  field_id: string;
  semester: number;
  created_at?: string;
}

const SubjectsManager = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);

  useEffect(() => {
    fetchFields();
    fetchSubjects();
  }, []);

  const fetchFields = async () => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setFields(data || []);
      if (data && data.length > 0 && !selectedField) {
        setSelectedField(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
      toast({
        title: "Error",
        description: "Failed to load fields",
        variant: "destructive"
      });
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim() || !selectedField || !selectedSemester) return;
    
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name: newSubject.trim(),
          field_id: selectedField,
          semester: selectedSemester
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setSubjects([...subjects, data]);
      setNewSubject('');
      toast({
        title: "Success",
        description: `Subject "${newSubject}" has been added`,
      });
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: "Failed to add subject",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSubjects(subjects.filter(subject => subject.id !== id));
      toast({
        title: "Success",
        description: "Subject has been deleted",
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "Failed to delete subject. Make sure there are no resources using this subject.",
        variant: "destructive"
      });
    }
  };

  const startEditing = (subject: Subject) => {
    setEditingSubject({...subject});
  };

  const cancelEditing = () => {
    setEditingSubject(null);
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject || !editingSubject.name.trim()) return;
    
    try {
      const { error } = await supabase
        .from('subjects')
        .update({ name: editingSubject.name.trim() })
        .eq('id', editingSubject.id);
      
      if (error) throw error;
      
      setSubjects(subjects.map(subject => 
        subject.id === editingSubject.id ? {...subject, name: editingSubject.name.trim()} : subject
      ));
      
      setEditingSubject(null);
      toast({
        title: "Success",
        description: "Subject has been updated",
      });
    } catch (error) {
      console.error('Error updating subject:', error);
      toast({
        title: "Error",
        description: "Failed to update subject",
        variant: "destructive"
      });
    }
  };

  const toggleField = (fieldId: string) => {
    if (expandedField === fieldId) {
      setExpandedField(null);
      setExpandedSemester(null);
    } else {
      setExpandedField(fieldId);
      setExpandedSemester(null);
    }
  };

  const toggleSemester = (semesterId: number) => {
    if (expandedSemester === semesterId) {
      setExpandedSemester(null);
    } else {
      setExpandedSemester(semesterId);
    }
  };

  const getFieldName = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'Unknown';
  };

  // Group subjects by field and semester
  const groupedSubjects = subjects.reduce((acc, subject) => {
    if (!acc[subject.field_id]) {
      acc[subject.field_id] = {};
    }
    if (!acc[subject.field_id][subject.semester]) {
      acc[subject.field_id][subject.semester] = [];
    }
    acc[subject.field_id][subject.semester].push(subject);
    return acc;
  }, {} as Record<string, Record<number, Subject[]>>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Subjects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study
          </label>
          <select 
            className="w-full rounded-md border border-input px-3 py-2"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            {fields.map((field) => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select 
            className="w-full rounded-md border border-input px-3 py-2"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
          >
            {SEMESTERS.map((semester) => (
              <option key={semester} value={semester}>Semester {semester}</option>
            ))}
          </select>
        </div>
        
        <div className="md:pt-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Add new subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <Button onClick={handleAddSubject}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <p className="text-center py-4">Loading subjects...</p>
      ) : Object.keys(groupedSubjects).length > 0 ? (
        <div className="border rounded-md">
          {fields.map((field) => (
            groupedSubjects[field.id] ? (
              <div key={field.id} className="border-b last:border-b-0">
                <button 
                  className="w-full flex items-center justify-between py-3 px-4 font-medium text-left"
                  onClick={() => toggleField(field.id)}
                >
                  <span>{field.name}</span>
                  {expandedField === field.id ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </button>
                
                {expandedField === field.id && (
                  <div className="pl-4 pr-2 pb-2">
                    {Object.keys(groupedSubjects[field.id])
                      .sort((a, b) => Number(a) - Number(b))
                      .map((semesterId) => (
                        <div key={semesterId} className="mb-2 border-l-2 border-gray-200 pl-2">
                          <button 
                            className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium text-left"
                            onClick={() => toggleSemester(Number(semesterId))}
                          >
                            <span>Semester {semesterId}</span>
                            {expandedSemester === Number(semesterId) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </button>
                          
                          {expandedSemester === Number(semesterId) && (
                            <div className="pl-4 py-1">
                              {groupedSubjects[field.id][Number(semesterId)]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((subject) => (
                                  <div key={subject.id} className="flex items-center justify-between py-2 px-2 text-sm">
                                    {editingSubject?.id === subject.id ? (
                                      <div className="flex items-center space-x-2 flex-1">
                                        <Input
                                          value={editingSubject.name}
                                          onChange={(e) => setEditingSubject({...editingSubject, name: e.target.value})}
                                          className="h-8 text-sm"
                                        />
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleUpdateSubject}>
                                          <Save className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancelEditing}>
                                          <X className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <>
                                        <span>{subject.name}</span>
                                        <div className="flex space-x-1">
                                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEditing(subject)}>
                                            <Pencil className="h-3.5 w-3.5 text-blue-600" />
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeleteSubject(subject.id)}>
                                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : null
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">
          No subjects added yet. Add your first subject above.
        </p>
      )}
    </div>
  );
};

export default SubjectsManager;

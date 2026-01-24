import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCustomFieldsByPersonal } from '@/data/mockData';
import { CustomField, FieldType } from '@/types';

const FormBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const existingFields = user ? getCustomFieldsByPersonal(user.id) : [];

  const [customFields, setCustomFields] = useState<Omit<CustomField, 'id'>[]>(
    existingFields.map(f => ({
      academiaId: f.academiaId,
      personalId: f.personalId,
      name: f.name,
      label: f.label,
      type: f.type,
      options: f.options,
      required: f.required,
      order: f.order
    }))
  );

  const [newField, setNewField] = useState({
    label: '',
    type: 'text' as FieldType,
    required: false,
    options: ''
  });

  if (!user) return null;

  const addField = () => {
    if (!newField.label) {
      toast({
        title: 'Erro',
        description: 'O nome do campo é obrigatório',
        variant: 'destructive'
      });
      return;
    }

    const fieldName = newField.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    const field: Omit<CustomField, 'id'> = {
      academiaId: user.academiaId || '',
      personalId: user.id,
      name: fieldName,
      label: newField.label,
      type: newField.type,
      required: newField.required,
      order: customFields.length + 1,
      options: newField.type === 'select' ? newField.options.split(',').map(o => o.trim()) : undefined
    };

    setCustomFields([...customFields, field]);
    setNewField({ label: '', type: 'text', required: false, options: '' });

    toast({
      title: 'Campo adicionado!',
      description: `O campo "${field.label}" foi adicionado ao formulário.`
    });
  };

  const removeField = (index: number) => {
    const newFields = [...customFields];
    newFields.splice(index, 1);
    setCustomFields(newFields.map((f, i) => ({ ...f, order: i + 1 })));
  };

  const handleSave = () => {
    toast({
      title: 'Formulário salvo!',
      description: `${customFields.length} campo(s) personalizado(s) configurado(s).`
    });
  };

  const getTypeLabel = (type: FieldType) => {
    switch (type) {
      case 'text': return 'Texto';
      case 'textarea': return 'Texto longo';
      case 'number': return 'Número';
      case 'select': return 'Seleção';
      case 'boolean': return 'Sim/Não';
      case 'date': return 'Data';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Formulário Personalizado</h1>
        <p className="text-muted-foreground">
          Adicione campos personalizados ao formulário de avaliação dos alunos
        </p>
      </div>

      {/* Standard Fields Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campos Padrão</CardTitle>
          <CardDescription>
            Estes campos são incluídos automaticamente em todos os formulários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <p>✓ Dados pessoais (nome, WhatsApp, nascimento, sexo, altura, peso)</p>
            <p>✓ Objetivo e experiência com musculação</p>
            <p>✓ Frequência e tempo disponível para treino</p>
            <p>✓ Informações de saúde (lesões, doenças, medicamentos)</p>
            <p>✓ Hábitos e rotina (atividade, sono, alimentação)</p>
            <p>✓ Preferências de treino (horário, local, exercícios)</p>
            <p>✓ Aceite dos termos de uso e LGPD</p>
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Field */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adicionar Campo Personalizado</CardTitle>
          <CardDescription>
            Crie campos adicionais específicos para sua avaliação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Nome do Campo</Label>
              <Input
                value={newField.label}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                placeholder="Ex: Usa suplementos?"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as FieldType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="textarea">Texto Longo</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                  <SelectItem value="boolean">Sim/Não</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newField.type === 'select' && (
              <div className="space-y-2">
                <Label>Opções (separadas por vírgula)</Label>
                <Input
                  value={newField.options}
                  onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                  placeholder="Opção 1, Opção 2, Opção 3"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Obrigatório</Label>
              <div className="flex items-center gap-2 pt-2">
                <Switch
                  checked={newField.required}
                  onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                />
                <span className="text-sm text-muted-foreground">
                  {newField.required ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>
          </div>
          <Button onClick={addField}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Campo
          </Button>
        </CardContent>
      </Card>

      {/* Custom Fields List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campos Personalizados ({customFields.length})</CardTitle>
          <CardDescription>
            Arraste para reordenar os campos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customFields.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum campo personalizado adicionado
            </p>
          ) : (
            <div className="space-y-2">
              {customFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="flex-1">
                    <p className="font-medium">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {getTypeLabel(field.type)}
                      {field.required && ' • Obrigatório'}
                      {field.options && ` • Opções: ${field.options.join(', ')}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeField(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {customFields.length > 0 && (
            <Button className="mt-4" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Formulário
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormBuilder;

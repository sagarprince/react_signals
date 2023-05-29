type FieldType = 'text' | 'number' | 'date' | 'time' | 'select' | 'boolean';

export class TemplateField {
  id: string;
  label: string;
  type: FieldType;

  constructor(value?: any) {
    this.id = (value && value.id) || -1;
    this.label = (value && value.label) || '';
    this.type = (value && value.type) || '';
  }
}

export class Template {
  id: string;
  name: string;
  fields: TemplateField[];

  constructor(value?: any) {
    this.id = (value && value.id) || '';
    this.name = (value && value.name) || '';
    this.fields = (value && value.fields && value.fields.map((item: any) => new TemplateField(item))) || [];
  }
}

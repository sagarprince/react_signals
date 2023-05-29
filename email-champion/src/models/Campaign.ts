export class Campaign {
  id?: number;
  userId: number;
  templateId: number;
  template: any;
  name: string;
  subject: string;
  contacts: number[];
  recipients: number;
  status?: string;

  constructor(value?: any) {
    this.id = (value && value.id) || -1;
    this.userId = (value && value.userId) || -1;
    this.templateId = (value && value.templateId) || -1;
    this.template = (value && value.template) || null;
    this.name = (value && value.name) || '';
    this.subject = (value && value.subject) || '';
    this.contacts = (value && value.contacts) || [];
    this.recipients = this.contacts.length || 0;
    this.status = (value && value.status) || 'pending';
  }
}

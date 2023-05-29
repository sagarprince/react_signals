export class User {
  id?: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;

  constructor(value?: any) {
    this.id = (value && value.id) || -1;
    this.email = (value && value.email) || '';
    this.password = (value && value.password) || '';
    this.firstName = (value && value.firstName) || '';
    this.lastName = (value && value.lastName) || '';
  }
}

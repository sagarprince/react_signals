export class Contact {
  id?: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  address?: string;
  city?: string;
  phone?: any;
  createdAt?: any;

  constructor(value?: any, isRequestData: boolean = false) {
    this.id = (value && value.id) || -1;
    this.userId = (value && value.userId) || -1;
    this.firstName = (value && value.firstName) || '';
    this.lastName = (value && value.lastName) || '';
    this.email = (value && value.email) || '';
    this.gender = (value && value.gender) || 'Male';
    this.address = (value && value.address) || '';
    this.city = (value && value.city) || '';
    this.phone = (value && value.phone) || '';

    const createdAtTimestamp = parseInt((value && value.createdAt) || 0, 10);
    if (!isRequestData) {
      const createdAtDate = new Date(createdAtTimestamp);
      this.createdAt = createdAtDate.toUTCString().replace(' GMT', '');
    } else {
      this.createdAt = createdAtTimestamp;
    }
  }
}

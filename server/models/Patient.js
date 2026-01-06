export default class Patient {
  constructor({ id, userId, age, gender }) {
    this.id = id;
    this.userId = userId;
    this.age = age;
    this.gender = gender;
    this.createdAt = new Date();
  }
}

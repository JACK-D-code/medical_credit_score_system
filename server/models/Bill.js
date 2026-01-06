export default class Bill {
  constructor({ id, patientId, amount, paid }) {
    this.id = id;
    this.patientId = patientId;
    this.amount = amount;
    this.paid = paid;
    this.createdAt = new Date();
  }
}

import { bills } from "../data/bills.js";
import Bill from "../models/Bill.js";

export const createBill = (req, res) => {
  const { patientId, amount, paid } = req.body;

  const bill = new Bill({
    id: Date.now().toString(),
    patientId,
    amount,
    paid
  });

  bills.push(bill);

  res.status(201).json({
    success: true,
    message: "Bill created successfully",
    bill
  });
};

export const getBills = (req, res) => {
  const patientBills = bills.filter(
    b => b.patientId === req.params.patientId
  );

  res.json(patientBills);
};

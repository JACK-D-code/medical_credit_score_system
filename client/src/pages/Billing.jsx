import { useEffect, useState } from "react";
import api from "../api/api";

export default function Billing() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    api.get("/billing/123").then(res => setBills(res.data));
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Billing History</h1>

      <table className="w-full bg-gray-900 rounded-xl overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">Date</th>
            <th>Treatment</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(b => (
            <tr key={b._id} className="border-t border-gray-700">
              <td className="p-3">
                {new Date(b.visitDate).toLocaleDateString()}
              </td>
              <td>{b.treatmentType}</td>
              <td>₹{b.totalAmount}</td>
              <td>₹{b.paidAmount}</td>
              <td className="text-red-400">₹{b.dueAmount}</td>
              <td className={
                b.status === "PAID"
                  ? "text-green-400"
                  : "text-yellow-400"
              }>
                {b.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

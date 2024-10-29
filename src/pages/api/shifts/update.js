import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const { shiftId, user_id, ...updatedShiftData } = req.body;

      // Parse incoming data to proper types
      const formattedData = {
        date: new Date(updatedShiftData.date),
        clockIn: new Date(updatedShiftData.clockIn),
        clockOut: new Date(updatedShiftData.clockOut),
        hoursWorked: parseFloat(updatedShiftData.hoursWorked),
        payRate: parseFloat(updatedShiftData.payRate),
        totalBasePay: parseFloat(updatedShiftData.totalBasePay),
        tips: parseFloat(updatedShiftData.tips),
        totalHourlyRate: parseFloat(updatedShiftData.totalHourlyRate),
        totalPay: parseFloat(updatedShiftData.totalPay),
      };

      const result = await db
        .collection("shifts")
        .updateOne(
          { _id: new ObjectId(shiftId), user_id: new ObjectId(user_id) },
          { $set: formattedData }
        );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Shift updated successfully" });
      } else {
        res.status(404).json({ error: "Shift not found" });
      }
    } catch (error) {
      console.error("Error updating shift:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

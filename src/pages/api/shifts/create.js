import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("shifts");

      const {
        user_id,
        companyId,
        companyName,
        locationId,
        locationName,
        date,
        clockIn,
        clockOut,
        hoursWorked,
        payRate,
        totalBasePay,
        totalHourlyRate,
        totalPay,
        tips,
      } = req.body;

      if (
        !user_id ||
        !companyId ||
        !locationId ||
        !date ||
        !clockIn ||
        !clockOut
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create the shift object
      const newShift = {
        user_id: new ObjectId(user_id),
        companyId: new ObjectId(companyId), // Use the first company for now
        companyName,
        locationId: new ObjectId(locationId), // Use the first location for now
        locationName,
        date: new Date(date),
        clockIn: new Date(`1970-01-01T${clockIn}:00`),
        clockOut: new Date(`1970-01-01T${clockOut}:00`),
        hoursWorked: parseFloat(hoursWorked),
        payRate: parseFloat(payRate),
        totalBasePay: parseFloat(totalBasePay),
        totalHourlyRate: parseFloat(totalHourlyRate),
        totalPay: parseFloat(totalPay),
        tips: parseFloat(tips),
        createdAt: new Date(), // Add a timestamp for when the shift was created
      };

      // Insert the new shift into the shifts collection
      const shiftResult = await collection.insertOne(newShift);

      if (!shiftResult.acknowledged) {
        throw new Error("Failed to insert shift");
      }

      res.status(201).json({ shiftId: shiftResult.insertedId });
    } catch (error) {
      console.error("Error creating shift:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

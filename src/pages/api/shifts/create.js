import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import mockUser from "@/Utils/mockUser";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("shifts");

      const {
        companyId,
        companyName,
        locationName,
        clockIn,
        clockOut,
        hoursWorked,
        payRate,
        totalHourlyPay,
        totalPay,
        tips,
      } = req.body;

      // Create the shift object
      const newShift = {
        user_id: new ObjectId(mockUser._id),
        companyId: new ObjectId(companyId), // Use the first company for now
        companyName,
        locationName,
        clockIn: new Date(clockIn),
        clockOut: new Date(clockOut),
        hoursWorked: parseFloat(hoursWorked),
        payRate: parseFloat(payRate),
        totalHourlyPay: parseFloat(totalHourlyPay),
        totalPay: parseFloat(totalPay),
        tips: parseFloat(tips),
        createdAt: new Date(), // Add a timestamp for when the shift was created
      };

      // Insert the new shift into the shifts collection
      const shiftResult = await collection.insertOne(newShift);

      res.status(200).json({ shiftId: shiftResult.insertedId });
    } catch (error) {
      console.error("Error creating shift:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

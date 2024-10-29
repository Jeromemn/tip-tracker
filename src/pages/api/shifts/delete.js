import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp"); // Use your database name
      const collection = db.collection("shifts"); // Access shifts collection

      const { shiftId, user_id } = req.body; // Expecting shiftId in the request body

      if (!shiftId) {
        return res.status(400).json({ error: "Shift ID is required" });
      }

      const result = await collection.deleteOne({
        _id: new ObjectId(shiftId),
        user_id: new ObjectId(user_id),
      });

      if (result.deletedCount > 0) {
        res
          .status(200)
          .json({ success: true, message: "Shift deleted successfully" });
      } else {
        res.status(404).json({ error: "Shift not found" });
      }
    } catch (error) {
      console.error("Error handling shift deletion:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the shift" });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

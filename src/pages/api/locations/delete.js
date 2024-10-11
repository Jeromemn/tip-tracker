import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import mockUser from "@/Utils/mockUser";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("companies");

      const { companyId, location } = req.body;

      const result = await collection.updateOne(
        { _id: new ObjectId(companyId) },
        { $pull: { locations: { locationName: location } } }
      );

      if (result.modifiedCount > 0) {
        res
          .status(200)
          .json({ success: true, message: "Location deleted successfully" });
      } else {
        res.status(404).json({ error: "Location or company not found" });
      }
    } catch (error) {
      console.error("Error handling location deletion:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the location" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

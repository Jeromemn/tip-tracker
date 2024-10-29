import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("companies");

      const { companyId, locationId, user_id } = req.body;

      // Ensure all IDs are valid ObjectIds
      const query = {
        _id: new ObjectId(companyId), // Match company
        user_id: new ObjectId(user_id), // Ensure the user owns the company
        "locations.locationId": new ObjectId(locationId), // Match the specific location
      };

      const update = {
        $pull: { locations: { locationId: new ObjectId(locationId) } }, // Remove the location
      };

      const result = await collection.updateOne(query, update);

      if (result.modifiedCount > 0) {
        res.status(200).json({
          success: true,
          message: "Location deleted successfully",
        });
      } else {
        res.status(404).json({
          error: "Location or company not found",
        });
      }
    } catch (error) {
      console.error("Error handling location deletion:", error);
      res.status(500).json({
        error: "An error occurred while deleting the location",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

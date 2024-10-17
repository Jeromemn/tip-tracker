import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("companies");

      const {
        companyId,
        oldLocation,
        newLocation,
        payRate,
        userId,
        locationId,
      } = req.body;

      console.log("location id in update", locationId);

      // Use the correct query to target a location in the array
      const query = {
        user_id: new ObjectId(userId),
        _id: new ObjectId(companyId),
        "locations.locationId": new ObjectId(locationId), // Use correct path to match location
      };

      const update = {
        $set: {
          ...(oldLocation !== newLocation && {
            "locations.$.locationName": newLocation, // Update location name if changed
          }),
          "locations.$.payRate": payRate, // Always update pay rate
        },
      };

      const result = await collection.updateOne(query, update);

      if (result.modifiedCount > 0) {
        res.status(200).json({
          success: true,
          message:
            oldLocation !== newLocation
              ? "Location updated successfully"
              : "Pay rate updated successfully",
        });
      } else {
        res.status(404).json({ error: "Location or company not found" });
      }
    } catch (error) {
      console.error("Error handling location update:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the location" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

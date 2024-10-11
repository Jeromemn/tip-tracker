import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("companies");

      const { companyId, oldLocation, newLocation, payRate } = req.body;

      // Check if location name was changed
      if (oldLocation !== newLocation) {
        // Update both the location name and pay rate
        const result = await collection.updateOne(
          {
            _id: new ObjectId(companyId),
            "locations.locationName": oldLocation,
          },
          {
            $set: {
              "locations.$.locationName": newLocation, // Update location name
              "locations.$.payRate": payRate, // Update pay rate
            },
          }
        );

        if (result.modifiedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Location updated successfully" });
        } else {
          res.status(404).json({ error: "Location or company not found" });
        }
      } else {
        // Only update the pay rate
        const result = await collection.updateOne(
          {
            _id: new ObjectId(companyId),
            "locations.locationName": oldLocation,
          },
          { $set: { "locations.$.payRate": payRate } }
        );
        if (result.modifiedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Pay rate updated successfully" });
        } else {
          res.status(404).json({ error: "Location or company not found" });
        }
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

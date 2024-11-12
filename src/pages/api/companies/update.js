import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { companyId, location, payRate, userId } = req.body;

    if (!companyId || !location || !payRate) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("companies");

      if (!ObjectId.isValid(companyId)) {
        return res.status(400).json({ error: "Invalid company ID." });
      }

      const newLocation = {
        locationName: location,
        payRate: parseFloat(payRate),
        locationId: new ObjectId(),
      };

      // Update the company by pushing the new location to the locations array
      const result = await collection.findOneAndUpdate(
        { user_id: new ObjectId(userId), _id: new ObjectId(companyId) },
        {
          $push: {
            locations: newLocation,
          },
        },
        { returnDocument: "after" }
      );

      res.status(200).json({ message: "Location added successfully.", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add location." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

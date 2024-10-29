import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { company, location, payRate, userId } = req.body;

    if (!company || !location || !payRate) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("companies");

      if (!ObjectId.isValid(company.id)) {
        return res.status(400).json({ error: "Invalid company ID." });
      }

      // Update the company by pushing the new location to the locations array
      const result = await collection.updateOne(
        { user_id: new ObjectId(userId), _id: new ObjectId(company.id) },
        {
          $push: {
            locations: {
              locationName: location,
              payRate: Number(payRate), // Ensure payRate is a number
              locationId: new ObjectId(),
            },
          },
        }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Location added successfully." });
      } else {
        res.status(404).json({ error: "Company not found." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add location." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

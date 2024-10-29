import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("companies");

      const { companyName, locations, userId } = req.body;

      if (!userId) {
        res.status(400).json({ error: "Missing user ID" });
        return;
      }

      if (!companyName) {
        res.status(400).json({ error: "Missing company name" });
        return;
      }

      // Normalize the company name (trimmed and lowercase)
      const normalizedCompanyName = companyName.trim().toLowerCase();

      // Check if the company exists for the current user
      const existingCompany = await collection.findOne({
        name: normalizedCompanyName,
        user_id: new ObjectId(userId),
      });

      let companyId;

      if (existingCompany) {
        companyId = existingCompany._id;

        // Add the new locations to the existing company's locations array
        await collection.updateOne(
          { _id: companyId },
          {
            $push: {
              locations: {
                $each: locations.map((location) => ({
                  locationName: location.locationName,
                  payRate: parseFloat(location.payRate),
                  locationId: new ObjectId(),
                })),
              },
            },
          }
        );
      } else {
        // Create a new company with embedded locations
        const newCompany = {
          name: normalizedCompanyName,
          user_id: new ObjectId(userId),
          locations: locations.map((location) => ({
            locationName: location.locationName,
            payRate: parseFloat(location.payRate),
            locationId: new ObjectId(),
          })),
        };

        // Insert the new company
        const companyResult = await collection.insertOne(newCompany);
        companyId = companyResult.insertedId;
      }

      res.status(200).json({ id: companyId });
    } catch (error) {
      console.error("Error handling company creation or update:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import mockUser from "@/Utils/mockUser";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("IncomeApp");

      // Fetch all companies associated with the current user
      const companies = await db
        .collection("companies")
        .find({ user_id: new ObjectId(mockUser._id) })
        .toArray();

      // No need to query for locations separately since they are now embedded in the company document
      const enrichedCompanies = companies.map((company) => ({
        _id: company._id,
        name: company.name,
        locations: company.locations.map((location) => ({
          locationName: location.locationName,
          payRate: location.payRate,
        })),
      }));

      // Send back the enriched company data
      res.status(200).json(enrichedCompanies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

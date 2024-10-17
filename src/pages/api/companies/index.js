import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // Adjust the import path if necessary

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db("IncomeApp");

    // Fetch companies associated with the authenticated user's ID
    const companies = await db
      .collection("companies")
      .find({ user_id: new ObjectId(session.user.id) }) // Use user's ID from the session
      .toArray();

    // Send back the list of companies
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

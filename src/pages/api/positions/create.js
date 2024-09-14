import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      const client = await clientPromise;
      const db = client.db("IncomeApp");
      const collection = db.collection("JobRoles");

      const result = await collection.insertOne(data);

      res.status(200).json({ id: result.insertedId });
    } catch (error) {
      console.error("Error creating Job role:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(400).json({ message: "Method not allowed" });
  }
}

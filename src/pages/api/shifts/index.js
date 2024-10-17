import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const client = await clientPromise;
      const db = client.db("IncomeApp");

      // Fetch all shifts associated with the current user
      const shifts = await db
        .collection("shifts")
        .find({ user_id: new ObjectId(session.user.id) })
        .toArray();

      // Send back the shifts data
      res.status(200).json(shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

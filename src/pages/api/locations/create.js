import clientPromise from "@/lib/mongoDB";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db();

      const { company_id, locationName, jobTitles } = req.body;

      const newLocation = {
        company_id: new ObjectId(company_id),
        locationName,
        jobTitles: jobTitles || [],
      };

      const result = await db.collection("locations").insertOne(newLocation);
      await db
        .collection("companies")
        .updateOne(
          { _id: new ObjectId(company_id) },
          { $push: { locations: result.insertedId } }
        );

      res.status(200).json({ id: result.insertedId });
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

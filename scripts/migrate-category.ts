import * as dotenv from "dotenv"
import path from "path"
import dbConnect from "../lib/db"
import { Project } from "../models/Project"

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

async function migrate() {
  try {
    await dbConnect()
    console.log("Connected to MongoDB.")

    console.log("Migrating 'Visual Effects' to 'UGC Video'...")
    const result = await Project.updateMany(
      { category: "Visual Effects" },
      { $set: { category: "UGC Video" } }
    )

    console.log(
      `Migration complete! Updated ${result.modifiedCount} project(s).`
    )
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrate()

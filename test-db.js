import dbConnect from "./lib/db.js"
import { getProjects } from "./lib/services/projectService.js"

async function test() {
  try {
    const projects = await getProjects()
    console.log("Success:", projects.length)
  } catch (err) {
    console.error("Error:", err)
  }
}
test()

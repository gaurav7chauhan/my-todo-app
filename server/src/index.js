import dotenv from "dotenv";
import connectDB from "./database/db.js"; // This must exist
import { app } from "./app.js"; // This must export app

dotenv.config({ path: "./.env" });

connectDB()
.then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port: ${process.env.PORT || 3000}`)
  })
  app.on("error", err => {
    console.log("ERROR:", err)
    throw err
  })
})
.catch(err => {
  console.log(`MONGO_DB connection failed: ${err}`)
})

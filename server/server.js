import express from "express";
import dotenv from "dotenv";
import billingRoutes from "./routes/billingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import creditRoutes from "./routes/creditRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";


dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());


// Routes here
app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/credit", creditRoutes);
//app.use("/api/dashboard", dashboardRoutes);

// ❗ Global Error Handler (MUST be last)
app.use(errorHandler);



app.listen(5000, () => console.log("🚀 Server running on without database"));



import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/not-found";
// import userRoutes from "@/modules/user/user.route";
 

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Welcome to AmarShop" });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;

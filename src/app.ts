import express from "express";
import cors from "cors";
import helmet from "helmet";
import { globalErrorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/not-found";
import router from "./routes/routes";
import { subdomainMiddleware } from "./middleware/subdomain";
// import userRoutes from "@/modules/user/user.route";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(subdomainMiddleware)
// Routes
app.use("/api/v1", router);

// Health check
app.get("/helth", (req, res) => {
  res.json({ message: "Welcome to AmarShop" });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(globalErrorHandler);

export default app;

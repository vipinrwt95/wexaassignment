import express, { Request, Response } from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import  settingRoutes from "./routes/settingRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "StockFlow TypeScript Backend Running",
  });
});
app.post("/test", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "StockFlow TypeScript Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/dashboard", dashboardRoutes);
export default app;
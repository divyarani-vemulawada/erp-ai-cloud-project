import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import hrRoutes from "./routes/hrRoutes";
import financeRoutes from "./routes/financeRoutes";
import supplyChainRoutes from "./routes/supplyChainRoutes";
import projectRoutes from "./routes/projectRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import reportRoutes from "./routes/reportRoutes";

import dns from "dns";
dns.setServers(["1.1.1.1","8.8.8.8"]);
dotenv.config();

const app = express();
connectDB();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", authRoutes);



app.use( "/api/users", userRoutes );
app.use( "/api/hr", hrRoutes );
app.use("/api/finance", financeRoutes);
app.use("/api/supply-chain", supplyChainRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req,res)=>{
    res.send("ERP Auth API Running");
});

const PORT = process.env.PORT || 1000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server started and running at ${PORT}`);
});

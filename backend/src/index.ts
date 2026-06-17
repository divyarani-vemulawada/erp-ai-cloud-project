import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

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

app.get("/", (req,res)=>{
    res.send("ERP Auth API Running");
});

const PORT = process.env.PORT || 1000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server started and running at ${PORT}`);
});

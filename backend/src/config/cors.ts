import cors from "cors";

export const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://ipi-smart-academic-system-dzhc.vercel.app/"]
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);

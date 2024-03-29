import "dotenv/config.js";
import express from "express";
import cors from "cors"
import userRouter from './routes/usersRouter.js'
import adminRouter from "./routes/adminRouter.js";

const app = express();
const port = process.env.PORT || 5000;

 const corsOptions = {
      origin: process.env.REACT_APP_URI, // nur Zugriff von dieser Domain erlauben
      exposedHeaders: "Authorization", //dem Frontend Zugriff auf die Header-Property "Authorization" geben
   };

app.use(cors(corsOptions)); //corsOptions muss be added to cors( ... )!!!!
app.use(express.json());


app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)


app.get("/", (req, res) => {
    res.send("welcome to ticket system");
  });




app.listen(port, () => console.log(`Server running in port ${port}`));

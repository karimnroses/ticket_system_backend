import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js"
import { verifySession } from "../controllers/adminController.js";
import { 
        getTicketsFromAllUsers,
        getCompanyInfos, 
        getCompanyTickets, 
        createNewUser, 
        updateTicket, 
        getAllCompanies, 
        updateCompanysStatus, 
        createNewCompany, 
        getAllUsers,
        updateUserInfos,
        updateUserPassword
        } 
        from "../controllers/adminController.js"


const adminRouter = Router();
adminRouter.route("/login").post(logIn);// success
adminRouter.route("/tickets/:ticket_id").put(verifyToken, updateTicket) // success
adminRouter.route("/alltickets/:orderBy/:ascOrDesc").get(verifyToken,  getTicketsFromAllUsers) //done Aber muss später wenn wir mehrere Tickets haben nochmal geprüft werden - success
adminRouter.route("/companies").get(verifyToken,  getAllCompanies).post(verifyToken,createNewCompany) // success
adminRouter.route("/ticketsprocompany/:company_id").get(verifyToken, getCompanyTickets)//  success
adminRouter.route("/infos/:company_id").get(verifyToken, getCompanyInfos).put(verifyToken, updateCompanysStatus) //success
adminRouter.route("/adduser").post(verifyToken, createNewUser)//done checked -> success
adminRouter.route("/users/:orderBy/:ascOrDesc").get(verifyToken, getAllUsers)
adminRouter.route("/user/:user_id").put(verifyToken, updateUserInfos)
adminRouter.route("/user/update-password/:user_id").put(verifyToken, updateUserPassword);
adminRouter.get("/verify", verifyToken, verifySession);



export default adminRouter;
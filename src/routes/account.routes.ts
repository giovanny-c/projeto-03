
import Router from "express";

import { CreateUserController } from "../modules/accounts/useCases/createUser/CreateUserController";
import { SignInController } from "../modules/accounts/useCases/signIn/SignInController";
import { ConfirmateRegisterController } from "../modules/accounts/useCases/confirmateRegister/ConfirmateRegisterController"
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { GetProfileController } from "../modules/accounts/useCases/getProfile/GetProfileController";
import { RefreshTokenController } from "../modules/accounts/useCases/refreshToken/RefreshTokenController";
import { LogOutController } from "../modules/accounts/useCases/logout/LogOutController";
import { SendForgotPasswordMailController } from "../modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController";
import { RetrievePasswordController } from "../modules/accounts/useCases/retrivePassword/RetrievePasswordController";
import { GeneratePdfController } from "../modules/accounts/useCases/generatePdf/GeneratePdfController";
//middlewares
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";
import multer from "multer"

const upload = multer()

const accountRoutes = Router()

const createUserController = new CreateUserController()
const signInController = new SignInController()
const confirmateRegisterController = new ConfirmateRegisterController()
const authenticateUserController = new AuthenticateUserController()
const getProfileController = new GetProfileController()
const refreshTokenController = new RefreshTokenController()
const logOutController = new LogOutController()
const sendForgotPasswordMailController = new SendForgotPasswordMailController()
const retrievePasswordController = new RetrievePasswordController()
const generatePdfController = new GeneratePdfController()

accountRoutes.post("/sign-in", upload.none(), createUserController.handle)
accountRoutes.get("/sign-in", signInController.handle)
accountRoutes.post("/confirmation", confirmateRegisterController.handle)
//se der problema com sendMail pode ser por causa do // baseUrl: (no tsconfig)
accountRoutes.post("/log-in", upload.none(), authenticateUserController.handle)
accountRoutes.post("/refresh-token", upload.none(), refreshTokenController.handle)
accountRoutes.get("/profile", ensureAuthenticated, getProfileController.handle)
accountRoutes.post("/log-out", ensureAuthenticated, logOutController.handle)
accountRoutes.post("/forgot-password", upload.none(), sendForgotPasswordMailController.handle)
accountRoutes.post("/retrieve-password", upload.none(), retrievePasswordController.handle)
accountRoutes.post("/gen-pdf", ensureAuthenticated, upload.none(), generatePdfController.handle)


export { accountRoutes }
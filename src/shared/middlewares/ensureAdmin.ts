import { AppError } from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";


export async function ensureAdmin(req: Request, res: Response, next: NextFunction) {

    if (!req.user.admin) {
        throw new AppError("Forbidden (admin only)", 403)
    }

    next()
}
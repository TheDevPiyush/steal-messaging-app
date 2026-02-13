import type { Request, Response, NextFunction } from "express";
import { throwError } from "../../middlewares/errorMiddleware";
import { generateSecureOTP } from "../../utils/generateOTP";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const sendVerificatonCode = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        next(throwError("Valid email is required", 400));
    }

    const verificationCode = generateSecureOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min window

    const [user] =
        await db
            .select()
            .from(users)
            .where(eq(users.email, email));

    if (!user) {

        const [newUser] =
            await db
                .insert(users)
                .values({
                    email: email,
                    loginOTP: verificationCode,
                    loginOTPExpiresAt: expiresAt
                })
                .returning()

        return res.json({
            success: true,
            message: "OTP Sent",
            data: newUser,
        })
    }

    const [updateUser] =
        await db
            .update(users)
            .set({
                loginOTP: verificationCode,
                loginOTPExpiresAt: expiresAt
            })
            .returning()

    if (updateUser) {
        return res.json({
            success: true,
            message: "OTP Sent",
            data: updateUser,
        })
    }

    next(throwError());
}


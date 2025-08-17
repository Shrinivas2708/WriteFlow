import { Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";



export const resendWebhookHandler = async (req : Request, res : Response) => {
  const event = req.body

  if (event.type === "email.bounced"){
    const bouncedEmail = event.data.to[0]
    try {
        await prisma.user.update({
       where:{
        email:bouncedEmail
       },
       data:{
        emailStatus : "INVALID",
        emailError : true,
        emailErrorMessage : event.data.bounce.message
       }
      
    })
    await prisma.invalidEmail.create({
      data:{
        email:bouncedEmail
      }
    })
    } catch (error) {
        throw new AppError(500 , `Error in resend webhook while setting up email status ${error}`)
    }
  }
  res.status(200).send("ok");
}
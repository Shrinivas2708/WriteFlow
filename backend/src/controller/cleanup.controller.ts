import { Request,Response } from "express";
import { prisma } from "..";

export const cleanupHandler = async (req:Request,res:Response)=>{

  try {
    const deadline = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

  const deleted = await prisma.user.deleteMany({
    where: {
      verified: false,
      emailStatus: "INVALID",
      lastEmailSentAt: {
        lt:deadline
      },
    },
  });

  console.log(`🧹 Deleted ${deleted.count} users with invalid email status`);
    res.status(200).send("Cleanup completed successfully.");
  } catch (err) {
    console.error("❌ Cron cleanup failed:", err);
    res.status(500).send("Internal Server Error");
  }
}
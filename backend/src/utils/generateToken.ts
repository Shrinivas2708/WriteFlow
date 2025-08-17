import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    {id:userId},
    process.env.JWT_SECRET_ACCESSTOKEN!,
    { expiresIn:  "15m" } 
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET_REFRESHTOKEN!,
    { expiresIn: "7d" } 
  );
};

export const generateEmailVerificationToken = (userId: string,ip : string,email:string) => {
    return jwt.sign(
        {   id: userId,
            ip : ip,
            email : email
        },
        process.env.EMAIL_VERIFICATION_SECRET!,
        {
            expiresIn: "30m"
        }
    )
}
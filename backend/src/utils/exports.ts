import { JwtPayload } from "jsonwebtoken";

export const ENV = process.env.NODE_ENV
export const VerificationEmailTemplate = (token : string, userId : string) : string =>  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #141414; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; margin: 0 auto; background-color: #1e1e1e; border: 2px solid #333; border-radius: 15px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);">
      <tr>
        <td align="center" style="padding: 40px 30px;">
          <a href="https://writeflow.shriii.xyz" target="_blank" style="text-decoration: none;">
            <img src="https://ik.imagekit.io/3ikmrta4w/logo%20(1).png" alt="WriteFlow Logo" width="100" height="100" style="display: block; margin-bottom: 20px;">
          </a>
          <h1 style="color: #ffffff; font-size: 28px; margin: 15px 0; font-weight: bold;">Verify Your Email</h1>
          <p style="color: #a0a0a3; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">Click the button below to verify your account and get started. Valid for 30mins only!!</p>
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <a href= ${ENV === "development" ? `http://localhost:5000/api/v1/auth/verify?token=${token}&id=${userId}` : `https://writeflow.shriii.xyz/verify?token=${token}&id=${userId}`}  target="_blank" style="display: inline-block; background-color: #ffd700; color: #000; padding: 14px 25px; text-decoration: none; font-weight: bold; font-size: 18px; border-radius: 10px;">Verify Email</a>
              </td>
            </tr>
          </table>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; border-top: 1px solid #333; padding-top: 25px;">
            <tr>
              <td align="center">
                <a href="https://writeflow.shriii.xyz" target="_blank" style="color: #888; text-decoration: none; font-weight: bold; font-size: 22px; margin: 0 15px;">WriteFlow</a>
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 15px 0;">
                  <tr>
                    <td align="center">
                      <a href="https://www.instagram.com/itzzz_shriii/" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/1384/1384063.png" alt="Instagram" width="22" style="display: inline-block;"></a>
                      <a href="https://www.linkedin.com/in/shrinivas-sherikar-a77980231/" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/1384/1384014.png" alt="LinkedIn" width="22" style="display: inline-block;"></a>
                      <a href="https://github.com/Shrinivas2708" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733553.png" alt="GitHub" width="22" style="display: inline-block;"></a>
                      <a href="https://x.com/ItzzzShri" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/24/3670/3670151.png" alt="X / Twitter" width="22" style="display: inline-block;"></a>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: #888; margin-top: 15px;">© 2024 FutureTech. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
export interface DecodedUser extends JwtPayload {
  id: string;
  email?: string;
  ip?:string
}
import { Request, Response } from "express";
import UserService, {
  generateTemporaryPassword,
} from "../services/userService";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/user";
import * as bcrypt from "bcrypt";
import { sendMessage, sendSignupEmail } from "../services/emailService";
import { getSocketInstance } from "../services/socketService";
const SECRET_KEY = process.env.SECRET_KEY;

export class UserController {
  private userService = new UserService();
  private io = getSocketInstance();

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await this.userService.findByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const accessToken = jwt.sign({ email, role: user.role }, SECRET_KEY, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign({ email }, SECRET_KEY, {
        expiresIn: "7d",
      });

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          domain: ".lbmsalpha.live",
          secure: true,
          maxAge: 1000 * 60 * 60 ,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          domain: ".lbmsalpha.live",
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .status(200)
        .json({ role: user.role });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async email(req: Request, res: Response) {
    const { email, role, name } = req.body;
    const socketId = req.params.socketId;

    try {
      if (name && role && email) {
        const tempToken = jwt.sign({ email, role }, SECRET_KEY, {
          expiresIn: "1h",
        });

        let user = await this.userService.findByEmail(email);
        const hashedToken = await bcrypt.hash(tempToken, 10);

        if (!user) {
          const newUser = new User();
          newUser.email = email;
          newUser.role = role;
          newUser.tempToken = hashedToken;

          const tempPassword = generateTemporaryPassword();
          newUser.password = await bcrypt.hash(tempPassword, 10);

          await this.userService.createUser(newUser);
        } else {
          if (user.verified) {
            res
              .status(200)
              .json({ message: "email already exists", isVerified: true });
            return;
          }
          user.tempToken = hashedToken;
          await this.userService.updateUser(user);
        }

        await sendSignupEmail(email, role, name, tempToken);
        res.status(200).json({
          message: "Signup link sent successfully",
          tempToken,
          isVerified: false,
        });
        sendMessage(this.io, socketId, "email_sent_successfully", email);
      } else {
        res.status(400).json({ error: "Invalid request parameters" });
        sendMessage(this.io, socketId, "email_sent_fail", email);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req: Request, res: Response) {
    const { password, token } = req.body;
    console.log("token", token, "password", password);
    try {
      const decodedToken: any = jwt.verify(token, SECRET_KEY);
      const curr_user = await this.userService.findByEmail(decodedToken.email);
      if (!curr_user || !(await curr_user.compareTempToken(token))) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.email = decodedToken.email;
      user.password = hashedPassword;
      user.tempToken = null;
      user.verified = true;

      await this.userService.createUser(user);
      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async register(req: Request, res: Response) {
    const { email, password, role } = req.body;
    try {
      const user: any = await this.userService.findByEmail(email);
      if (user && user.verified) {
        res
          .status(200)
          .json({ messege: "email already exists", isVerified: true });
        return;
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User();
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.role = "observer";
        newUser.verified = true;
        await this.userService.createUser(newUser);

        res.status(200).json({ message: "User created successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async logout(req: any, res: any) {
    try {
      res
        .clearCookie("accessToken", {
          httpOnly: true,
          domain: ".lbmsalpha.live",
          secure: true,
        })
        .clearCookie("refreshToken", {
          httpOnly: true,
          domain: ".lbmsalpha.live",
          secure: true,
        })
        .status(200)
        .json({ message: "User logged out successfully" });
      console.log("logout");
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: "Access denied. Token not provided." });
      return;
    }

    jwt.verify(refreshToken, SECRET_KEY, async (err: any, payload: any) => {
      if (err) {
        res.status(403).json({ error: "Invalid token." });
        return;
      }

      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        res.status(403).json({ error: "Invalid token." });
        return;
      }

      const accessToken = jwt.sign(
        { email: user.email, role: user.role },
        SECRET_KEY,
        {
          expiresIn: "5h",
        }
      );

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          domain: ".lbmsalpha.live",
          secure: true,
          maxAge: 1000 * 60,
        })
        .status(200)
        .json({ role: user.role });
    });
  }
  async verify(req: any, res: Response) {
    res
      .status(200)
      .json({ message: "User verified successfully", role: req.user.role });
  }
}

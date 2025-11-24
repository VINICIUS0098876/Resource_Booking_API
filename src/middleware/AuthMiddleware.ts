import type { Request, Response, NextFunction } from "express";
import { TokenJWT } from "./JWTMiddleware"; // aqui sim você importa do JWT

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token inválido" });

  const decoded = TokenJWT.verifyToken(token);

  if (!decoded || !decoded.id_user)
    return res.status(401).json({ message: "Token inválido" });

  req.userId = Number(decoded.id_user); // injeta o id do usuário
  req.userRole = decoded.role
  next();
}
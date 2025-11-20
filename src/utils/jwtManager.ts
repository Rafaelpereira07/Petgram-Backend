import jwt from "jsonwebtoken";

type JwtPayload = {
  id: string;
  username: string;
};

const SECRET_KEY = "123456absd";

export function createToken(payload: JwtPayload) {
  // Alterado para 24h, como você tinha no PHP
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
}

export function verifyToken(token: string): JwtPayload {
  // Isso irá lançar um erro se o token for inválido/expirado
  return jwt.verify(token, SECRET_KEY) as JwtPayload;
}

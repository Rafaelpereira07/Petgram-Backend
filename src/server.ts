import express from "express";
import jsonServer from "json-server";
import { authMiddleware } from "./middlewares/authMiddleware";

// --- Controladores de Autenticação e Usuário ---
import loginController from "./controllers/auth/loginController"; // POST /jwt-auth/v1/token
import meController from "./controllers/auth/meController"; // GET /api/user
import registerController from "./controllers/auth/registerController"; // POST /api/user
import validateTokenController from "./controllers/auth/validateTokenController"; // POST /jwt-auth/v1/token/validate

// --- Controladores de Rede Social (Fotos e Comentários) ---
import commentPostController from "./controllers/comments/commentPostController"; // POST /api/comment/:id
import photoCreateController from "./controllers/photos/photoCreateController"; // POST /api/photo
import photoDeleteController from "./controllers/photos/photoDeleteController"; // DELETE /api/photo/:id
import photoGetController from "./controllers/photos/photoGetController"; // GET /api/photo/

const databasePath = "db.json";
const server = jsonServer.create();
const router = jsonServer.router(databasePath);

server.use(jsonServer.defaults());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// --- 1. ROTAS PÚBLICAS E DE AUTENTICAÇÃO ---

// Login JWT (TOKEN_POST)
server.post("/jwt-auth/v1/token", loginController);

// Validação de Token (TOKEN_VALIDATE_POST)
server.post("/jwt-auth/v1/token/validate", validateTokenController);

// Registro de Usuário (USER_POST)
server.post("/api/user", registerController);

// --- 2. ROTAS PÚBLICAS (GET) ---

// Busca/Listagem de Fotos (PHOTOS_GET, PHOTOM_GET, PHOTO_GET)
server.get("/api/photo/:id", photoGetController);
server.get("/api/photo", photoGetController); 

// --- 3. MURO DE AUTENTICAÇÃO ---
server.use(authMiddleware);

// --- 4. ROTAS PROTEGIDAS ---

// Perfil do Usuário Logado (USER_GET)
server.get("/api/user", meController);

// Postar Foto (PHOTO_POST)
server.post("/api/photo", photoCreateController);

// Deletar Foto (PHOTO_DELETE)
server.delete("/api/photo/:id", photoDeleteController);

// Postar Comentário (COMMENT_POST)
// Nota: A rota do front usa o ID na URL, mas o body ainda precisa do content.
server.post("/api/comment/:id", commentPostController);

// --- 5. ROUTER PADRÃO DO JSON-SERVER ---
server.use(router);

server.listen(3000, () => {
  console.log("Petgram API running on port 3000!");
});

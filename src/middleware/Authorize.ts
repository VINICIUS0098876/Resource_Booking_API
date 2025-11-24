import { Response, NextFunction } from "express";
import { AuthRequest } from "./AuthMiddleware";

// Middleware para autorização baseado em papéis
export function authorize(allowedRoles: string[]){

    // Função middleware
    return (req: AuthRequest, res: Response, next: NextFunction)=>{

        // Pegamos a role que o AuthMiddleware salvou
        const userRole = req.userRole
        const userId = req.userId

        // Se não tiver logado (por segurança)
        if(!userId || !userRole){
            return res.status(401).json({message: 'Usuário não autenticado'})
        }

        //Verifica se a role do usuário está na lista de permitidas
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: "Acesso negado: Você não tem permissão para acessar este recurso." 
            });
        }
        // Se tudo estiver ok, chama o próximo middleware
        next();
}
}
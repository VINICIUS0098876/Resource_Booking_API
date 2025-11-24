// src/schemas/authSchema.ts
import { z } from 'zod';

// export const createUserSchema = z.object({
//     name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
//     email: z.string().email("Email inválido"),
//     password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
//     role: z.enum(["ADMIN", "ESTUDANTE"], { 
//       errorMap: () => ({ message: "Role deve ser ADMIN ou ESTUDANTE" }) 
//     })
//   });

export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  // O enum garante que só aceite ADMIN ou STUDENT
  role: z.enum(["ADMIN", "ESTUDANTE"]).optional(), 
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
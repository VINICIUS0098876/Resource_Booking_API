import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/AuthMiddleware";
import {
  ERROR_INVALID_CREDENTIALS,
  SUCCESS_CREATED_ITEM,
  SUCCESS_DELETED_ITEM,
  SUCCESS_LOGIN_ITEM,
  SUCCESS_UPDATED_ITEM,
} from "../utils/message";
import {
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_ID,
  ERROR_REQUIRED_FIELDS,
  ERROR_FORBIDDEN,
} from "../utils/message";
import {
  CreateUserService,
  DeleteUserService,
  GetUserByIdService,
  GetUserService,
  LoginUserService,
  UpdateUserService,
} from "../service/user";


export class CreateUserController{
    async handle(request: Request, response: Response){
        const {name, email, password, role} = request.body

        if(!name || !email || !password || !role){
            return response.status(400).json({...ERROR_REQUIRED_FIELDS})
        }

        try {
            const createUserService = new CreateUserService()

            const user = await createUserService.execute({name, email, password, role})

            return response.status(200).json({...SUCCESS_CREATED_ITEM, data: user})

        } catch (error) {
            console.log('Error creating user:', error)
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER });
        }
    }
}

export class UpdateUserController{
  async handle(request: AuthRequest, response: Response){
    const id_user = Number(request.params.id)
    const {name, email, password, role} = request.body

    if(isNaN(id_user) || !id_user || !name || !email || !password || !role){
      return response.status(400).json({ ...ERROR_REQUIRED_FIELDS })
    }

    if(!request.userId || request.userId !== id_user){
      return response.status(403).json({ ...ERROR_FORBIDDEN })
    }

    try {
      const updateUserService = new UpdateUserService()

      const user = await updateUserService.execute(id_user, {name, email, password, role})

      return response.status(200).json({ ...SUCCESS_UPDATED_ITEM, data: user })

    } catch (error) {
      console.log("Error updating user:", error);
      return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
    }
  }
}

export class DeleteUserController{
  async handle(request: AuthRequest, response: Response){
    const id_user = Number(request.params.id)

    if (isNaN(id_user) || !id_user) {
      return response.status(400).json({ ...ERROR_INVALID_ID });
    }

    if (!request.userId || request.userId !== id_user) {
      return response.status(403).json({ ...ERROR_FORBIDDEN });
    }

    try {
      const deleteUserService = new DeleteUserService()

      const user = await deleteUserService.execute(id_user)

      return response.status(200).json({ ...SUCCESS_DELETED_ITEM, data: user })

    } catch (error) {
      console.log("Error deleting user:", error);
      return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
    }
  }
}

export class GetUserController{
  async handle(request: Request, response: Response){
    try {
      const getUserService = new GetUserService()

      const user = await getUserService.execute()

      return response.status(200).json(user)

    } catch (error) {
      console.log("Error listing users:", error);
      return response.status(500).json({ error: "Internal server error" })
    }
  }
}

export class GetUserByIdController{
  async handle(request: AuthRequest, response: Response){
    const id_user = Number(request.params.id)

    if (isNaN(id_user) || !id_user) {
      return response.status(400).json({ ...ERROR_INVALID_ID });
    }

    try {
      const getUserByIdService = new GetUserByIdService()

      const user = await getUserByIdService.execute(id_user)

      if (!user) {
        return response.status(404).json({ ...ERROR_NOT_FOUND });
      }

      return response.status(200).json(user)
      
    } catch (error) {
      console.log("Error fetching user by ID:", error);
      return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
    }
  }
}

export class LoginUserController{
  async handle(request: Request, response: Response){
    const {email, password} = request.body

    if (!email || !password) {
      return response.status(400).json({ ...ERROR_REQUIRED_FIELDS });
    }

    try {
      const loginUserService = new LoginUserService()

      const user = await loginUserService.execute(email, password)

      return response.status(200).json({ ...SUCCESS_LOGIN_ITEM, Login: user })

    } catch (error) {
      error instanceof Error ? error.message : "Erro ao fazer login";
      return response.status(401).json({ ERROR_INVALID_CREDENTIALS });
    }
  }
}
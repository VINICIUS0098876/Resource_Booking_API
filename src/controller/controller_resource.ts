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
import { CreateResourceService, DeleteResourceService, GetByIdResourceService, GetResourceService, UpdateResourceService } from "../service/resource";


export class CreateResourceController{
    async handle(request: Request, response: Response){
        const {name, category, capacity, is_active} = request.body

        if(!name || !category || !capacity || !is_active){
            return response.status(400).json({ ...ERROR_REQUIRED_FIELDS });
        }

        try {
            const createResourceService = new CreateResourceService()

            const resource = await createResourceService.execute({name, category, capacity, is_active})

            return response.status(201).json({ ...SUCCESS_CREATED_ITEM, data: resource })

        } catch (error) {
            console.log("Error creating user:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
        }
    }
}

export class UpdateResourceController{
    async handle(request: AuthRequest, response: Response){
        const id_resource = Number(request.params.id)
        const {name, category, capacity, is_active} = request.body

        if (isNaN(id_resource) || !id_resource || !name || !category || !capacity || !is_active) {
            return response.status(400).json({ ...ERROR_REQUIRED_FIELDS });
          }


      try {
        const updateResourceService = new UpdateResourceService()

        const resource = await updateResourceService.execute(id_resource, {name, category, capacity, is_active})

        return response.status(200).json({ ...SUCCESS_UPDATED_ITEM, data: resource })

      } catch (error) {
        console.log("Error updating user:", error);
        return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
      }
    }
}

export class DeleteResourceController{
    async handle(request: AuthRequest, response: Response){
        const id_resource = Number(request.params.id)

        if (isNaN(id_resource) || !id_resource) {
            return response.status(400).json({ ...ERROR_INVALID_ID });
        }

        try {
            const deleteResourceService = new DeleteResourceService()

            const resource = await deleteResourceService.execute(id_resource)

            return response.status(200).json({ ...SUCCESS_DELETED_ITEM, data: resource })

        } catch (error) {
            console.log("Error deleting user:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
        }
    }
}

export class GetResourceController{
    async handle(request: AuthRequest, response: Response){
        try {
            const getResourceService = new GetResourceService()

            const resource = await getResourceService.execute()

            return response.status(200).json(resource);

        } catch (error) {
            console.log("Error listing users:", error);
            return response.status(500).json({ error: "Internal server error" })
        }
    }
}

export class GetByIdResourceController{
    async handle(request: AuthRequest, response: Response){
        const id_resource = Number(request.params.id)

        if (isNaN(id_resource) || !id_resource) {
            return response.status(400).json({ ...ERROR_INVALID_ID });
        }


        try {
            const getByIdResourceService = new GetByIdResourceService()

            const resource = await getByIdResourceService.execute(id_resource)

            if (!resource) {
                return response.status(404).json({ ...ERROR_NOT_FOUND });
            }

            return response.status(200).json(resource)

        } catch (error) {
            console.log("Error fetching user by ID:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER });
        }
    }
}
import prismaClient from '../prisma/prisma'
import { ERROR_INTERNAL_SERVER_DB, ERROR_INVALID_CREDENTIALS, ERROR_INVALID_ID, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS } from '../utils/message';


interface Resource{
    name: string,
    category: string,
    capacity: number,
    is_active: boolean
}

// Create Resource
type CreateResourceResult =
| Awaited<ReturnType<typeof prismaClient.resources.create>>
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INTERNAL_SERVER_DB

export class CreateResourceService {
    async execute({name, category, capacity, is_active}: Resource): Promise<CreateResourceResult>{
        try {
            if(!name || !category || !capacity || !is_active){
                return ERROR_REQUIRED_FIELDS
            }

            const resource = await prismaClient.resources.create({
                data: {
                    name,
                    category,
                    capacity,
                    is_active
                }
            })

            return resource

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Update Resource
type UpdateResourceResult = 
| Awaited<ReturnType<typeof prismaClient.resources.update>>
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INTERNAL_SERVER_DB

export class UpdateResourceService{
    async execute(id_resource: number, {name, category, capacity, is_active}: Resource): Promise<UpdateResourceResult>{
        if(!id_resource || !name || !category || !capacity || !is_active){
            return ERROR_REQUIRED_FIELDS
        }

        try {
            const resource = await prismaClient.resources.update({
                where: {
                    id_resource: id_resource
                },
                data: {
                    name,
                    category,
                    capacity,
                    is_active
                }
            })

            return resource

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Delete Resource
type DeletResourceResult =
| Awaited<ReturnType<typeof prismaClient.resources.delete>>
| typeof ERROR_INVALID_ID
| typeof ERROR_INTERNAL_SERVER_DB

export class DeleteResourceService{
    async execute(id_resource: number): Promise<DeletResourceResult>{
        if(!id_resource){
            return ERROR_INVALID_ID
        }

        try {
            const resource = await prismaClient.resources.delete({
                where: {
                    id_resource: id_resource
                }
            })

            return resource

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Get Resource
type GetResourceResult =
| Awaited<ReturnType<typeof prismaClient.resources.findMany>>
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB

export class GetResourceService{
    async execute(): Promise<GetResourceResult>{
        try {
            const resource = await prismaClient.resources.findMany()

            if(resource.length === 0){
                return ERROR_NOT_FOUND
            }

            return resource

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// GetById Resource
type GetByIdResourceResult =
| Awaited<ReturnType<typeof prismaClient.resources.findUnique>>
| typeof ERROR_INVALID_ID
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB

export class GetByIdResourceService{
    async execute(id_resource: number): Promise<GetByIdResourceResult>{
        if(!id_resource){
            return ERROR_INVALID_ID
        }

        try {
            const resource = await prismaClient.resources.findUnique({
                where: {
                    id_resource: id_resource
                }
            })

            return resource

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

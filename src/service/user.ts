import prismaClient from '../prisma/prisma'
import bcrypt from 'bcrypt'
import { ERROR_INTERNAL_SERVER_DB, ERROR_INVALID_CREDENTIALS, ERROR_INVALID_ID, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS } from '../utils/message';
// import { PrismaClient } from '../generated/prisma/client';
import { TokenJWT } from '../middleware/JWTMiddleware';


interface User{
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'ESTUDANTE';
}

// Create Users
type CreateUserResult = 
| Awaited<ReturnType<typeof prismaClient.users.create>>
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INTERNAL_SERVER_DB

export class CreateUserService {
    async execute({
        name,
        email,
        password,
        role
    }: User): Promise<CreateUserResult>{
        try {
            if(!name || !email || !password || !role){
                return ERROR_REQUIRED_FIELDS
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const user = await prismaClient.users.create({
                data: {
                    name,
                    email,
                    password: passwordHash,
                    role
                }
            })

            return user

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }

    
}

// Update Users
type UpdateUserResult =
| Awaited<ReturnType<typeof prismaClient.users.update>>
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INTERNAL_SERVER_DB

export class UpdateUserService {
    async execute(id_user: number, {name, email, password, role}: User): Promise<UpdateUserResult>{
        if(!id_user || !name || !password || !email || !role){
            return ERROR_INVALID_ID
        }

        const passwordHash = await bcrypt.hash(password, 10)
        try {
            
            const user = await prismaClient.users.update({
                where:{
                    id_user: id_user
                },
                data:{
                    name,
                    email,
                    password: passwordHash,
                    role
                }
            })

            return user

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Delete Users
type DeleteUserResult =
| Awaited<ReturnType<typeof prismaClient.users.delete>>
| typeof ERROR_INVALID_ID
| typeof ERROR_INTERNAL_SERVER_DB

export class DeleteUserService{
    async execute(id_user: number): Promise<DeleteUserResult>{
        if(!id_user){
            return ERROR_INVALID_ID
        }

        try {
            const user = await prismaClient.users.delete({
                where:{
                    id_user
                }
            })

            return user

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Get Users
type GetUserResult =
| Awaited<ReturnType<typeof prismaClient.users.findMany>>
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB

export class GetUserService {
    async execute(): Promise<GetUserResult>{
        try {
            const user = await prismaClient.users.findMany()

        if(user.length === 0){
            return ERROR_NOT_FOUND
        }

        return user

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB 
        }
    }
}

// GetById Users
type GetUserByIdResult =
| Awaited<ReturnType<typeof prismaClient.users.findUnique>>
| typeof ERROR_INVALID_ID
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB

export class GetUserByIdService {
    async execute(id_user: number): Promise<GetUserByIdResult>{
        if(!id_user){
            return ERROR_INVALID_ID
        }

        try {
            const user = await prismaClient.users.findUnique({
                where: {
                    id_user: id_user
                }
            })

            if(!user){
                return ERROR_NOT_FOUND
            }

            return user

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Login Users
type LoginUserResult =
| {
    user: {
        id_user: number,
        name: string,
        email: string,
        role: string
    },
    token: string
} 
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INVALID_ID
| typeof ERROR_INTERNAL_SERVER_DB

export class LoginUserService {
    async execute(email: string, password: string): Promise<LoginUserResult>{
        if(!email || !password){
            return ERROR_REQUIRED_FIELDS
        }

        try {
            const user = await prismaClient.users.findUnique({
                where: {
                    email: email
                }
            })

            if(!user){
                return ERROR_INVALID_CREDENTIALS
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if(!isPasswordValid){
                return ERROR_INVALID_CREDENTIALS
            }

            const userRole = user.role || 'ESTUDANTE';

            const token = TokenJWT.generateToken({id_user: user.id_user, role: userRole})

            return {
                user: {
                    id_user: user.id_user,
                    name: user.name,
                    email: user.email,
                    role: userRole
                },
                token
            }

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

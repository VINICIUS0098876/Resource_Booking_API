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
import { CreateBookingService, DeleteBookingService, GetBookingService, GetByIdBookingService, UpdateBookingService } from "../service/booking";


export class CreateBookingController{
    async handle(request: AuthRequest, response: Response){
        const {id_user, id_resource, start_date_time, end_date_time, status} = request.body

        if(!id_user || !id_resource || !start_date_time || !end_date_time || !status){
            return response.status(400).json({ ...ERROR_REQUIRED_FIELDS });
        }

        if (!request.userId) {
            return response.status(401).json({ message: "Usuário não autenticado" });
        }

        try {
            const createBookingService = new CreateBookingService()

            const booking = await createBookingService.execute({id_user, id_resource, start_date_time, end_date_time, status})
        
            if (booking && typeof booking === 'object' && 'status' in booking && booking.status === false) {
                return response.status(booking.status_code).json(booking);
           }

            return response.status(201).json({ ...SUCCESS_CREATED_ITEM, data: booking });

        } catch (error) {
            console.log("Error creating product:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER });
        }
    }
}

export class UpdateBookingController{
    async handle(request: AuthRequest, response: Response){
        const id_booking = Number(request.params.id)

        const {id_user, id_resource, start_date_time, end_date_time, status} = request.body

        if (isNaN(id_user) || !id_user || isNaN(id_resource) || !id_resource || !start_date_time || !end_date_time || !status) {
            return response.status(400).json({ ...ERROR_REQUIRED_FIELDS });
        }

        if (!request.userId) {
            return response.status(401).json({ message: "Usuário não autenticado" });
        }

        try {
            const updateBookingService = new UpdateBookingService()

            const booking = await updateBookingService.execute(id_booking, {id_user, id_resource, start_date_time, end_date_time, status})

            if (booking && typeof booking === 'object' && 'status' in booking && booking.status === false) {
                return response.status((booking as any).status_code).json(booking);
            }

            return response.status(201).json({ ...SUCCESS_UPDATED_ITEM, data: booking })

        } catch (error) {
            console.log("Error updating product:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
        }

    }
}

export class DeleteBookingController{
    async handle(request: AuthRequest, response: Response){
        const id_booking = Number(request.params.id)

        if (isNaN(id_booking) || !id_booking) {
            return response.status(400).json({ ...ERROR_INVALID_ID });
        }

        if (!request.userId) {
            return response.status(401).json({ message: "Usuário não autenticado" });
        }

        try {
            const deleteBookingService = new DeleteBookingService()

            const booking = await deleteBookingService.execute(id_booking)

            return response.status(200).json({ ...SUCCESS_DELETED_ITEM, data: booking })

        } catch (error) {
            console.log("Error deleting product:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
        }
    }
}

export class GetBookingController{
    async handle(request: AuthRequest, response: Response){
        try {
            // Pegamos o role e o id injetados pelo AuthMiddleware
            const { userRole, userId } = request;

            const getBookingService = new GetBookingService();

            let booking;

            if (userRole === 'ADMIN') {
                // Se for ADMIN, chama o service sem parâmetros (traz tudo)
                booking = await getBookingService.execute();
            } else {
                // Se for ESTUDANTE, chama passando o ID dele (filtra os dele)
                // O userId é garantido pelo middleware, mas o TypeScript pode reclamar, então forçamos Number
                booking = await getBookingService.execute(Number(userId));
            }

            // Tratamento de erro (caso não tenha nenhum agendamento)
            if (booking && 'status' in booking && booking.status === false) {
                
                return response.status((booking as any).status_code).json(booking);
            }

            return response.status(200).json(booking);

        } catch (error) {
            console.log("Error listing products:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER });
        }
    }
}

export class GetByIdBookingController{
    async handle(request: AuthRequest, response: Response){
        const id_booking = Number(request.params.id)

        if (isNaN(id_booking) || !id_booking) {
            return response.status(400).json({ ...ERROR_INVALID_ID });
        }
      
          if (!request.userId) {
            return response.status(401).json({ message: "Usuário não autenticado" });
        }

        try {
            const getByIdBookingService = new GetByIdBookingService()

            const booking = await getByIdBookingService.execute(id_booking)

            return response.status(200).json(booking);

        } catch (error) {
            console.log("Error fetching product by ID:", error);
            return response.status(500).json({ ...ERROR_INTERNAL_SERVER })
        }

    }
}
import prismaClient from '../prisma/prisma'
import { ERROR_CONFLICT, ERROR_DATE_INVALID, ERROR_INTERNAL_SERVER_DB, ERROR_INVALID_ID, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS, ERROR_RESOURCE_INACTIVE } from '../utils/message';

interface Booking{
    id_user: number,
    id_resource: number,
    start_date_time: string,
    end_date_time: string
    status: 'CONFIRMADO' | 'CANCELADO'
}

// Create Booking
type CreateBookingResult =
| Awaited<ReturnType<typeof prismaClient.bookings.create>>
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INTERNAL_SERVER_DB

export class CreateBookingService{
    async execute({id_user, id_resource, start_date_time, end_date_time, status}: Booking): Promise<CreateBookingResult>{
        if(!id_resource || !id_user || !start_date_time || !end_date_time || !status){
            return ERROR_REQUIRED_FIELDS
        }

        try {

            const start = new Date(start_date_time)
            const end = new Date(end_date_time)

            if(end <= start){
                return ERROR_DATE_INVALID
            }

            const resource = await prismaClient.resources.findUnique({
                where: {
                    id_resource: id_resource
                }
            })

            if(!resource){
                return ERROR_NOT_FOUND
            }

            if(!resource.is_active){
                return ERROR_RESOURCE_INACTIVE
            }

            // "Procure no banco se existe ALGUMA reserva para esta sala..."
            const conflictingBooking = await prismaClient.bookings.findFirst({
                where: {
                    id_resource: id_resource,
                    status: 'CONFIRMADO', // Ignora cancelados
                    AND: [
                        {
                            // ...onde a reserva existente comece ANTES do meu fim
                            start_date_time: {
                                lt: end // lt = Less Than (menor que)
                            }
                        },
                        {
                            // ...E a reserva existente termine DEPOIS do meu início
                            end_date_time: {
                                gt: start // gt = Greater Than (maior que)
                            }
                        }
                    ]
                }
            })

            if(conflictingBooking){
                return ERROR_CONFLICT
            }

            const booking = await prismaClient.bookings.create({
                data: {
                    id_user: id_user,
                    id_resource: id_resource,
                    start_date_time: start_date_time,
                    end_date_time: end_date_time,
                    status: status
                }
            })

            return booking

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Update Booking
type UpdateBookingResult = 
| Awaited<ReturnType<typeof prismaClient.bookings.update>>
| typeof ERROR_REQUIRED_FIELDS
| typeof ERROR_INTERNAL_SERVER_DB

export class UpdateBookingService{
    async execute(
        id_booking: number,
        {id_user, id_resource, start_date_time, end_date_time, status}: Booking
    ): Promise<UpdateBookingResult> {
        if(
            !id_booking ||
            !id_user ||
            !id_resource ||
            !start_date_time ||
            !end_date_time ||
            !status
        ) {
            return ERROR_REQUIRED_FIELDS
        }

        try {

            const start = new Date(start_date_time)
            const end = new Date(end_date_time)

            if(end <= start){
                return ERROR_DATE_INVALID
            }

            // "Procure no banco se existe ALGUMA reserva para esta sala..."
            const conflictingBooking = await prismaClient.bookings.findFirst({
                where: {
                    id_resource: id_resource,
                    status: 'CONFIRMADO', // Ignora cancelados
                    id_booking: {
                        not: id_booking // <--- CRUCIAL: Ignora a própria reserva que está sendo editada
                    },
                    AND: [
                        {
                            // ...onde a reserva existente comece ANTES do meu fim
                            start_date_time: {
                                lt: end // lt = Less Than (menor que)
                            }
                        },
                        {
                            // ...E a reserva existente termine DEPOIS do meu início
                            end_date_time: {
                                gt: start // gt = Greater Than (maior que)
                            }
                        }
                    ]
                }
            })

            if(conflictingBooking){
                return ERROR_CONFLICT
            }


            const booking = await prismaClient.bookings.update({
                where: {
                    id_booking: id_booking
                },
                data: {
                    id_user: id_user,
                    id_resource: id_resource,
                    start_date_time: start_date_time,
                    end_date_time: end_date_time,
                    status: status
                }
            })

            return booking

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Delete Booking
type DeleteBookingResult = 
| Awaited<ReturnType<typeof prismaClient.bookings.delete>>
| typeof ERROR_INVALID_ID
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB

export class DeleteBookingService{
    async execute(id_booking: number): Promise<DeleteBookingResult>{
        if(!id_booking){
            return ERROR_INVALID_ID
        }

        try {
            const booking = await prismaClient.bookings.delete({
                where: {
                    id_booking: id_booking
                }
            })

            return booking

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// Get Booking
type GetBookingResult = 
| Awaited<ReturnType<typeof prismaClient.bookings.findMany>>
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB

export class GetBookingService{
    async execute(id_user?: number): Promise<GetBookingResult>{
        try {
            let booking;

            if (id_user) {
                // Se veio ID (é estudante), busca só os dele
                booking = await prismaClient.bookings.findMany({
                    where: {
                        id_user: id_user
                    }
                });
            } else {
                // Se NÃO veio ID (é admin), busca tudo
                booking = await prismaClient.bookings.findMany();
            }

            if(booking.length === 0){
                return ERROR_NOT_FOUND
            }

            return booking
        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}

// GetById Booking
type GetByIdBookingResult = 
| Awaited<ReturnType<typeof prismaClient.bookings.findUnique>>
| typeof ERROR_INVALID_ID
| typeof ERROR_NOT_FOUND
| typeof ERROR_INTERNAL_SERVER_DB

export class GetByIdBookingService{
    async execute(id_booking: number): Promise<GetByIdBookingResult>{
        if(!id_booking){
            return ERROR_INVALID_ID
        }

        try {
            const booking = await prismaClient.bookings.findUnique({
                where: {
                    id_booking: id_booking
                }
            })

            return booking

        } catch (error) {
            console.log(ERROR_INTERNAL_SERVER_DB, error)
            return ERROR_INTERNAL_SERVER_DB
        }
    }
}
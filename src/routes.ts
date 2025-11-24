import { Router, type Request, type Response } from "express";
import { CreateUserController, DeleteUserController, GetUserByIdController, GetUserController, LoginUserController, UpdateUserController } from "./controller/controller_user";
import { authMiddleware } from "./middleware/AuthMiddleware";
import { authorize } from "./middleware/Authorize";
import { CreateBookingController, DeleteBookingController, GetBookingController, GetByIdBookingController, UpdateBookingController } from "./controller/controller_booking";
import { CreateResourceController, DeleteResourceController, GetByIdResourceController, GetResourceController, UpdateResourceController } from "./controller/controller_resource";

const router = Router();

// Users routes
router.post("/user", async (request: Request, response: Response) =>
    new CreateUserController().handle(request, response)
);
  
router.put("/user/:id", authMiddleware, async (request, response) =>
    new UpdateUserController().handle(request, response)
);
  
router.get("/user/:id", authMiddleware, async (request, response) =>
    new GetUserByIdController().handle(request, response)
);

router.delete("/user/:id", authMiddleware, async (request, response) =>
    new DeleteUserController().handle(request, response)
);
  
router.get("/user", async (request, response) =>
    new GetUserController().handle(request, response)
);
   
router.post("/login", async (request: Request, response: Response) =>
    new LoginUserController().handle(request, response)
  );

// Resources routes
router.post("/resource", authMiddleware, authorize(['ADMIN']), async (request: Request, response: Response) =>
    new CreateResourceController().handle(request, response)
);
  
router.put("/resource/:id", authMiddleware, authorize(['ADMIN']), async (request, response) =>
    new UpdateResourceController().handle(request, response)
);
  
router.delete("/resource/:id", authMiddleware, authorize(['ADMIN']), async (request, response) =>
    new DeleteResourceController().handle(request, response)
);

router.get("/resource/:id", authMiddleware, async (request, response) =>
    new GetByIdResourceController().handle(request, response)
);
  
router.get("/resource", authMiddleware, async (request, response) =>
    new GetResourceController().handle(request, response)
);
  
// Bookings routes
router.post("/booking", authMiddleware, async (request: Request, response: Response) =>
    new CreateBookingController().handle(request, response)
);
  
router.put("/booking/:id", authMiddleware, authorize(['ADMIN']), async (request, response) =>
    new UpdateBookingController().handle(request, response)
);
  
router.delete("/booking/:id", authMiddleware, authorize(['ADMIN', 'ESTUDANTE']), async (request, response) =>
    new DeleteBookingController().handle(request, response)
);

router.get("/booking/:id", authMiddleware, async (request, response) =>
    new GetByIdBookingController().handle(request, response)
);
  
router.get("/booking", authMiddleware, authorize(['ADMIN', 'ESTUDANTE']), async (request, response) =>
    new GetBookingController().handle(request, response)
);

export default router;

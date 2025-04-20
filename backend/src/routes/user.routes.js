import { Router } from "express";
import { register, getAllUsers ,loginUser ,updateUserProfile } from "../controllers/user.controller.js";
import  upload  from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    register)

router.route("/all").get(getAllUsers);

import { getUserById } from "../controllers/user.controller.js";

router.route("/:id").get(getUserById);

router.post("/login", loginUser);

router.put('/update/:id', updateUserProfile);

export default router;
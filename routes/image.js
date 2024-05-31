import express from "express";

import { generateImage, editImageUsingImage, detailEditImageUsingImage } from "../controllers/imageController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();


router.post("/generate", generateImage);
router.post("/edit",upload ,editImageUsingImage );
router.post("/edit-detail",upload ,detailEditImageUsingImage );

export { router as imageRouter };

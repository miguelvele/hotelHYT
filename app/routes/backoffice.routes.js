import { Router } from "express";

const router = Router();

router.get("/back",(req, res) => {
    // res.render("backOffice");
    res.redirect("index");
});

export default router;
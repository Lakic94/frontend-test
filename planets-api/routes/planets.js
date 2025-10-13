const express = require("express");
const Multer = require("multer");

const {
    postAddPlanet,
    putUpdatePlanet,
    getReloadPlanets,
    getPlanet,
    deletePlanet,
    getPlanets,
} = require("../controllers/planets");

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const router = express.Router();

router.get("/", getPlanets);

router.post("/", multer.single("file"), postAddPlanet);

router.put("/:id", multer.single("file"), putUpdatePlanet);

router.get("/reload", getReloadPlanets);

router.get("/:id", getPlanet);

router.delete("/:id", deletePlanet);

exports.router = router;

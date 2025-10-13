const path = require("path");
const fs = require("fs");

const dataFileName = "planets.json";

const planetsDataPath = path.join(__dirname, dataFileName);
let planets = [];

exports.getImage = (id) => {
    let planet = this.getPlanet(id);
    if (planet) {
        return planet.imageName;
    }

    return null;
};

exports.getPlanets = () => [...planets];
exports.addPlanet = (planet) => {
    planet.id = generateId() + 1;

    planets.push(Object.assign({}, planet));
};

exports.updatePlanet = (id, planet) => {
    let planetIndex = planets.findIndex((p) => p.id == id);

    planets[planetIndex] = planet;
};

exports.planetExists = (id) => planets.findIndex((p) => p.id == id) !== -1;

exports.reloadPlanets = (onPlanetsReloaded) => {
    fs.readFile(planetsDataPath, "utf8", (err, data) => {
        if (err) {
            planets = [];
        } else {
            planets = [...JSON.parse(data)];
        }

        onPlanetsReloaded(planets);
    });
};

exports.getPlanet = (id) => planets.find((p) => p.id == id);

exports.deletePlanet = (id) => {
    let planetIndex = planets.findIndex((p) => p.id == id);
    if (planetIndex !== -1) {
        return planets.splice(planetIndex, 1);
    }

    return null;
};

const generateId = () =>
    planets.reduce((a, b) => Math.max(a, Number.parseInt(b.id)), 0);

const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


async function readAnimals() {
    const filePath = path.join(__dirname, "data", "loomad.json");
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
}

// Avaleht - viimased 4 lisatud looma
app.get("/", async (req, res, next) => {
    try {
        const animals = await readAnimals();
        const latest4 = animals.slice(-4).reverse();
        res.render("index", { title: "Avaleht", animals: latest4, active: "home" });
    } catch (err) {
        next(err);
    }
});

app.get("/loomad", async (req, res, next) => {
    try {
        const animals = await readAnimals();
        res.render("animals", { title: "Loomad", animals, active: "animals" });
    } catch (err) {
        next(err);
    }
});

app.get("/meist", (req, res) => {
    res.render("about", { title: "Meist", active: "about" });
});

app.get("/kontakt", (req, res) => {
    res.render("contact", { title: "Kontakt", active: "contact" });
});

app.use((req, res) => {
    res.status(404).render("404", { title: "404 - Ei leitud", active: "" });
});

app.listen(PORT, () => {
    console.log(`Server töötab: http://localhost:${PORT}`);
});

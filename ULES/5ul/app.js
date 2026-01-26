require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const { getUserByUsername } = require("./database");
const { requireLogin, bypassLogin } = require("./middleware");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
        },
    })
);

app.get("/login", bypassLogin, (req, res) => {
    res.render("login", {
        title: "Logi sisse",
        msg: req.query.msg === "login_failed" ? "Vale kasutajanimi või parool" : null,
        errors: [],
    });
});

app.post(
    "/login",
    body("username").trim().notEmpty().withMessage("Kasutajanimi on kohustuslik"),
    body("password").trim().notEmpty().withMessage("Parool on kohustuslik"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("login", {
                title: "Logi sisse",
                msg: "Väljad on kohustuslikud",
                errors: errors.array(),
            });
        }

        const { username, password } = req.body;

        try {
            const user = await getUserByUsername(username);
            if (!user) return res.redirect("/login?msg=login_failed");

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.redirect("/login?msg=login_failed");

            req.session.user = { id: user.id, role: user.role };

            return res.redirect("/admin?msg=login_success");
        } catch (e) {
            return res.render("login", {
                title: "Logi sisse",
                msg: "Sisselogimine ebaõnnestus",
                errors: [],
            });
        }
    }
);

app.get("/admin", requireLogin, (req, res) => {
    res.render("admin", {
        title: "Admin leht",
        msg: req.query.msg === "login_success" ? "Olete edukalt sisse logitud" : null,
    });
});

app.get("/logout", requireLogin, (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
});

app.use((req, res) => {
    res.status(404).render("404", { title: "Lehte ei leitud" });
});

app.listen(3000, () => {
    console.log("Server töötab: http://localhost:3000");
});

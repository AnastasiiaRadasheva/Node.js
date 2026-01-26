require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const app = express();
const {
    getNews,
    getNewsById,
    createNews,
    updateNewsById,
    deleteNewsById,
    getUserByUsername
} = require("./database");

const { requireLogin, bypassLogin } = require("./middleware");

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
            console.error("LOGIN ERROR:", e);
            return res.render("login", {
                title: "Logi sisse",
                msg: "Sisselogimine ebaõnnestus",
                errors: [],
            });
        }

    }
);

app.get("/logout", requireLogin, (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
});

app.get("/", async (req, res) => {
    const news = await getNews();
    const msg = req.query.msg || "";

    res.render("index", {
        title: "Avaleht",
        news,
        msg,
        user: req.session.user || null,
    });
});

app.get("/admin", requireLogin, (req, res) => {
    res.render("admin", {
        title: "Admin leht",
        msg: req.query.msg === "login_success" ? "Olete edukalt sisse logitud" : null,
        user: req.session.user,
    });
});

app.get("/news/create", requireLogin, (req, res) => {
    res.render("news_create", {
        title: "Lisa uudis",
        errors: [],
        formData: { title: "", content: "" },
    });
});

app.post("/news/create", requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const errors = [];
    if (!title || title.trim() === "") errors.push("Pealkiri on kohustuslik");
    if (!content || content.trim() === "") errors.push("Sisu on kohustuslik");

    if (errors.length > 0) {
        return res.render("news_create", {
            title: "Lisa uudis",
            errors,
            formData: { title, content },
        });
    }

    await createNews(title.trim(), content.trim());
    res.redirect("/?msg=created");
});

app.get("/news/edit/:id", requireLogin, async (req, res) => {
    const id = req.params.id;
    const news = await getNewsById(id);

    if (!news) {
        return res.status(404).render("404", { title: "Lehte ei leitud" });
    }

    res.render("news_edit", {
        title: "Muuda uudist",
        errors: [],
        news,
    });
});

app.post("/news/edit/:id", requireLogin, async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    const errors = [];
    if (!title || title.trim() === "") errors.push("Pealkiri on kohustuslik");
    if (!content || content.trim() === "") errors.push("Sisu on kohustuslik");

    if (errors.length > 0) {
        return res.render("news_edit", {
            title: "Muuda uudist",
            errors,
            news: { id, title, content },
        });
    }

    await updateNewsById(id, title.trim(), content.trim());
    res.redirect("/?msg=updated");
});

app.get("/news/:id", async (req, res) => {
    const id = req.params.id;
    const news = await getNewsById(id);

    if (!news) {
        return res.status(404).render("404", { title: "Lehte ei leitud" });
    }

    res.render("news", { title: news.title, news });
});

app.post("/news/delete", requireLogin, async (req, res) => {
    const { id } = req.body;
    await deleteNewsById(id);
    res.redirect("/?msg=deleted");
});

app.use((req, res) => {
    res.status(404).render("404", { title: "Lehte ei leitud" });
});

app.listen(3000, () => {
    console.log("Server töötab: http://localhost:3000");
});

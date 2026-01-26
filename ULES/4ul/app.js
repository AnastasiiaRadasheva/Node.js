require("dotenv").config();

const express = require("express");
const app = express();

const {
    getNews,
    getNewsById,
    createNews,
    updateNewsById,
    deleteNewsById
} = require("./database");

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// HOME
app.get("/", async (req, res) => {
    const news = await getNews();
    const msg = req.query.msg || "";
    const type = req.query.type || "";

    res.render("index", { title: "Avaleht", news, msg, type });
});

// CREATE FORM
app.get("/news/create", (req, res) => {
    res.render("news_create", {
        title: "Lisa uudis",
        errors: [],
        formData: { title: "", content: "" }
    });
});

// CREATE POST
app.post("/news/create", async (req, res) => {
    const { title, content } = req.body;

    const errors = [];
    if (!title || title.trim() === "") errors.push("Pealkiri on kohustuslik");
    if (!content || content.trim() === "") errors.push("Sisu on kohustuslik");

    if (errors.length > 0) {
        res.render("news_create", {
            title: "Lisa uudis",
            errors,
            formData: { title, content }
        });
        return;
    }

    const result = await createNews(title, content);

    if (result.affectedRows === 1) {
        res.redirect("/?msg=Uudis lisatud&type=success");
    } else {
        res.redirect("/?msg=Viga&type=danger");
    }
});

// DETAIL
app.get("/news/:id", async (req, res) => {
    const news = await getNewsById(req.params.id);

    if (!news) {
        res.status(404).render("404", { title: "404" });
        return;
    }

    const msg = req.query.msg || "";
    const type = req.query.type || "";

    res.render("news", { title: news.title, news, msg, type });
});

// EDIT FORM
app.get("/news/edit/:id", async (req, res) => {
    const news = await getNewsById(req.params.id);
    res.render("news_edit", { title: "Muuda", errors: [], news });
});

// EDIT POST
app.post("/news/edit/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = req.params.id;

    const errors = [];
    if (!title) errors.push("Pealkiri on kohustuslik");
    if (!content) errors.push("Sisu on kohustuslik");

    if (errors.length) {
        res.render("news_edit", {
            title: "Muuda",
            errors,
            news: { id, title, content }
        });
        return;
    }

    await updateNewsById(id, title, content);
    res.redirect(`/news/${id}?msg=Muudetud&type=success`);
});

// DELETE
app.post("/news/delete", async (req, res) => {
    const result = await deleteNewsById(req.body.id);

    if (result.affectedRows === 1) {
        res.redirect("/?msg=Kustutatud&type=success");
    } else {
        res.redirect("/?msg=Viga&type=danger");
    }
});

// 404
app.use((req, res) => {
    res.status(404).render("404", { title: "404" });
});

app.listen(3000, () => {
    console.log("Server töötab: http://localhost:3000");
});

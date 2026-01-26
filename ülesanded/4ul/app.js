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

app.get("/", async (req, res) => {
    const news = await getNews();
    const msg = req.query.msg || "";
    const type = req.query.type || "";
    res.render("index", { title: "Avaleht", news, msg, type });
});


app.get("/news/create", (req, res) => {
    res.render("news_create", {
        title: "Lisa uudis",
        errors: [],
        formData: { title: "", content: "" }
    });
});


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

    const result = await createNews(title.trim(), content.trim());

    if (result.affectedRows === 1) {
        res.redirect("/?msg=Uudis lisatud&type=success");
    } else {
        res.redirect("/?msg=Viga&type=danger");
    }
});


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


app.get("/news/edit/:id", async (req, res) => {
    const news = await getNewsById(req.params.id);

    if (!news) {
        res.status(404).render("404", { title: "404" });
        return;
    }

    res.render("news_edit", { title: "Muuda", errors: [], news });
});


app.post("/news/edit/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = req.params.id;

    const errors = [];
    if (!title || title.trim() === "") errors.push("Pealkiri on kohustuslik");
    if (!content || content.trim() === "") errors.push("Sisu on kohustuslik");

    if (errors.length > 0) {
        res.render("news_edit", {
            title: "Muuda",
            errors,
            news: { id, title, content }
        });
        return;
    }

    const result = await updateNewsById(id, title.trim(), content.trim());

    if (result.affectedRows === 1) {
        res.redirect(`/news/${id}?msg=Muudetud&type=success`);
    } else {
        res.redirect(`/news/${id}?msg=Viga&type=danger`);
    }
});


app.post("/news/delete", async (req, res) => {
    const result = await deleteNewsById(req.body.id);

    if (result.affectedRows === 1) {
        res.redirect("/?msg=Kustutatud&type=success");
    } else {
        res.redirect("/?msg=Viga&type=danger");
    }
});


app.use((req, res) => {
    res.status(404).render("404", { title: "404" });
});

app.listen(3000, () => {
    console.log("Server töötab: http://localhost:3000");
});

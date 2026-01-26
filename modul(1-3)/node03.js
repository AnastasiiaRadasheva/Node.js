const express = require('express')
const app = express()
/*
//html failide teenindamine
app.get('/', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname })
})
app.get('/teenused', (req, res) => {
    res.sendFile('./views/teenused.html', { root: __dirname })
})

//ümber suunamine
app.get('/vana-leht', (req, res) => {
    res.redirect('/')
})

//404 lehe teenindamine
app.use((req, res) => {
    res.status(404).sendFile('./views/404.html', { root: __dirname });
});

//serveri käivitamine
app.listen(3000);
*/
//html failide teenindamine
app.get('/', (req, res) => {
    const uudised = [
        {
            pealkiri: "Uus veebileht avatud",
            sisu: "Meie uus veebileht on nüüd avalik ja kasutajatele kättesaadav."
        },{
            pealkiri: "Lisandus kontaktivorm",
            sisu: "Kontaktilehele lisati vorm, mille kaudu saab meiega kiiresti ühendust võtta."
        },{
            pealkiri: "Bootstrap 5 kasutusel",
            sisu: "Lehe kujundus põhineb Bootstrap 5 raamistikul, mis tagab mobiilisõbraliku vaate."
        },{
            pealkiri: "Serveripoolne renderdamine",
            sisu: "Rakendus kasutab EJS vaatemootorit serveripoolseks HTML-i genereerimiseks."
        },{
            pealkiri: "Õppeprojekt valmimas",
            sisu: "Projekt on loodud õppematerjalina, et tutvustada Node.js ja Expressi põhitõdesid."
        }
    ];

    res.render('index', { title: 'Avaleht', uudised: uudised })
})
const express = require('express')
const app = express()

//vaate mootori seadistamine
app.set('view engine', 'ejs')

//html failide teenindamine
app.get('/', (req, res) => {
    res.render('index', { title: 'Avaleht' })
})
app.get('/meist', (req, res) => {
    res.render('meist')
})

app.get('/kontakt', (req, res) => {
    res.render('kontakt')
})

//404 lehe teenindamine
app.use((req, res) => {
    res.status(404).render('404');
});


app.listen(3000);
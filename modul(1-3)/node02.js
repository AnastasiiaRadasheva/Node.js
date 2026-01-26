/*const fs = require("fs");

fs.readFile("./assets/tekst.txt", "utf-8", (err, data) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log(data);
});

const fs = require("fs");

fs.appendFile("./assets/tekst.txt", "\nSee on lisatud tekst", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Faili on lisatud tekst");
});
*/

const fs = require("fs");
//kausta loomine
fs.mkdir("./newfolder", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Kaust loodud");
});

//kausta kustutamine
fs.rmdir("./newfolder", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Kaust kustutatud");
});


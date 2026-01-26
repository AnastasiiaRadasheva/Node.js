console.log("Tere maailm!");

/*const tervitus = (nimi) => {
    return "Tere " + nimi;
};
*/
const tervitus = nimi => "Tere " + nimi;

const nimi = "Mari";
console.log(`Tere ${nimi}!`);




const config = {
    host: "localhost",
    user: "root",
    password: "secret"
};

const { host, user } = config;

const [esimene, teine] = ["a", "b", "c"];

//Asünkroonne süntaks (async ja await)

const loeFail = async () => {
    const sisu = await fs.promises.readFile("test.txt", "utf8");
    console.log(sisu);
};

//Vigade käsitlemine
try {
    teeMidagi();
} catch (error) {
    console.error(error.message);
}
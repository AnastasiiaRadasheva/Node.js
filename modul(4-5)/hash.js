const bcrypt = require('bcrypt');

(async () => {
    const password = 'test123';
    const hash = await bcrypt.hash(password, 10);

    console.log('Parool:', password);
    console.log('Räsi:', hash);

    const match = await bcrypt.compare(password, hash);
    console.log('Võrdlus:', match);
})();
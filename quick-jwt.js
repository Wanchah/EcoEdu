// quick-jwt.js
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: '691452ac0dec61764d93ff40' }, 'Plmokn-Qazwsx', { expiresIn: '7d' });
console.log(token);
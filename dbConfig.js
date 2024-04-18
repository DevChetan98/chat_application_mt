const { Sequelize } = require('sequelize')
const sequelize = new Sequelize("chat_application", "root", '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})
try {
    sequelize.authenticate()
    console.log('Database connected successfully');
} catch (error) {
    console.log(error);
}
module.exports = sequelize;
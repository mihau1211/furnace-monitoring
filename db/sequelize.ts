import { Sequelize } from 'sequelize';

const database = process.env.PSQL_DATABASE ? process.env.PSQL_DATABASE : 'database';
const username = process.env.PSQL_USERNAME ? process.env.PSQL_USERNAME : 'username';
const password = process.env.PSQL_PASSWORD ? process.env.PSQL_PASSWORD : 'password';

const sequelize = new Sequelize(database, username, password, {
  host: 'localhost',
  dialect: 'postgres'
});

export default sequelize;

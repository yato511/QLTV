const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);

module.exports = function (app) {
  app.set('trust proxy', 1) // trust first proxy
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }

    store: new MySQLStore({
      connectionLimit: 100,
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '183461',
      database: 'library',
      charset: 'utf8',
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }
    }),
  }))
};
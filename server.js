const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('uncaughtException');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1); //Exit The Server
  });
});

// console.log(app.get('env'));
// console.log(process.env);
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// this for connecting atls db
mongoose.connect(DB).then((con) => {
  // console.log(con.connections);
  console.log('database connected successful');
});
// .catch((err) => {console.log("bad cinnnnnnnnnnnnnnnnnnn")});

// to connect local db
//mongoose.connect(process.env.DATABASE_LOCAL {useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false,}).then((con)=>{console.log(con.connections)});

const port = process.env.PORT || 3000;
// Start The server
const server = app.listen(port, () => {
  console.log(`Server Is Running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1); //Exit The Server
  });
});

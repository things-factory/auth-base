module.exports = {
  ormconfig: {
    name: 'default',
    type: 'postgres',
    database: 'opa-app',
    username: 'postgres',
    password: '1',
    host: 'localhost',
    port: 5432,
    synchronize: true,
    logging: true
  },
  email: {
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'no-reply@hatiolab.com', // generated ethereal user
      pass: 'h@ti0LAB1008' // generated ethereal password
    },
    secureConnection: false,
    tls: {
      ciphers: 'SSLv3'
    }
  }
}

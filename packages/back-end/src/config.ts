interface Config {
  PORT: number,
  JWT_KEY: string,
  MONGO_URL: string,
}

const config: Config = {
  PORT: process.env.NODE_ENV === 'production' ? 9680 : (Number(process.env.PORT) || 4020),
  JWT_KEY: 'SECRET',
  MONGO_URL: process.env.NODE_ENV === 'production'? 'mongodb://USERNAME:PASSWORD@localhost:27017/DB' : 'mongodb://localhost:27017/metamask-auth'
}

export default config;

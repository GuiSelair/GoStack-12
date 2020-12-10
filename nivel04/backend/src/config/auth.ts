export default {
  jwt: {
    secret: process.env.APP_SECRET || 'anything',
    expiresIn: '1d',
  },
};

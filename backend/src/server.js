const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SecureDesk ADSO backend escuchando en http://localhost:${PORT}`);
});

const express = require("express");
const path = require("path");
const app = express();
const sequelize = require("./config/sequelize");
const projetoRoutes = require("./routes/projetoRoute");
const usuarioRoutes = require("./routes/usuarioRoute");
const empresaRoutes = require("./routes/empresaRoute");
const rotaRoute = require("./routes/rotaRoute");
const programaRoutes = require("./routes/programaRoute");
const responsavelRoutes = require("./routes/responsavelRoute");
const ictRoute = require("./routes/ictRoute");
const impulsoRoute = require("./routes/impulsoRoute");
const ofertaRoutes = require("./routes/ofertaRoute");
const interesseRoutes = require("./routes/interesseRoute");
const parceriaRoutes = require("./routes/parceriaRoute");
const authRoute = require("./routes/authRoute");
const cors = require("cors");

const allowedOrigins = [
  "https://ga2way-production.up.railway.app",
  "https://www.gate2way.com.br",
  "http://localhost:5173",
]; // Deploy do front-end no railway + localhost

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware para lidar com JSON
app.use(express.json());

// Middleware para lidar os arquivos uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas
app.use("/api", projetoRoutes);

app.use("/api", usuarioRoutes);

app.use("/api", empresaRoutes);

app.use("/api", rotaRoute);

app.use("/api", programaRoutes);

app.use("/api", responsavelRoutes);

app.use("/api", ictRoute);

app.use("/api", impulsoRoute);

app.use("/api", ofertaRoutes);

app.use("/api", interesseRoutes);

app.use("/api", parceriaRoutes);

app.use("/api", authRoute);

// Iniciar o servidor
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const express = require("express");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");


const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// =============================================================================
// Set up API gateway routes with proxy
// =============================================================================

app.use(
  "/flight-search",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SEARCH_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/flight-search": "",
    },
  })
);

app.use(
  "/flight-booking",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/flight-booking": "",
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});

const { City } = require("./src/models");
(async () => {
  const hyd = await City.findByPk(2);
  const airports = await hyd.getAirports();
  for (let airport of airports) {
    await airport.destroy();
  }
  await hyd.destroy();
})();

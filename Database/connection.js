const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

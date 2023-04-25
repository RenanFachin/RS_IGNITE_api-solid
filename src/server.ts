import { app } from "./app";
import { env } from "./env";

app.listen({
  host: '0.0.0.0', // faz ser acessível pelo front-end
  port: env.PORT,
}).then(
  () => {
    console.log('HTTP Server Running!')
  }
)
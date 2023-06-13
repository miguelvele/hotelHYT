import app from "./app.js";

app.listen(app.get("port"), () => {
    console.log(`Se ha conectado al puerto: ${app.get("port")}
    http://localhost:${app.get("port")}
    `);
});
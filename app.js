const http = require("http");
const url = require("url");
const { exec } = require("child_process");
require("dotenv").config();

function reiniciarSitio(res) {
 // const comando = `powershell.exe -Command "Import-Module WebAdministration; Stop-Website -Name \\"${SITIO_IIS}\\"; Start-Website -Name \\"${SITIO_IIS}\\""`;
  exec('schtasks /run /tn "ReiniciarSitioWeb"', (error, stdout, stderr) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          success: false,
          error: stderr || error.message,
        })
      );
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === "/reinicar" && req.method === "GET") {
    reiniciarSitio( res);


    //

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        message: `Sitio  reiniciado`,
      })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: parsedUrl.pathname, message: "Ruta no válida" })
    );
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App corriendo en el puerto ${port}`);
});

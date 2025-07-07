const http = require('http');
const url = require('url');
const { exec } = require('child_process');
require('dotenv').config()

function reiniciarSitio(SITIO_IIS, res) {
  
    const comando = `powershell.exe -Command "Import-Module WebAdministration; Stop-Website -Name \\"${SITIO_IIS}\\"; Start-Website -Name \\"${SITIO_IIS}\\""`; 
  exec(comando, (error, stdout, stderr) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: false,
        error: stderr || error.message
      }));
    }
  });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/reiniciar' && req.method === 'GET') {
    
    // .env En Caso De Que Sean Mas Agregar Separados Por "-"
    const env = process.env.sitios
    const servicios =  env.split("-");

    for (const serv of servicios) {
      
            reiniciarSitio(serv, res);
            console.log('serv :>> ', serv);
    
  
    }
   // 


    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `Sitio o AppPool reiniciado`
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Ruta no válida' }));
  }
});

server.listen(8080, () => {
  console.log('Servidor Node.js escuchando en http://localhost:8080');
});

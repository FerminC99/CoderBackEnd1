import http from 'http';

const server = http.createServer ((req, res) => {
    res.end(`Fernando Gago`);
});

server.listen (8080, () =>{
    console.log (`se escucha 8080`);
});
import { Server } from 'socket.io';

        client.on('nuevoProducto', (producto) => {
            console.log('Nuevo producto recibido en el servidor:', producto);
        });

        client.on('productoEliminado', (producto) => {
            console.log('Producto eliminado en el servidor:', producto);
            io.emit('productoEliminado',  producto );
        });
;

    return io;


export default initSocket;
import * as url from 'url';


const config = {
    PORT: 5050,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
   MONGODB_URI: 'mongodb+srv://FerminC99:Bastardo99@cluster0.mhsjs.mongodb.net/CoderBack',
   //MONGODB_URI: 'mongodb://127.0.0.1:27017/CoderBack',
};

export default config;



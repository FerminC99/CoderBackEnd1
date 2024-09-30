import fs from 'fs';
import moment from "moment";

const DATE_FILE = './date_to_file.txt';
const CURRENT_DATE = moment();

fs.writeFile(DATE_FILE, `${CURRENT_DATE}`,'utf-8',(err) => {
    console.log("fecha almacenada");

    fs.readFile(DATE_FILE,`utf-8`,(err, content)=> {
        if (err) return console.log (err);
        console.log (`Fecha recuperada`);
        console.log (content);
    });
});

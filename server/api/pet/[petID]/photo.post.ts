import {readFiles} from "h3-formidable"
export default defineEventHandler(async e => {
    const files = await readFiles(e);

    console.log(files);
})
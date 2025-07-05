import fs from 'fs';
import path from 'path';

const filePath = path.resolve('app/db/slider.json');

export const getSlider = async () => {
    const data = await fs.promises.readFile(filePath, 'utf8')
    return JSON.parse(data)
}
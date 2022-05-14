import { URLModel } from "database/model/URL";
import { Request, response, Response } from "express";
import shortId from 'shortid';
import { config } from '../config/Constant';


export class URLController {
    public async shorten(req: Request, res: Response): Promise<void> {
        // se existe URL
        // Criar Hash para URL
        // salvar URL no banco
        // retornar URL que foi salva no banco
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })

        if (url) {
            response.json(url)
            return
        }

        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create({ hash, shortURL, originURL })

        response.json({ newURL })
    }

    public async redirect(req: Request, res: Response): Promise<void> {
        // pegar a URL/hash
        // pegar URL origin pelo hash
        // pegar URL origin apartir do do que encontramos no BD
        const { hash } = req.params
        const url = await URLModel.findOne({ hash })

        if (url) {
            response.redirect(url.originURL)
            return
        }

        response.status(400).json({ error: 'URL not found' })
    }
}
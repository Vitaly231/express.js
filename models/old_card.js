const path = require('path')
const fs = require('fs')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    "card.json"
)


class Card {
    static async add(film) {
        const card = await Card.fetch()
        const idx = card.serials.findIndex(c => c.id === film.id)
        const candidate = card.serials[idx]
        if (candidate) {
            candidate.count++
            card.serials[idx] = candidate

        } else {
            film.count = 1
            card.serials.push(film)
        }
        card.voice_acting += +film.voice_acting

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const card = await Card.fetch()
        const idx = card.serials.findIndex(c => c.id === id)
        const film = card.serials[idx]
        if (film.count === 1) {
            //удалить
            card.serials = card.serials.filter(c => c.id !== id)
        } //изменить количество
        else {
            card.serials[idx].count--
        }
        card.voice_acting -= film.voice_acting


        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(card)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }

            })
        })
    }
}


module.exports = Card
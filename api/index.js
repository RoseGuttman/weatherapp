    const fetch = require('node-fetch')

    const key = '0d93b992ed00cc794b8ed11da81c4574'

    const root = 'https://api.darksky.net/forecast'

    module.exports = async function(req,res){
        try{
            const {lon,lat} = req.query
            const url = `${root}/${key}/${lat},${lon}`
            const r = await fetch(url)
            const weather = await r.json()
            res.status(200).send(weather)
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
    
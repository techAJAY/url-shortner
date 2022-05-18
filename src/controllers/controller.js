
const validUrl = require("valid-url")
const shortid = require("shortid")
const urlModel = require("../models/urlModel")

//---CREATE SHORT URL
const createShortUrl= async function(req,res){
    try{
        //==defining base url==//
        const baseUrl = 'http://localhost:3000'
        
        //==validating request body==//
        if(Object.keys(req.body)==0) return res.status(400).send({status: false, message: "Invalid request, please provide details"})
        
        //==validating long url==//
        let longUrl=req.body.longUrl
        if (!validUrl.isUri(longUrl)) return res.status(400).send({status: false, message: "Invalid long URL"})

        //==ckecking and sending shorturl==//
        if (validUrl.isUri(longUrl)) {
            let url = await urlModel.findOne({longUrl:longUrl}).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
            if(url) return res.status(200).send({status: true, data : url})

        //==creating shorturl and url document==//
        const urlCode = shortid.generate(longUrl)
        const shortUrl = baseUrl + '/' + urlCode
        let Url = await urlModel.create({longUrl,shortUrl,urlCode})

        //==destructuring and sending only required keys==/
        let data ={longUrl,shortUrl,urlCode}
        return res.status(201).send({status: true, data : data})
        }
        
    }catch (err) {
     return res.status(500).send({ status: false, error: err.message })
    }
}



//*******************************************************************//

//********************Get API****************************************//
const getShortUrl = async function (req, res) {
    try {
        const urlData = await urlModel.findOne({ urlCode: req.params.urlCode.trim() })  //checking for document in url collection

        if (!urlData)   // doc not found in url collection
            return res.status(404).send({status: false, message: "No URL Found "});

        return res.status(307).redirect(urlData.longUrl)    //doc found and now redirecting to original url

    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}

module.exports.getShortUrl = getShortUrl
module.exports.createShortUrl = createShortUrl

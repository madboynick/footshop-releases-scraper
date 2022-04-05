const got = require('got')
const cheerio = require('cheerio');
const prompt = require('prompt-sync')();

var links = []
var url = []
var id = 0

async function getLinks(){
    
try {
    

    let response = await got('https://releases.footshop.com/', {
        
        //'method' : GET,
        'headers' : {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "sk-SK,sk;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        } 
    })
    let body = response.body

    const $ = cheerio.load(body);
    const linkObjects = $('a');
    var y = 0;
   

    linkObjects.each((index, element) => {
        //console.log(y)
        if(!($(element).attr('href').includes("https")) && !($(element).attr('href').includes("shipping")) && !($(element).attr('href') == "/")){
            links[y] = ($(element).attr('href').split('-').pop());
        y++
    }


      });
      
      let uniqueLinks = [];
        links.forEach((c) => {
    if (!uniqueLinks.includes(c)) {
        uniqueLinks.push(c);
    }
});

for(c = 0; c < uniqueLinks.length; c++){
     url[c] = "https://releases.footshop.com/api/raffles/" + uniqueLinks[c];
}
} catch (error) {
    
}
}
    

async function getNames(url){
    try{
    let response = await got(url, {
        
        //'method' : GET,
        'headers' : {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "sk-SK,sk;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        } 
    })
    
    let body = JSON.parse(response.body)
    let title = body.translations.en.title
    let subtitle = body.translations.en.subtitle
    let status = body.status

    if(status == "Open"){
    console.log(id + " - " + title + " (" + subtitle + ")")
    id++;
}

} catch (error) {
    
}
}

async function getStock(url){
try {
    

    let response = await got(url, {
        
        //'method' : GET,
        'headers' : {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "sk-SK,sk;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        } 
    })
    
    let data = JSON.parse(response.body)
    console.clear()
    console.log("Product: " + data.translations.en.title + " " + data.translations.en.subtitle)

    if(data.sizeSets.Women.sizes.length != 0){
    
        for(let x = 0; x < data.sizeSets.Women.sizes.length; x++ ){
            console.log(data.sizeSets.Women.sizes[x].eur + " " + data.sizeSets.Women.sizes[x].pieces)  
    }}
      if(data.sizeSets.Men.sizes.length != 0){
        for(let x = 0; x < data.sizeSets.Men.sizes.length; x++ ){
            console.log("EU" + data.sizeSets.Men.sizes[x].eur + " - " + data.sizeSets.Men.sizes[x].pieces)
    }}
      if(data.sizeSets.Unisex.sizes.length != 0){
        for(let x = 0; x < data.sizeSets.Unisex.sizes.length; x++ ){
            console.log("EU" + data.sizeSets.Unisex.sizes[x].eur + " - " + data.sizeSets.Unisex.sizes[x].pieces)
    }}
      if(data.sizeSets.Kids.sizes.length != 0){
        for(let x = 0; x < data.sizeSets.Kids.sizes.length; x++ ){
            console.log("EU" + data.sizeSets.Kids.sizes[x].eur + " - " + data.sizeSets.Kids.sizes[x].pieces)
    }}

    console.log("\n")
     

    } catch (error) {
    
    }

}


async function main(){
    try {
        
    
    await getLinks()
    for(x = 0; x < url.length; x++){
        await getNames(url[x])
    }
    var choice  = prompt('Enter the ID of the raffle you want to check or press N to exit: ');
    console.clear()
    let requested_url = url[choice]
    await getStock(requested_url)
    links = []
     url = []
     id = 0 
    choice = prompt('Do you want to continue? Y/N ')
    switch (choice) {
        case 'Y':
            console.clear;
            main();
            break;
        case 'N':
            break;
        default:
            break;
    }

} catch (error) {
        
}
    
}
  

    main()



    
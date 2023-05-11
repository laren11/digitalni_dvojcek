package scraper

import it.skrape.core.htmlDocument
import it.skrape.fetcher.HttpFetcher
import it.skrape.fetcher.response
import it.skrape.fetcher.skrape
import it.skrape.selects.and
import it.skrape.selects.eachText
import it.skrape.selects.html5.*
import scraper.dataClasses.*




class krakenScraper {

    fun scrapeAll(): ExtractedData{
        var dataToExtract = ExtractedData()
        var names = scrapeName()
        var values = scrapeValue()
        for(i in names.indices){
            val crypto = Crypto(names.get(i), values.get(i))
            dataToExtract.cryptoValues += crypto
        }
        return dataToExtract
    }


    fun scrapeName(): Array<String> {
        var nameArray = arrayOf<String>()
        skrape(HttpFetcher){
            request {
                url = "https://www.kraken.com/prices"
            }

            response {
                htmlDocument {
                    findAll {
                        span {
                            withClass = "fc-bc02027a-20"
                            findAll { eachText.forEach() { nameArray += it } }
                        }
                    }
                }
            }
        }
        return nameArray

    }

    fun scrapeValue(): Array<String>{
        var valueArray = arrayOf<String>()
        skrape(HttpFetcher){
            request {
                url = "https://www.kraken.com/prices"
            }

            response {
                htmlDocument {
                    findAll {
                        span {
                            withClass = "fc-bc02027a-9"
                            findAll { eachText.forEach() { valueArray += it } }
                        }
                    }
                }
            }
        }
        return valueArray
    }
}
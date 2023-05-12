package scraper

import it.skrape.core.htmlDocument
import it.skrape.fetcher.HttpFetcher
import it.skrape.fetcher.response
import it.skrape.fetcher.skrape
import it.skrape.selects.and
import it.skrape.selects.eachText
import it.skrape.selects.html5.*
import scraper.dataClasses.*


class bitThumbScraper {

    fun scrapeAll(): ExtractedData {
        var dataToExtract = ExtractedData()
        var names = scrapeName()
        var values = scrapeValue()
        for (i in names.indices) {
            val crypto = Crypto(names.get(i), values.get(i))
            dataToExtract.cryptoValues += crypto
        }
        return dataToExtract
    }


    fun scrapeName(): Array<String> {
        var nameArray = arrayOf<String>()
        var indexArray = arrayOf(0, 3, 6, 9, 12)
        var i = 0
        skrape(HttpFetcher) {
            request {
                url = "https://coinmarketcap.com/exchanges/bithumb/"
            }

            response {
                htmlDocument {
                    tbody {
                        tr {
                            td {
                                withAttribute = "style" to "text-align:start"
                                a {
                                    withClass = "cmc-link"
                                    findAll {
                                        eachText.forEach() {
                                            if (i in indexArray) {
                                                nameArray += it; i++
                                            } else i++
                                        }
                                    }
                                }
                            }
                        }
                    }


                }
            }
        }
        return nameArray

    }

    fun scrapeValue(): Array<String> {
        var valueArray = arrayOf<String>()
        var indexArray = arrayOf(0, 5, 10, 15, 20)
        var i = 0
        skrape(HttpFetcher) {
            request {
                url = "https://coinmarketcap.com/exchanges/bithumb/"
            }

            response {
                htmlDocument {
                    tbody {
                        tr {
                            td {
                                withAttribute = "style" to "text-align:end"
                                p {
                                    withClass = "sc-4984dd93-0" and "cEFVjA"
                                    findAll {
                                        eachText.take(22).forEach() {
                                            if (i in indexArray) {
                                                valueArray += it; i++
                                            } else {
                                                i++
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return valueArray
    }
}
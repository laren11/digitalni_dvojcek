package scraper

import it.skrape.core.htmlDocument
import it.skrape.fetcher.HttpFetcher
import it.skrape.fetcher.response
import it.skrape.fetcher.skrape
import it.skrape.selects.and
import it.skrape.selects.eachText
import it.skrape.selects.html5.*
import scraper.dataClasses.*


class coinbaseScraper {

    fun scrapeAll(): ExtractedData {
        var dataToExtract = ExtractedData()
        var names = scrapeName()
        var values = scrapeValue()
        val exchange = "Coinbase"
        for (i in names.indices) {
            val crypto = Crypto(names.get(i), values.get(i), exchange)
            dataToExtract.cryptoValues += crypto
        }
        return dataToExtract
    }

    //scrape the name of crypto
    fun scrapeName(): Array<String> {
        var nameArray = arrayOf<String>()
        skrape(HttpFetcher) {
            request {
                url = "https://www.coinbase.com/explore"
            }

            response {
                htmlDocument {
                    findAll {
                        h2 {
                            withClass = "cds-typographyResets-t1xhpuq2"
                            findAll { eachText.drop(1).take(5).forEach() { nameArray += it } }
                        }
                    }
                }
            }
        }
        return nameArray

    }

    //scrape the value of crypto
    fun scrapeValue(): Array<String> {
        var valueArray = arrayOf<String>()
        val indexArray = arrayOf(0, 5, 10, 15, 20)
        var i = 0;
        skrape(HttpFetcher) {
            request {
                url = "https://www.coinbase.com/explore"
            }

            response {
                htmlDocument {
                    td {
                        withClass = "cds-tableCell-t1jg7jzg"
                        withAttribute = "colspan" to "1"
                        withAttribute = "align" to "right"
                        div {
                            div {
                                div {
                                    div {
                                        div {
                                            withClass =
                                                "cds-flex-f1g67tkn" and "cds-flex-end-f9tvb5a" and "cds-column-ci8mx7v" and "cds-flex-start-f1urtf06"
                                            withAttribute = "style" to "flex-grow:1;flex-shrink:1"
                                            span {
                                                findAll {
                                                    eachText.take(26).forEach() {
                                                        if (i in indexArray) {
                                                            valueArray += it;i++
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
                }
            }
        }
        return valueArray
    }
}
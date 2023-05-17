import androidx.compose.material.MaterialTheme
import androidx.compose.desktop.ui.tooling.preview.Preview
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.application
import scraper.bitThumbScraper
import scraper.coinbaseScraper

import scraper.pexpayScraper

@Composable
@Preview
fun App() {
    var text by remember { mutableStateOf("Hello, World!") }

    MaterialTheme {
        Button(onClick = {
            text = "Hello, Desktop!"
        }) {
            Text(text)
        }
    }
}

fun main() = application {
    /* Window(onCloseRequest = ::exitApplication) {
        App()
    } */
        // Printing scraped data
        println("COINBASE DATA")
        val coinbaseScraper = coinbaseScraper()
        var coinbaseData = coinbaseScraper.scrapeAll()
        for (cryptoValue in coinbaseData.cryptoValues) {
            println("NAME ${cryptoValue.name} and PRICE ${cryptoValue.price}")
        }


        println("________________________")
        println("BITTHUMB DATA \n")

        val bitThumbScraper = bitThumbScraper()
        var bitThumbData = bitThumbScraper.scrapeAll()
        for (cryptoValue in bitThumbData.cryptoValues) {
            println("NAME ${cryptoValue.name} and PRICE ${cryptoValue.price}")
        }


        println("________________________")
        println("PEXPAY DATA \n")

        val pexpayScraper = pexpayScraper()
        var pexpayData = pexpayScraper.scrapeAll()
        for (cryptoValue in pexpayData.cryptoValues) {
            println("NAME ${cryptoValue.name} and PRICE ${cryptoValue.price}")
        }


}

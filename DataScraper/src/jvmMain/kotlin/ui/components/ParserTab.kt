package ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import scraper.bitThumbScraper
import scraper.coinbaseScraper
import scraper.dataClasses.AllExtractedData
import scraper.dataClasses.Crypto
import scraper.dataClasses.ExtractedData
import scraper.pexpayScraper
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*


@Composable
fun ParserTab(allExtractedData: MutableState<AllExtractedData>) {
    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier.fillMaxSize()
    ) {
        // If Extracted data is empty, show Get Data button, else show data
        if (allExtractedData.value.cryptoList.isEmpty()) {
            Button(
                onClick = {
                    allExtractedData.value = scrapeData()
                }
            ) {
                Text(text = "Get Data")
            }
        } else {
            Box(
                modifier = Modifier.align(Alignment.TopCenter)
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.verticalScroll(rememberScrollState())
                ) {
                    // Iterate over data and display in new row for each cryptocurrency
                    allExtractedData.value.cryptoList.forEach { crypto ->
                        // States for remembering values and if user is editing
                        val isEditing = remember { mutableStateOf(false) }
                        val exchangeText = remember { mutableStateOf(crypto.exchange) }
                        val nameText = remember { mutableStateOf(crypto.name) }
                        val priceText = remember { mutableStateOf(crypto.price) }

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                                .height(70.dp),
                            elevation = 4.dp
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    if (isEditing.value) {
                                        Text(text = "Exchange:")
                                        TextField(
                                            value = exchangeText.value,
                                            onValueChange = { exchangeText.value = it },
                                            modifier = Modifier.fillMaxWidth()
                                        )
                                    } else {
                                        Text(text = crypto.exchange)
                                    }
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    if (isEditing.value) {
                                        Text(text = "Name:")
                                        TextField(
                                            value = nameText.value,
                                            onValueChange = { nameText.value = it },
                                            modifier = Modifier.fillMaxWidth()
                                        )
                                    } else {
                                        Text(text = crypto.name)
                                    }
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    if (isEditing.value) {
                                        Text(text = "Price:")
                                        TextField(
                                            value = priceText.value,
                                            onValueChange = { priceText.value = it },
                                            modifier = Modifier.fillMaxWidth()
                                        )
                                    } else {
                                        Text(text =crypto.price)
                                    }
                                }
                                Row(
                                    modifier = Modifier.weight(1f),
                                    horizontalArrangement = Arrangement.End
                                ) {
                                    if (isEditing.value) {
                                        IconButton(onClick = {
                                            // Discard changes and exit edit mode
                                            isEditing.value = false
                                            exchangeText.value = crypto.exchange
                                            nameText.value = crypto.name
                                            priceText.value = crypto.price
                                        }) {
                                            Icon(Icons.Default.Clear, contentDescription = "Discard")
                                        }
                                        IconButton(onClick = {
                                            // Save changes and exit edit mode
                                            allExtractedData.value = allExtractedData.value.copy(
                                                cryptoList = allExtractedData.value.cryptoList.map {
                                                    if (it == crypto) {
                                                        Crypto(
                                                            exchange = exchangeText.value,
                                                            name = nameText.value,
                                                            price = priceText.value
                                                        )
                                                    } else {
                                                        it
                                                    }
                                                }
                                            )
                                            isEditing.value = false
                                        }) {
                                            Icon(Icons.Default.Check, contentDescription = "Save")
                                        }
                                    } else {
                                        IconButton(onClick = {
                                            // Enter edit mode
                                            isEditing.value = true
                                        }) {
                                            Icon(Icons.Default.Edit, contentDescription = "Edit")
                                        }
                                        IconButton(onClick = {
                                            // Delete item
                                            allExtractedData.value = allExtractedData.value.copy(
                                                cryptoList = allExtractedData.value.cryptoList.filterNot { it == crypto }
                                            )
                                        }) {
                                            Icon(Icons.Default.Delete, contentDescription = "Delete")
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






// Function for scraping data. Calls all data scrapres and adds crypto values to a List
fun scrapeData(): AllExtractedData {
    val coinbase = coinbaseScraper()
    val pexpay = pexpayScraper()
    //val bithumb = bitThumbScraper()

    val cryptoList = mutableListOf<Crypto>()
    cryptoList.addAll(coinbase.scrapeAll().cryptoValues)
    cryptoList.addAll(pexpay.scrapeAll().cryptoValues)
    //cryptoList.addAll(bithumb.scrapeAll().cryptoValues)

    return AllExtractedData(cryptoList)
}

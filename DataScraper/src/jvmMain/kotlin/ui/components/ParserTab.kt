package ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import scraper.coinbaseScraper
import scraper.dataClasses.AllExtractedData
import scraper.dataClasses.Crypto
import scraper.pexpayScraper
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.SerializersModule
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import scraper.bitThumbScraper


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
            Column(
                modifier = Modifier
                    .fillMaxHeight()
                    .verticalScroll(rememberScrollState())
            ) {
                Box(
                    modifier = Modifier.weight(1f)
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
                Button(
                    onClick = {
                        sendData(allExtractedData)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Text(text = "Send Data")
                }
            }
        }
    }
}






// Function for scraping data. Calls all data scrapres and adds crypto values to a List
fun scrapeData(): AllExtractedData {
    val coinbase = coinbaseScraper()
    val pexpay = pexpayScraper()
    val bithumb = bitThumbScraper()

    val cryptoList = mutableListOf<Crypto>()

    try {
        cryptoList.addAll(coinbase.scrapeAll().cryptoValues)
    } catch (e: Exception) {
        println("Error occurred while scraping data from Coinbase: ${e.message}")
    }

    try {
        cryptoList.addAll(pexpay.scrapeAll().cryptoValues)
    } catch (e: Exception) {
        println("Error occurred while scraping data from Pexpay: ${e.message}")
    }

    try {
        cryptoList.addAll(bithumb.scrapeAll().cryptoValues)
    } catch (e: Exception) {
        // Handle the exception from bithumb.scrapeAll()
        // For example:
        println("Error occurred while scraping data from Bithumb: ${e.message}")
    }

    return AllExtractedData(cryptoList)
}


fun sendData(allExtractedDataValue:MutableState<AllExtractedData>): Boolean{
    //send extracted data with OKHttpClient
    val client = OkHttpClient()
    val url = "http://localhost:3001/prices/scrapeddata"

    val jsonData: String = Json.encodeToString(allExtractedDataValue.value.cryptoList)
    val requestBody = jsonData.toRequestBody("application/json".toMediaType())

    val request = Request.Builder().url(url).addHeader("Origin", "http://localhost:8080").post(requestBody).build()

   client.newCall(request).execute().use { response ->
        println("RESPONSE ${response}")
        response.close()
    }

    //refresh app
    val emptyData = AllExtractedData(emptyList())
    allExtractedDataValue.value = emptyData

    return true
}

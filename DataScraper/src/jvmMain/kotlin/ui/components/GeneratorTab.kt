package ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import scraper.dataClasses.AllExtractedData
import scraper.dataClasses.Crypto
import kotlin.random.Random

val exchanges = arrayOf("Bithumb", "Coinbase", "Pexpay")
val coins = arrayOf("Bitcoin", "Ethereum", "Tether", "BNB", "USD Coin", "XRP", "Cardano", "Dogecoin",
    "Solana", "Polygon", "Litecoin", "TRON", "Polkadot", "Binance USD", "SHIBA INU", "Avalanche", "Dai",
    "Wrapped Bitcoin", "Chainlink", "Cosmos")

@Composable
fun GeneratorTab(generatedData: MutableState<AllExtractedData>) {
    val numberOfCoins = remember { mutableStateOf(20) }
    val minRange = remember { mutableStateOf(0) }
    val maxRange = remember { mutableStateOf(30000) }


    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier.fillMaxSize()
    ) {
        // If generatedCryptoList is empty, show Generate button, else show data
        if (generatedData.value.cryptoList.isEmpty()) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(horizontal = 16.dp)
            ) {
                // User input fields
                TextField(
                    value = numberOfCoins.value.toString(),
                    onValueChange = { numberOfCoins.value = it.toIntOrNull() ?: 0 },
                    label = { Text("Number of Coins") },
                    modifier = Modifier.fillMaxWidth()
                )
                TextField(
                    value = minRange.value.toString(),
                    onValueChange = { minRange.value = it.toIntOrNull() ?: 0 },
                    label = { Text("Min Range") },
                    modifier = Modifier.fillMaxWidth()
                )
                TextField(
                    value = maxRange.value.toString(),
                    onValueChange = { maxRange.value = it.toIntOrNull() ?: 0 },
                    label = { Text("Max Range") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        generatedData.value = generateData(
                            numberOfCoins = numberOfCoins.value,
                            minRange = minRange.value,
                            maxRange = maxRange.value
                        )
                    },
                    enabled = numberOfCoins.value > 0 && minRange.value < maxRange.value
                ) {
                    Text(text = "Generate Data")
                }
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
                    generatedData.value.cryptoList.forEach { crypto ->
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
                                        Text(text = crypto.price)
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
                                            generatedData.value = generatedData.value.copy(
                                                cryptoList = generatedData.value.cryptoList.map {
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
                                            generatedData.value = generatedData.value.copy(
                                                cryptoList = generatedData.value.cryptoList.filterNot { it == crypto }
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

fun generateData(numberOfCoins: Int, minRange: Int, maxRange: Int): AllExtractedData {
    val generatedCryptoList = mutableListOf<Crypto>()
    var number = numberOfCoins
    val availableExchanges = exchanges.toList()
    val availableCoins = coins.toList()

    while(number > 0) {

        val exchange = availableExchanges.random()
        val coin = availableCoins.random()

        val price = getRandom(minRange, maxRange)

        val crypto = Crypto(exchange = exchange, name = coin, price = price)

        val hasDuplicate = generatedCryptoList.any { it.exchange == exchange && it.name == coin }
        if (!hasDuplicate) {
            generatedCryptoList.add(crypto)
            number--
        }
    }

    return AllExtractedData(cryptoList = generatedCryptoList)
}

fun getRandom(min: Int, max: Int): String {
    require(min < max) { "Invalid range [$min, $max]" }
    var number = min + Random.nextDouble() * (max - min)
    var formatted = "€%.2f".format(number)
    return formatted
}

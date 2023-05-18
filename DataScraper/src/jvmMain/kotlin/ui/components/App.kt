package ui.components

import androidx.compose.desktop.ui.tooling.preview.Preview
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import scraper.dataClasses.AllExtractedData
import scraper.dataClasses.Crypto

enum class MenuState {
    PARSER,
    GENERATOR
}


@Composable
@Preview
fun App() {
    val menuState = remember { mutableStateOf(MenuState.PARSER) }
    val allExtractedData = remember { mutableStateOf(AllExtractedData(emptyList())) }
    val generatedData = remember { mutableStateOf(AllExtractedData(emptyList())) }
    MaterialTheme {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier.weight(1f),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Header(menuState)
                Content(menuState, allExtractedData, generatedData)
            }
            Menu(menuState)
        }
    }


}
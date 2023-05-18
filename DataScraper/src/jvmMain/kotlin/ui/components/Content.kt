package ui.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.ui.Modifier
import scraper.dataClasses.AllExtractedData

@Composable
fun Content(menuState: MutableState<MenuState>, allExtractedData: MutableState<AllExtractedData>, generatedData: MutableState<AllExtractedData>,modifier: Modifier = Modifier) {
    //Switch between tabs according to MenuState
    when (menuState.value) {
        MenuState.PARSER -> ParserTab(allExtractedData)
        MenuState.GENERATOR -> GeneratorTab(generatedData)
    }
}
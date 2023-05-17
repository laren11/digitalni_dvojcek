package ui

import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import ui.components.App


fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "Crypto Scraper",
        state = rememberWindowState(
            position = WindowPosition.Aligned(Alignment.Center),
            size = DpSize(900.dp, 600.dp)
        ),
        undecorated = false,
        resizable = true

    ) {
        App()
    }
}
package ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.Icon
import androidx.compose.material.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.List
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

@Composable
fun Menu(menuState: MutableState<MenuState>, modifier: Modifier = Modifier) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Cyan)
            .height(50.dp)
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxSize()
                .align(Alignment.CenterVertically)
                .clickable { menuState.value = MenuState.PARSER }
                .composed { modifier }
                .background(if (menuState.value == MenuState.PARSER) Color.White else Color.Cyan),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Parser",
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(start = 8.dp)
                )
            }
        }


        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxSize()
                .align(Alignment.CenterVertically)
                .clickable { menuState.value = MenuState.GENERATOR }
                .composed { modifier }
                .background(if (menuState.value == MenuState.GENERATOR) Color.White else Color.Cyan),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Generator",
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(start = 8.dp)
                )
            }
        }

    }
}
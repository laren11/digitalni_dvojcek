package analyzer


import java.io.ByteArrayInputStream
import java.io.File
import java.io.InputStream
import com.google.gson.Gson

// Constants
const val ERROR_STATE = 0

const val EOF_SYMBOL = -1
const val SKIP_SYMBOL = 0
const val NUMBER = 2
const val STRING = 3
const val POINT = 4
const val CITY = 5
const val ROAD = 6
const val BUILDING = 7
const val RIVER = 8
const val LAKE = 9
const val PARKING = 10
const val LINE = 11
const val BEND = 12
const val BOX = 13
const val CIRC = 14
const val VAL = 15
const val ASSIGN = 16
const val SEMI = 17
const val PARENT1 = 18
const val PARENT2 = 19
const val CURLY1 = 20
const val CURLY2 = 21
const val COMMA = 22
const val COLON = 23
const val TYPE = 24


const val EOF = -1
const val NEWLINE = '\n'.code

// AST Node Definitions
sealed class AstNode

// Represents the root node of the abstract syntax tree
data class ProgramNode(val cities: List<CityNode>) : AstNode()

// Represents a city node containing its name and blocks within the city
data class CityNode(val name: String, val blocks: List<BlockNode>) : AstNode()

// Represents a block node containing its type, name, and commands within the block
data class BlockNode(val type: String, val name: String, val commands: List<CommandNode>) : AstNode()

sealed class CommandNode(val type: String) : AstNode()

// Represents a command node for drawing a line between two points
data class LineCommandNode(val startPoint: PointNode, val endPoint: PointNode) : CommandNode("LINE")

// Represents a command node for drawing a line with a bend between two points
data class BendCommandNode(val startPoint: PointNode, val endPoint: PointNode, val bendAmount: NumberNode) : CommandNode("BEND")

// Represents a command node for drawing a box between two points
data class BoxCommandNode(val startPoint: PointNode, val endPoint: PointNode) : CommandNode("BOX")

// Represents a command node for drawing a circle with a center point and radius
data class CircCommandNode(val center: PointNode, val radius: NumberNode) : CommandNode("CIRC")

// Represents a point node with x and y coordinates
data class PointNode(val x: Double, val y: Double) : AstNode()

// Represents a number node with a numeric value
data class NumberNode(val value: Double) : AstNode()

// Represents a string node with a string value
data class StringNode(val value: String) : AstNode()


interface DFA {
    val states: Set<Int>
    val alphabet: IntRange
    fun next(state: Int, code: Int): Int
    fun symbol(state: Int): Int
    val startState: Int
    val finalStates: Set<Int>
}



object ForForeachFFFAutomaton: DFA {
    override val states = (1 .. 90).toSet()
    override val alphabet = 0 .. 255
    override val startState = 1
    override val finalStates = setOf(2, 7, 18, 22, 26, 34, 39, 44, 51, 55, 59, 62, 66, 69, 70, 71, 72, 73, 74, 75, 76 ,77, 78, 79, 84, 90)

    private val numberOfStates = states.max() + 1 // plus the ERROR_STATE
    private val numberOfCodes = alphabet.max() + 1 // plus the EOF
    private val transitions = Array(numberOfStates) {IntArray(numberOfCodes)}
    private val values = Array(numberOfStates) {SKIP_SYMBOL}

    private fun setTransition(from: Int, chr: Char, to: Int) {
        transitions[from][chr.code + 1] = to // + 1 because EOF is -1 and the array starts at 0
    }

    private fun setTransition(from: Int, code: Int, to: Int) {
        transitions[from][code + 1] = to
    }

    private fun setSymbol(state: Int, symbol: Int) {
        values[state] = symbol
    }

    override fun next(state: Int, code: Int): Int {
        assert(states.contains(state))
        assert(alphabet.contains(code))
        return transitions[state][code + 1]
    }

    override fun symbol(state: Int): Int {
        assert(states.contains(state))
        return values[state]
    }
    init {

        for (n in 48..57) {  // [0-9]
            setTransition(1, n.toChar(), 2)
            setTransition(2, n.toChar(), 2)
            setTransition(6, n.toChar(), 6)
            setTransition(5, n.toChar(), 6)

        }

        setTransition(2, '.', 2)



        for (n in 97..122){ // [a-z]
            setTransition(5, n.toChar(), 6)
            setTransition(6, n.toChar(), 6)
        }

        for (n in 65..90){  // [A-Z]
            setTransition(5, n.toChar(), 6)
            setTransition(6, n.toChar(), 6)
        }

        setTransition(6, ' ', 6)


        setTransition(1, '"', 5)
        setTransition(6, '"', 7)
        setTransition(1, '(', 8)


        setTransition(1, '(', 74)
        setTransition(1, ')', 75)
        setTransition(1, '{', 76)
        setTransition(1, '}', 77)



        setTransition(1, ' ', 71)
        setTransition(71, ' ', 71)
        setTransition(1, '\n', 71)
        setTransition(71, '\n', 71)
        setTransition(1, '\r', 71)
        setTransition(71, '\r', 71)
        setTransition(1, '\t', 71)
        setTransition(71, '\t', 71)
        setTransition(1, EOF, 70)

        // assign
        setTransition(1, '=', 72)


        // city
        setTransition(1, 'c', 19)
        setTransition(19, 'i', 20)
        setTransition(20, 't', 21)
        setTransition(21, 'y', 22)
        setTransition(64, 't', 21)
        setTransition(65, 'y', 22)

        // road
        setTransition(1, 'r', 23)
        setTransition(23, 'o', 24)
        setTransition(24, 'a', 25)
        setTransition(25, 'd', 26)

        setTransition(35, 'o', 24)


        // building
        setTransition(1, 'b', 27)
        setTransition(27, 'u', 28)
        setTransition(28, 'i', 29)
        setTransition(29, 'l', 30)
        setTransition(30, 'd', 31)
        setTransition(31, 'i', 32)
        setTransition(32, 'n', 33)
        setTransition(33, 'g', 34)

        setTransition(56, 'u', 28)
        setTransition(60, 'u', 28)


        // river
        setTransition(1, 'r', 35)
        setTransition(35, 'i', 36)
        setTransition(36, 'v', 37)
        setTransition(37, 'e', 38)
        setTransition(38, 'r', 39)

        setTransition(23, 'i', 36)


        // lake
        setTransition(1, 'l', 40)
        setTransition(41, 'a', 42)
        setTransition(42, 'k', 43)
        setTransition(43, 'e', 44)


        setTransition(52, 'a', 42)


        // parking
        setTransition(1, 'p', 45)
        setTransition(45, 'a', 46)
        setTransition(46, 'r', 47)
        setTransition(47, 'k', 48)
        setTransition(48, 'i', 49)
        setTransition(49, 'n', 50)
        setTransition(50, 'g', 51)


        // line
        setTransition(1, 'l', 52)
        setTransition(52, 'i', 53)
        setTransition(53, 'n', 54)
        setTransition(54, 'e', 55)


        setTransition(40, 'i', 53)


        // bend
        setTransition(1, 'b', 56)
        setTransition(56, 'e', 57)
        setTransition(57, 'n', 58)
        setTransition(58, 'd', 59)

        setTransition(60, 'e', 57)
        setTransition(27, 'e', 57)


        // box
        setTransition(1, 'b', 60)
        setTransition(60, 'o', 61)
        setTransition(61, 'x', 62)

        setTransition(56, 'o', 61)
        setTransition(27, 'o', 61)


        // circ
        setTransition(1, 'c', 63)
        setTransition(63, 'i', 64)
        setTransition(64, 'r', 65)
        setTransition(65, 'c', 66)


        // val
        setTransition(1, 'v', 67)
        setTransition(67, 'a', 68)
        setTransition(68, 'l', 69)

        // Point type
        setTransition(1, 'P', 80)
        setTransition(80, 'o', 81)
        setTransition(81, 'i', 82)
        setTransition(82, 'n', 83)
        setTransition(83, 't', 84)

        // Number type
        setTransition(1, 'N', 85)
        setTransition(85, 'u', 86)
        setTransition(86, 'm', 87)
        setTransition(87, 'b', 88)
        setTransition(88, 'e', 89)
        setTransition(89, 'r', 90)


        // semi

        setTransition(1, ';', 73)
        setTransition(1, ',', 78)
        setTransition(1, ':', 79)



        setSymbol(2, NUMBER)
        setSymbol(7, STRING)
        setSymbol(18, POINT)
        setSymbol(22, CITY)
        setSymbol(26, ROAD)
        setSymbol(34, BUILDING)
        setSymbol(39, RIVER)
        setSymbol(44, LAKE)
        setSymbol(51, PARKING)
        setSymbol(55, LINE)
        setSymbol(59, BEND)
        setSymbol(62, BOX)
        setSymbol(66, CIRC)
        setSymbol(69, VAL)
        setSymbol(70, EOF_SYMBOL)
        setSymbol(71, SKIP_SYMBOL)
        setSymbol(72, ASSIGN)
        setSymbol(73, SEMI)
        setSymbol(74, PARENT1)
        setSymbol(75, PARENT2)
        setSymbol(76, CURLY1)
        setSymbol(77, CURLY2)
        setSymbol(78, COMMA)
        setSymbol(79, COLON)
        setSymbol(84, TYPE)
        setSymbol(90, TYPE)
    }
}

// Represents a token generated by the lexer, which consists of a symbol, lexeme,
// and the starting row and column positions in the source code.
data class Token(val symbol: Int, val lexeme: String, val startRow: Int, val startColumn: Int)


class Scanner(private val automaton: DFA, private val stream: InputStream) {
    private var last: Int? = null
    private var row = 1
    private var column = 1

    private fun updatePosition(code: Int) {
        if (code == NEWLINE) {
            row += 1
            column = 1
        } else {
            column += 1
        }
    }

    fun getToken(): Token {
        val startRow = row
        val startColumn = column
        val buffer = mutableListOf<Char>()

        var code = last ?: stream.read()
        var state = automaton.startState
        while (true) {
            val nextState = automaton.next(state, code)
            if (nextState == ERROR_STATE) break // Longest match

            state = nextState
            updatePosition(code)
            buffer.add(code.toChar())
            code = stream.read()
        }
        last = code // The code following the current lexeme is the first code of the next lexeme

        if (automaton.finalStates.contains(state)) {
            val symbol = automaton.symbol(state)
            return if (symbol == SKIP_SYMBOL) {
                getToken()
            } else {
                val lexeme = String(buffer.toCharArray())
                Token(symbol, lexeme, startRow, startColumn)
            }
        } else {
            throw Error("Invalid pattern at ${row}:${column}:${state}")
        }
    }
}

fun name(symbol: Int) =
    when (symbol) {
        NUMBER -> "int"
        STRING -> "string"
        POINT -> "point"
        CITY -> "city"
        ROAD -> "road"
        BUILDING -> "building"
        RIVER -> "river"
        LAKE -> "lake"
        PARKING -> "parking"
        LINE -> "line"
        BEND -> "bend"
        BOX -> "box"
        CIRC -> "circle"
        VAL -> "val"
        ASSIGN -> "assign"
        SEMI -> "semi"
        PARENT1 -> "parentheses1"
        PARENT2 -> "parentheses2"
        CURLY1 -> "curlyBrackets1"
        CURLY2 -> "curlyBrackets2"
        COMMA -> "semicolon"
        COLON -> "colon"
        TYPE -> "type"
        else -> throw Error("Invalid symbol")
    }

fun printTokens(scanner: Scanner) {
    val token = scanner.getToken()
    if (token.symbol != EOF_SYMBOL) {
        print("${name(token.symbol)}(\"${token.lexeme}\") ")
        printTokens(scanner)
    }
}

class Parser(private val scanner: Scanner) {
    private var currentToken: Token = scanner.getToken()

    // Starts the parsing process by calling the program() function and returning the resulting AST node.
    fun parse(): AstNode {
        return program()
    }

    // Parses a program node.
    private fun program(): AstNode {
        val cities = mutableListOf<CityNode>()
        while (currentToken.symbol == CITY) {
            currentToken = scanner.getToken()
            val name = string().value
            match(CURLY1)
            val blocks = blocks()
            match(CURLY2)
            match(SEMI)
            cities.add(CityNode(name, blocks))
        }
        return ProgramNode(cities)
    }

    // Parses a string node.
    private fun string(): StringNode {
        val lexeme = currentToken.lexeme
        match(STRING)
        return StringNode(lexeme)
    }

    // Parses a list of block nodes.
    private fun blocks(): List<BlockNode> {
        val blocks = mutableListOf<BlockNode>()
        while (currentToken.symbol in listOf(BUILDING, RIVER, ROAD, LAKE, PARKING)) {
            val type = name(currentToken.symbol)
            currentToken = scanner.getToken()
            val name = string().value
            match(CURLY1)
            val commands = commands()
            match(CURLY2)
            match(SEMI)
            blocks.add(BlockNode(type, name, commands))
        }
        return blocks
    }

    // Parses a list of command nodes.
    private fun commands(): List<CommandNode> {
        val commands = mutableListOf<CommandNode>()
        while (currentToken.symbol in listOf(LINE, BEND, BOX, CIRC)) {
            commands.add(command())
        }
        return commands
    }

    // Parses a command node based on the current token symbol.
    private fun command(): CommandNode {
        return when (currentToken.symbol) {
            LINE -> {
                currentToken = scanner.getToken()
                match(PARENT1)
                val startPoint = point()
                match(COMMA)
                val endPoint = point()
                match(PARENT2)
                match(SEMI)
                LineCommandNode(startPoint, endPoint)
            }
            BEND -> {
                currentToken = scanner.getToken()
                match(PARENT1)
                val startPoint = point()
                match(COMMA)
                val endPoint = point()
                match(COMMA)
                val bendAmount = number()
                match(PARENT2)
                match(SEMI)
                BendCommandNode(startPoint, endPoint, bendAmount)
            }
            BOX -> {
                currentToken = scanner.getToken()
                match(PARENT1)
                val startPoint = point()
                match(COMMA)
                val endPoint = point()
                match(PARENT2)
                match(SEMI)
                BoxCommandNode(startPoint, endPoint)
            }
            CIRC -> {
                currentToken = scanner.getToken()
                match(PARENT1)
                val center = point()
                match(COMMA)
                val radius = number()
                match(PARENT2)
                match(SEMI)
                CircCommandNode(center, radius)
            }
            else -> throw ParserException("Invalid command: ${currentToken.lexeme}")
        }
    }

    // Parses a point node.
    private fun point(): PointNode {
        match(PARENT1)
        val x = number().value
        match(COMMA)
        val y = number().value
        match(PARENT2)
        return PointNode(x, y)
    }

    // Parses a number node.
    private fun number(): NumberNode {
        val lexeme = currentToken.lexeme
        match(NUMBER)
        return NumberNode(lexeme.toDouble())
    }

    // Compares the current token's symbol with the expected symbol and moves to the next token if they match.
    private fun match(expectedSymbol: Int) {
        if (currentToken.symbol == expectedSymbol) {
            currentToken = scanner.getToken()
        } else {
            throw ParserException("Syntax error: Expected $expectedSymbol, found ${currentToken.symbol}")
        }
    }
}

// Custom exception class for parser errors.
class ParserException(message: String) : Exception(message)


fun main(args: Array<String>) {
    val stringForTesting = readFile("maribor")
    try {
        val scanner = Scanner(ForForeachFFFAutomaton, ByteArrayInputStream(stringForTesting.toByteArray()))
        val parser = Parser(scanner)
        val commandNodes = parser.parse()
        val geoJsonText = astToGeoJson(commandNodes)
        println(geoJsonText)
        //println(commandNodes)

    } catch (e: ParserException) {
        println("Parsing error: ${e.message}")
    }

    //printTokens(Scanner(ForForeachFFFAutomaton, ByteArrayInputStream(stringForTesting.toByteArray())))

}

fun readFile(name: String): String {
    val fileName = "tests/$name.txt"
    val file = File(fileName)
    return file.readText()
}

fun astToGeoJson(astNode: AstNode): String {
    return when (astNode) {
        is ProgramNode -> {
            val featureCollection = astNode.cities.map { cityNode ->
                cityToFeature(cityNode)
            }
            val geoJson = GeoJsonObject(
                type = "FeatureCollection",
                features = featureCollection
            )
            geoJson.toJsonString()
        }
        else -> throw IllegalArgumentException("Invalid AST root node.")
    }
}

fun cityToFeature(cityNode: CityNode): GeoJsonFeature {
    val blocks = cityNode.blocks.map { blockNode ->
        blockToFeature(blockNode)
    }
    return GeoJsonFeature(
        type = "Feature",
        properties = mapOf("name" to cityNode.name),
        geometry = null,
        features = blocks
    )
}

fun blockToFeature(blockNode: BlockNode): GeoJsonFeature {
    val commands = blockNode.commands.map { commandNode ->
        commandToFeature(commandNode)
    }
    return GeoJsonFeature(
        type = "Feature",
        properties = mapOf(
            "type" to blockNode.type,
            "name" to blockNode.name
        ),
        geometry = null,
        features = commands
    )
}



fun generateCircleCoordinates(centerX: Double, centerY: Double, radius: Double): List<List<Double>> {
    val numSegments = 50
    val coordinates = mutableListOf<List<Double>>()
    for (i in 0 until numSegments) {
        val angle = i.toDouble() / numSegments.toDouble() * 2.0 * Math.PI
        val x = centerX + radius * Math.cos(angle)
        val y = centerY + radius * Math.sin(angle)
        coordinates.add(listOf(x, y))
    }
    // Close the circle
    coordinates.add(coordinates[0])
    return coordinates
}

fun commandToFeature(commandNode: CommandNode): GeoJsonFeature {
    return when (commandNode) {
        is LineCommandNode -> {
            val startPoint = commandNode.startPoint
            val endPoint = commandNode.endPoint
            val coordinates = listOf(
                listOf(startPoint.x.toDouble(), startPoint.y.toDouble()),
                listOf(endPoint.x.toDouble(), endPoint.y.toDouble())
            )
            GeoJsonFeature(
                type = "Feature",
                properties = mapOf("type" to "line"),
                geometry = GeoJsonGeometry(type = "LineString", coordinates = coordinates),
                features = emptyList()
            )
        }
        is BendCommandNode -> {
            val startPoint = commandNode.startPoint
            val endPoint = commandNode.endPoint
            val bendAmount = commandNode.bendAmount.value
            val coordinates = listOf(
                listOf(startPoint.x.toDouble(), startPoint.y.toDouble()),
                listOf(endPoint.x.toDouble(), endPoint.y.toDouble())
            )
            GeoJsonFeature(
                type = "Feature",
                properties = mapOf("type" to "bend", "bendAmount" to bendAmount),
                geometry = GeoJsonGeometry(type = "LineString", coordinates = coordinates),
                features = emptyList()
            )
        }
        is BoxCommandNode -> {
            val startPoint = commandNode.startPoint
            val endPoint = commandNode.endPoint
            val coordinates = listOf(
                listOf(startPoint.x.toDouble(), startPoint.y.toDouble()),
                listOf(endPoint.x.toDouble(), startPoint.y.toDouble()),
                listOf(endPoint.x.toDouble(), endPoint.y.toDouble()),
                listOf(startPoint.x.toDouble(), endPoint.y.toDouble()),
                listOf(startPoint.x.toDouble(), startPoint.y.toDouble())
            )
            GeoJsonFeature(
                type = "Feature",
                properties = mapOf("type" to "box"),
                geometry = GeoJsonGeometry(type = "Polygon", coordinates = coordinates),
                features = emptyList()
            )
        }
        is CircCommandNode -> {
            val center = commandNode.center
            val radius = commandNode.radius.value.toDouble()
            val coordinates = generateCircleCoordinates(center.x.toDouble(), center.y.toDouble(), radius)
            GeoJsonFeature(
                type = "Feature",
                properties = mapOf("type" to "circle"),
                geometry = GeoJsonGeometry(type = "Polygon", coordinates = coordinates),
                features = emptyList()
            )
        }
        else -> throw IllegalArgumentException("Invalid command node.")
    }
}

data class GeoJsonObject(
    val type: String,
    val features: List<GeoJsonFeature>
) {
    fun toJsonString(): String {
        return Gson().toJson(this)
    }
}

data class GeoJsonFeature(
    val type: String,
    val properties: Map<String, Any?>,
    val geometry: GeoJsonGeometry?,
    val features: List<GeoJsonFeature>
)

data class GeoJsonGeometry(
    val type: String,
    val coordinates: List<List<Double>>
)



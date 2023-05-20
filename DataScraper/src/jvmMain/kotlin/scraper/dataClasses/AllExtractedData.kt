package scraper.dataClasses
import kotlinx.serialization.Serializable

@Serializable
data class AllExtractedData (
    var cryptoList: List<Crypto>
)
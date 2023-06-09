// CRYPTO DATA CLASS FOR SAVING CRYPTO NAME AND CURRENT VALUE

package scraper.dataClasses
import kotlinx.serialization.Serializable

@Serializable
data class Crypto(val name: String, val price: String, val exchange: String)
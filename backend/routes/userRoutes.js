const router = require("express").Router();
const userController = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");

//User routes
router.get("/", auth, userController.show);
router.get("/:userId/myCurrencies", userController.listUserCryptos);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post(":userId/addUserCurrency", userController.addUserCrypto);
router.delete("/delete", auth, userController.delete);
router.delete(
  "/:userId/deleteUserCurrency/:cryptoId",
  userController.deleteUserCrypto
);
router.post("/tokenIsValid", userController.tokenIsValid);

module.exports = router;

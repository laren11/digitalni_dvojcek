const router = require("express").Router();
const userController = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");

//User routes
router.get("/", auth, userController.show);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/addUserCrypto", userController.addUserCrypto);
router.delete("/delete", auth, userController.delete);
router.post("/tokenIsValid", userController.tokenIsValid);
router.post("/getSaved", userController.getSaved);

module.exports = router;

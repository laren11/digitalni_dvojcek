const router = require("express").Router();
const userController = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");

//User routes
router.get("/", auth, userController.show);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete("/delete", auth, userController.delete);

router.post("/tokenIsValid", userController.tokenIsValid);

module.exports = router;

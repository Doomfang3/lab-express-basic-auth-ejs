router.get("signup", (req,res) =>

router.post("/signup", async)

router.get("/login", async (req,res)) => {
    console.log("login route", req.body);
    const foundUser = await UserModel.findOne({username: req.body.username});
    if(foundUser){
    const paswordMatch = bcryptjs.compareSync(req.body.password, foundUser.password);
}
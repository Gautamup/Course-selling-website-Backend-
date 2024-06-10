const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { Course, User } = require("../db");

router.post('/signup',async (req, res) => {
    const username = req.body.username; 
    const password = req.body.password; 

    const isUserExist = await User.exists({username : username})
    if (isUserExist){
        res.status(404).json({message : "User already exist."})
    }else{
        await User.create({
            username : username,
            password : password
        })
        res.json({ message: 'User created successfully' })
    }
});

router.post('/signin',async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const isUserExist = await User.exists({username : username});
    if (isUserExist){
        let token = jwt.sign({username : username }, privateKey)
        res.json({token : token})
    }else{
        res.status(404).json({ message: 'Invalid Credentials.' })
    }
});

router.get('/courses',async (req, res) => {
    Course.find().then(function(courses){
        res.json({courses})
    })
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    const courseId = req.params.courseId
    console.log(courseId)
    try{
        let isExits = await Course.exists({_id : courseId})
        if (isExits) {
            await Course.findByIdAndUpdate( courseId, { $set : {purchasedBy : req.username}})
            res.status(200).json({ message: 'Course purchased successfully' }) 
        } 
    }catch(e){
        res.status(404).json({ message: 'Course not found.' }) 
    }
});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    let purchasedCourses = await Course.find({purchasedBy : req.username})
    res.json({purchasedCourses})
});

module.exports = router
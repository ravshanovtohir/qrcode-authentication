import User from "../model/user.js"
import error from "../utils/error.js";
import jwt from "../utils/jwt.js"
import bcrypt from "bcryptjs"


const REGISTER = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']

        if (!(email && password && first_name && last_name)) {
            return next(
                new error.ValidationError(400, "inputs is required")
            )
        }

        const oldUser = await User.findOne({ email })


        if (oldUser) {
            return next(
                new error.AuthorizationError(409, "User Already Exist. Please Login")
            )
        }

        let encryptedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        return res
            .status(201)
            .json({
                status: 201,
                message: 'The user successfully registired!',
                token: jwt.sign({ user_id: user._id, email, ip, agent }),
            })

    } catch (err) {
        console.log(err.message);
    }
}

const LOGIN = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']

        if (!(email || password)) {
            res.status(400).send("Input is required");
        }

        const user = await User.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id, email, ip, agent })

            // save user token
            user.token = token;

            // user
            return res
                .status(200)
                .json({
                    status: 200,
                    message: 'The user successfully registired!',
                    token: jwt.sign({ user_id: user._id, email, ip, agent }),
                })
        }

        return res
            .status(400)
            .json({
                status: 400,
                message: 'Invalid Credentials',
            })


    } catch (err) {
        console.log(err.message);
    }
}

export default {
    REGISTER,
    LOGIN
}
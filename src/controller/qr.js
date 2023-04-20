import User from "../model/user.js"
import QRCode from "../model/qrCode.js"
import connecteddevice from "../model/connectedDevice.js"
import qrcode from "qrcode"
import jwt from "jsonwebtoken"
import JWT from "../utils/jwt.js"
const QR_GENERATE = async (req, res, next) => {
    try {

        const { userId } = req.body
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']

        if (!userId) {
            throw new Error("User id required")
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found")
        }

        const qrExist = await QRCode.findOne({ userId });

        if (!qrExist) {
            await QRCode.create({ userId });
        }

        else {
            await QRCode.findOneAndUpdate({ userId }, { $set: { disabled: true } });
            await QRCode.create({ userId });
        }

        const encryptedData = jwt.sign(
            { userId: user._id, email: user.email, ip, agent },
            process.env.SECRET_KEY,
            {
                expiresIn: "1d",
            }
        );

        const dataImage = await qrcode.toDataURL(encryptedData)

        return res
            .status(200)
            .json({
                status: 200,
                data: dataImage,
            })


    } catch (error) {
        console.log(error.message);
    }

}

const QR_SCAN = async (req, res, next) => {
    try {
        const { token, deviceInformation } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']

        if (!token && !deviceInformation) {
            res.status(400).send("Token and deviceInformation is required");
        }

        const decoded = JWT.verify(token);

        const qrCode = await QRCode.findOne({
            userId: decoded.userId,
            disabled: false,
        });

        if (!qrCode) {
            res.status(400).send("QR Code not found");
        }

        const connectedDeviceData = {
            userId: decoded.userId,
            qrCodeId: qrCode._id,
            deviceName: deviceInformation.deviceName,
            deviceModel: deviceInformation.deviceModel,
            deviceOS: deviceInformation.deviceOS,
            deviceVersion: deviceInformation.deviceVersion,
        };

        const connectedDevice = await connecteddevice.create(connectedDeviceData);

        // Update qr code
        await QRCode.findOneAndUpdate(
            { _id: qrCode._id },
            {
                isActive: true,
                connectedDeviceId: connectedDevice._id,
                lastUsedDate: new Date(),
            }
        );

        // Find user
        const user = await User.findById(decoded.userId);

        // Create token
        const authToken = JWT.sign({ user_id: user._id, ip, agent })

        // Return token
        return res
            .status(200)
            .json({
                status: 200,
                token: authToken,
            })
    } catch (err) {
        console.log(err);
    }
}

export default {
    QR_GENERATE,
    QR_SCAN
}
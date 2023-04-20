import mongoose from "mongoose";
import { Schema } from "mongoose";


const connectedDeviceSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    qrCodeId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "qrCodes",
    },
    deviceName: { type: String, default: null },
    deviceModel: { type: String, default: null },
    deviceOS: { type: String, default: null },
    deviceVersion: { type: String, default: null },
    disabled: { type: Boolean, default: false },
});


export default mongoose.model("connectedDevice", connectedDeviceSchema)
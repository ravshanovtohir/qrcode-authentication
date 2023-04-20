import mongoose from "mongoose";
import { Schema } from "mongoose";

const qrCodeSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    connectedDeviceId: {
        type: Schema.Types.ObjectId,
        ref: "connectedDevices",
    },
    lastUsedDate: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

export default mongoose.model("qrCode", qrCodeSchema)
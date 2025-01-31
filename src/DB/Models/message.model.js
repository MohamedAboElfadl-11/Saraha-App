import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, {
    timestamps: true
})

const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema)

export default MessageModel
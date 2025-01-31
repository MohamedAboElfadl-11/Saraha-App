import MessageModel from "../../../DB/Models/message.model.js";
import UserModel from "../../../DB/Models/user.model.js"

export const sendMessageService = async (req, res) => {
    const { content, ownerId } = req.body
    // check if owner id is valid
    const user = await UserModel.findById(ownerId);
    if (!user) return res.status(404).json({ message: 'User not found' })
    const message = await MessageModel.create({ content, ownerId })
    res.status(200).json({ message: "message sent successfully", message })
}

export const getMessageService = async (req, res) => {
    // find => ref => populate
    const message = await MessageModel.find({}).populate(
        [
            {
                path: "ownerId",
                select: "-password -__v"
            }
        ]
    )
    res.status(200).json({ message: "Success", data: message })
}

export const getUserMessageService = async (req, res) => {
    const { _id } = req.authUser;
    const message = await MessageModel.find({ ownerId: _id });
    res.status(200).json({ message: "Success", data: message })
}
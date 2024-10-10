import Chat from "../models/chatModel.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send("UserId param not sent with request");
  }

  try {
    let existingChats = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name pic email" },
      });

    if (existingChats.length > 0) {
      return res.send(existingChats[0]);
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name pic email" },
      });

    return res.status(200).json(fullChat);
  } catch (error) {
    console.error("Error handling chat request:", error);
    return res.status(500).json({
      message: "Error occurred. Please try again",
      error: error.message,
    });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name pic email",
        },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({
      message: "Error occurred. Please try again",
      error: error.message,
    });
  }
};

export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .send({ message: "Group name and users are required" });
  }

  let users;

  try {
    users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).send({ message: "At least 2 users are required" });
    }

    if (!users.includes(req.user._id)) {
      users.push(req.user._id);
    }

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(400).send("Chat Not Found");
  } else {
    res.status(200).json(updatedChat);
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(400).send("Chat Not Found");
  } else {
    res.status(200).json(added);
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(400).send("Chat Not Found");
  } else {
    res.status(200).json(removed);
  }
};

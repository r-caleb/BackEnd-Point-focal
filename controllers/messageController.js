// controllers/messageController.js
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const { uploadFileToS3 } = require("../middleware/aws");

// Envoi de message

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const files = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadFileToS3(
          file.buffer,
          Date.now() + "-" + file.originalname,
          file.mimetype
        );
        files.push(result.Location); // URL du fichier sur S3
      }
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      files, // tableau d'URLs
    });

    await message.save();

    const notification = new Notification({
      user: receiverId,
      message: message._id,
    });
    await notification.save();

    res.status(200).json({ message: "Message envoyé", message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

// Récupérer les messages entre deux utilisateurs
exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id },
      ],
    }).populate({
      path: "sender",
      select: "firstname lastname email picture ministry",
      populate: { path: "ministry", select: "name" },
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getReceivedMessagesGroupedBySender = async (req, res) => {
  try {
    const userId = req.user.id;
    // Récupérer tous les messages où l'utilisateur connecté est le récepteur
    const messages = await Message.find({ receiver: userId })
      .populate({
        path: "sender",
        select: "firstname lastname email picture ministry",
        populate: { path: "ministry", select: "name" },
      })
      .sort({ createdAt: -1 }); // Trier du plus récent au plus ancien

    // Regrouper les messages par expéditeur
    const groupedMessages = messages.reduce((acc, message) => {
      const senderId = message.sender._id.toString();
      if (!acc[senderId]) {
        acc[senderId] = {
          sender: message.sender,
          messages: [],
        };
      }
      acc[senderId].messages.push(message);
      return acc;
    }, {});

    res.status(200).json({ messages: Object.values(groupedMessages) });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages reçus", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages reçus" });
  }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    // Vérifier que le message existe
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    // Optionnel : Vérifier que l'utilisateur est bien l'auteur du message
    if (message.sender.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à supprimer ce message" });
    }

    // Supprimer le message
    await Message.findByIdAndDelete(messageId);

    // Supprimer les notifications liées à ce message
    // await Notification.deleteMany({ message: messageId });

    res.status(200).json({ message: "Message supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du message :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du message" });
  }
};

const Message = require("../models/Message");
const Notification = require("../models/Notification");

// GET notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user: userId })
      .populate({
        path: "message",
        populate: {
          path: "sender", // ceci va peupler le champ sender avec les données de l'utilisateur
          model: "User", // assure-toi que c'est bien le nom de ton modèle User
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des notifications" });
  }
};

// PATCH /notifications/read/:id
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la notification" });
  }
};

// DELETE /notifications/:id
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    res.status(200).json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la notification" });
  }
};

// GET /api/notifications/unread/count/:userId
exports.countUnread = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors du comptage des notifications non lues" });
  }
};

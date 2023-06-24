const NotificationModel = require("../Models/NotificationModel");

async function createNotification(req, res) {
  const newNotification = new NotificationModel({
    userId: req.body.userId,
  });

  try {
    await newNotification.save();
    res.status(200).json("create notification successfull");
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getNotificationByUserId(req, res) {
  try {
    const notification = await NotificationModel.findOne({
      userId: req.params.userId,
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function addNotificationByUserId(req, res) {
  try {
    const notification = await NotificationModel.findOne({
      userId: req.params.userId,
    });

    notification.notifications = [
      req.body.notification,
      ...notification.notifications,
    ];

    await NotificationModel.updateOne(
      {
        userId: req.params.userId,
      },
      {
        notifications: notification.notifications,
      }
    );
    res.status(200).json("add successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  createNotification,
  getNotificationByUserId,
  addNotificationByUserId,
};

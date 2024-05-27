const express = require("express");
const eventController = express.Router();
const Event = require("../models/Event");
const transporter = require("../config/nodemailer");
const { createEvent, updateEvent } = require("../helpers/validateEvent");
const verifyToken = require("../middleware/authMiddleware");
const {
  getOrganizerEmailTemplate,
  getAttendeeEmailTemplate,
} = require("../helpers/emailTemplates");
const Config = require("../config/config");
eventController.get("/", verifyToken, (req, res) => {
  try {
    if (req.user) {
      Event.find({ deleted_at: null })
        .populate("attendees", "name email")
        .populate("organizer", "name email")
        .then((event) => {
          return res.status(200).json(event);
        })
        .catch((error) => {
          console.error(`Error while retrieving events: ${error}`);
          return res.status(500).send({ message: error.message });
        });
    } else {
      return res.status(401).json({ message: req.message });
    }
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return res.status(500).send({ message: error.message });
  }
});

eventController.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user) {
      const { error, value } = createEvent.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const event = new Event({
        name: value.name,
        date: value.date,
        time: value.time,
        user: req.user._id,
        organizer: req.user._id,
      });

      event
        .save()
        .then(async (event) => {
          return res.status(201).json(event);
        })
        .catch((err) => {
          console.error("Error while saving the event", err);
          return res.status(500).json({ message: err.message });
        });
    } else {
      return res.status(401).json({ message: req.message });
    }
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return res.status(500).send({ message: error.message });
  }
});

eventController.put("/:id", verifyToken, (req, res) => {
  try {
    if (req.user) {
      const { error, value } = updateEvent.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      Event.findById(req.params.id)
        .then((event) => {
          if (!event) {
            return res.status(404).json({ message: "Event not found" });
          }

          if (event.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Permission denied" });
          }

          Object.assign(event, value, { updated_at: Date.now() });

          event
            .save()
            .populate("attendees", "name email")
            .populate("organizer", "name email")
            .then((event) => {
              return res.status(200).json(event);
            })
            .catch((error) => {
              console.error(`Error while updating event: ${error}`);
              return res.status(500).send({ message: error.message });
            });
        })
        .catch((error) => {
          console.error(`Error while retrieving event to update: ${error}`);
          return res.status(500).send({ message: error.message });
        });
    } else {
      return res.status(401).json({ message: req.message });
    }
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return res.status(500).send({ message: error.message });
  }
});

eventController.delete("/:id", verifyToken, (req, res) => {
  try {
    if (req.user) {
      Event.findById(req.params.id)
        .then((event) => {
          if (!event) {
            return res.status(404).json({ message: "Event not found" });
          }

          if (event.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Permission denied" });
          }

          event.deleted_at = Date.now();
          event.updated_at = Date.now();

          event
            .save()
            .then((event) => {
              return res.status(200).json(event);
            })
            .catch((error) => {
              console.error(`Error while deleting the event: ${error}`);
              return res.status(500).send({ message: error.message });
            });
        })
        .catch((error) => {
          console.error(`Error while retrieving event to delete: ${error}`);
          return res.status(500).send({ message: error.message });
        });
    } else {
      return res.status(401).json({ message: req.message });
    }
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return res.status(500).send({ message: error.message });
  }
});

eventController.post("/:id/register", verifyToken, async (req, res) => {
  try {
    if (req.user) {
      Event.findById(req.params.id)
        .then((event) => {
          if (!event) {
            return res.status(404).json({ message: "Event not found" });
          }

          if (event.user.toString() == req.user._id.toString()) {
            return res
              .status(403)
              .json({ message: "You are an organizer for this event" });
          }

          if (event.attendees.includes(req.user._id)) {
            return res.status(400).json({ message: "User already registered" });
          }
          event.attendees.push(req.user._id);
          event
            .save()
            .then(async (event) => {
              const attendee = req.user;

              const attendeeMailOptions = {
                from: Config.EMAIL_USER,
                to: attendee.email,
                subject: `Registration Confirmation for ${event.name}`,
                html: getAttendeeEmailTemplate(
                  attendee.name,
                  event.name,
                ),
              };

            //   await transporter.sendMail(attendeeMailOptions);
              return res.status(200).json(event);
            })
            .catch((error) => {
              console.error(
                `Error while fetching the event to register: ${error}`
              );
              return res.status(500).send({ message: error.message });
            });
        })
        .catch((error) => {
          console.error(`Error while retrieving event to register: ${error}`);
          return res.status(500).send({ message: error.message });
        });
    } else {
      return res.status(401).json({ message: req.message });
    }
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return res.status(500).send({ message: error.message });
  }
});

module.exports = eventController;

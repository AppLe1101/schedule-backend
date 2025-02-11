const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const verifyJWT = require("../middleware/verifyJWT");
const authorizeRoles = require("../middleware/authorizeRoles");

// GET /api/groups
router.get("/groups", async (req, res) => {
  try {
    const groups = await Group.find({});
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/groups/:id
router.get("/groups/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/groups/:id/schedule
router.put(
  "/groups/:id/schedule",
  verifyJWT,
  authorizeRoles(["teacher", "director"]),
  async (req, res) => {
    const { schedule } = req.body;
    try {
      const group = await Group.findById(req.params.id);
      if (!group) return res.status(404).json({ message: "Group not found" });

      group.schedule = schedule;
      await group.save();
      res.json({ message: "Schedule updated", group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/groups/:id/assign-teacher
router.put(
  "/groups/:id/assign-teacher",
  verifyJWT,
  authorizeRoles(["director"]),
  async (req, res) => {
    const { lessonId, teacherName } = req.body;
    try {
      const group = await Group.findById(req.params.id);
      if (!group) return res.status(404).json({ message: "Group not found" });

      const lesson = group.schedule.id(lessonId);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });

      lesson.teacher = teacherName;
      await group.save();
      res.json({ message: "Teacher assigned", group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /api/groups/:id/remove-teacher
router.put(
  "/groups/:id/remove-teacher",
  verifyJWT,
  authorizeRoles(["director"]),
  async (req, res) => {
    const { lessonId } = req.body;
    try {
      const group = await Group.findById(req.params.id);
      if (!group) return res.status(404).json({ message: "Group not found" });

      const lesson = group.schedule.id(lessonId);
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });

      lesson.teacher = "";
      await group.save();
      res.json({ message: "Teacher removed", group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/groups - создание новой группы (доступно только директору)
router.post(
  "/groups",
  verifyJWT,
  authorizeRoles(["director"]),
  async (req, res) => {
    try {
      const { name, schedule } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Название группы обязательно" });
      }

      const newGroup = new Group({
        name,
        schedule: schedule || [],
      });

      await newGroup.save();
      res.status(201).json(newGroup);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

// DELETE /api/groups/:id - удаление группы (доступно только директору)

router.delete(
  "/groups/:id",
  verifyJWT,
  authorizeRoles(["director"]),
  async (req, res) => {
    try {
      const group = await Group.findByIdAndDelete(req.params.id);
      if (!group) return res.status(404).json({ message: "Группа не найдена" });
      res.json({ message: "Группа удалена", group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

module.exports = router;

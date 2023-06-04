const { Chapters } = require("../models/chapters");
const { validateToken } = require("../utils/validatetoken");

const addChapters = async (req, res) => {
  const { title, description, image, practical, course } = req.body;

  const val_result = validateToken(req.headers.authorization);

  if (val_result.valid && val_result.role !== "admin") {
    res.status(401).json({
      message: "Access Denied ",
    });
    return;
  }

  const chapter = await Chapters.create({
    title,
    description,
    practical,
    image,
    course,
    createdBy: val_result.user,
  });
};

module.exports = {
  addChapters,
};

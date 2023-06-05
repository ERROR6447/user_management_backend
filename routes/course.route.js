const express = require("express");

const {
  addCourse,
  updateCourse,
  deleteCourse,
  AddStudentstoCourse,
  getAllCourse,
  getStudentCourse,
} = require("../controller/courses");

const router = express.Router();

router.post("/addCourse", addCourse);

router.put("/updateCourse/:courseId", updateCourse);

router.delete("/deleteCourse/:courseId", deleteCourse);

router.post("/enroll_student/:courseId", AddStudentstoCourse);

router.get("/getAllCourses", getAllCourse);

router.get("/getCourses/:studentId", getStudentCourse);

module.exports = router;

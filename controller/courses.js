const { Courses } = require("../models/courses");
const { User } = require("../models/user");

const { validateToken } = require("../utils/validatetoken");

const addCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const val_result = validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.create({
      title,
      description,
      createdBy: val_result.user,
      enrolled_students: [],
    });

    if (!course) {
      res.status(500).json({ message: "Error While updating Course" });
      return;
    }

    res.status(200).json({
      message: "course created successfully",
      course,
    });
  } catch (err) {
    console.log("Error While Creating Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Creating Course", error: err });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const val_result = validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const result = await Courses.findOneAndUpdate(
      { _id: req.params.courseId },
      {
        $set: {
          title,
          description,
        },
      },
      { new: true }
    );

    if (!result) {
      res.status(500).json({ message: "Error While updating Course" });
      return;
    }
    res
      .status(200)
      .json({ message: "Course Updated Successfully", course: result });
  } catch (err) {
    console.log("Error While Updating Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Updating Course", error: err });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const val_result = validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const dcourse = await Courses.findOneAndDelete({
      _id: req.params.courseId,
    });

    if (!dcourse) {
      res
        .status(500)
        .json({ message: "Error While Deleting Course", course: dcourse });
      return;
    }
    res.status(200).json({ message: "Course Deleted Successfully" });
  } catch (err) {
    console.log("Error While Deleting Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Deleting Course", error: err });
  }
};

const AddStudentstoCourse = async (req, res) => {
  try {
    const { studentEmail, stack } = req.body;

    const val_result = validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const student = await User.findOneAndUpdate(
      { email: studentEmail },
      {
        $set: {
          stack: stack,
        },
      },
      { new: true }
    );

    if (!student) {
      res.status(500).json({ message: "Error While updating Student Stack" });
      return;
    }

    const uCourse = await Courses.findByIdAndUpdate(
      req.params.courseId,
      { $addToSet: { enrolled_students: student._id } },
      { new: true }
    );

    if (!uCourse) {
      res
        .status(500)
        .json({ message: "Error While Enrolling Student for Course" });
      return;
    }
    res
      .status(200)
      .json({ message: "Student Enrollment Successfull", course: uCourse });
  } catch (err) {
    console.log("Error While Enrolling Student for Course:\n", err);
    res.status(500).json({
      message: "Error While Enrolling Student for Course",
      error: err,
    });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const val_result = validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Need to Login to Access Course List ",
      });
      return;
    }

    const AllCourses = await Courses.find({}).populate("enrolled_students");

    if (!AllCourses) {
      res.status(500).json({ message: "Error While Fetching All Courses" });
      return;
    }
    res.status(200).json({ message: "All Courses", courses: AllCourses });
  } catch (err) {
    console.log("Error While Fetching Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Fetching Course", error: err });
  }
};

const getStudentCourse = async (req, res) => {
  try {
    const val_result = validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const StudCourses = await Courses.find({
      enrolled_students: req.params.studentId,
    })
      .populate({
        path: "createdBy",
        select: { username: 1, email: 1 },
      })
      .select({
        _id: 1,
        title: 1,
        description: 1,
        createdBy: 1,
      });

    if (!StudCourses) {
      res.status(500).json({ message: "Error While Fetching All Courses" });
      return;
    }
    res.status(200).json({ message: "All Courses", courses: StudCourses });
  } catch (err) {
    console.log("Error While Creating Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Creating Course", error: err });
  }
};

module.exports = {
  addCourse,
  updateCourse,
  deleteCourse,
  AddStudentstoCourse,
  getAllCourse,
  getStudentCourse,
};

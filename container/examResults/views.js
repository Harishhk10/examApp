const { ExamResultModel } = require("./model");
const { StudentModel } = require("../students/model");
const { ExamModel } = require("../exam/model");
const { findOneModel } = require("../../database/db_model");
const { ObjectId } = require("mongodb");

const examResultsViewAdd = async (req, res) => {
  try {
    const { mark, student, exam } = req.body;
    const studentId = await StudentModel.findById(student);
    if (!studentId) {
      return res
        .status(404)
        .send({ status: false, message: "Student not found" });
    }

    // Fetch exam by ID
    const examId = await ExamModel.findOne({
      _id: new ObjectId(exam),
      // deleteStatus: true,
    });
    if (examId.totalMarks < mark) {
      return res.status(404).send({
        status: false,
        message: "Exam mark is not higher than total marks",
      });
    }
    console.log(examId, "echehhh");
    if (examId.deleteStatus === true) {
      return res
        .status(404)
        .send({ status: false, message: "Exam not found or deleted" });
    }
    const newExamResult = new ExamResultModel({
      mark,
      student,
      exam,
    });

    await newExamResult
      .save()
      .then(() => {
        return res
          .status(201)
          .json({ status: true, message: "Exam result added successfully" });
      })
      .catch((err) => {
        return res.status(400).json({ status: false, message: err.message });
      });
  } catch (error) {
    console.log("Error adding exam result", error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

const examsResultsUpdateView = async (req, res) => {
  try {
    const { id } = req.params; // Extract student ID from the request parameters
    const updates = req.body; // Extract updates from the request body

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "No updates provided", status: false });
    }

    const validUpdates = Object.keys(updates).every((update) => {
      const schemaType = ExamResultModel.schema.path(update);
      return schemaType && schemaType.instance; // Check if schemaType exists and has an instance property
    });
    if (!validUpdates) {
      return res
        .status(400)
        .json({ error: "Invalid updates provided", status: false });
    }

    updates["updatedAt"] = new Date();
    const result = await ExamResultModel.updateOne(
      { _id: id }, // Filter by student ID
      { $set: updates }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        status: false,
        message: "Student not found or no changes applied",
      });
    }

    res
      .status(200)
      .json({ status: true, message: "exam results updated successfully" });
  } catch (error) {
    console.error("Error updating exam results:", error);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

const examFResultsDeleteView = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ status: false, message: "id is required" });
    }

    const result = await ExamResultModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "No exam result found with the given id",
      });
    }

    res
      .status(200)
      .json({ status: true, message: "Exam result deleted successfully" });
  } catch (error) {
    console.log("Error deleting exam result", error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};


// implemented with server side pagination

const examResultsGetView = async (req, res) => {
  const { limit, pages, examId } = req.query;
  const page = (pages, 1) || 1;
  const skipPage = parseInt(page, 1) || 1; // Default page to 1 if not provided
  const limitNum = parseInt(limit, 10) || 10; // Default limit to 10 if not provided

  const page_skip = Math.abs(skipPage - 1) * limitNum; // Calculate skip based on page and limit

  if (!examId) {
    return res.status(400).json({ status: false, message: "id is required" });
  }


  try {
    const countQuery = await ExamResultModel.countDocuments({
      exam: new ObjectId(examId),
    });

    const result = await ExamResultModel.aggregate([
      {
        $match: {
          exam: new ObjectId(examId), // Use examId from request instead of hard-coded value
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: page_skip,
      },
      {
        $limit: limitNum,
      },
      {
        $lookup: {
          from: "exams",
          localField: "exam",
          foreignField: "_id",
          as: "exams",
          pipeline: [
            {
              $project: {
                id: {
                  $toString: "$_id",
                },
                _id: 0,
                maxMarks: "$totalMarks",
                course: "$name",
                minPassMark: "$minPassMark",
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "students_name",
          pipeline: [
            {
              $project: {
                id: {
                  $toString: "$_id",
                },
                _id: 0,
                name: {
                  $concat: [
                    {
                      $ifNull: ["$firstName", ""],
                    },
                    " ",
                    {
                      $ifNull: ["$lastName", ""],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          exams: {
            $first: "$exams",
          },
          students_name: {
            $first: "$students_name",
          },
        },
      },
      {
        $project: {
          name: "$students_name.name",
          studentId: "$students_name.id",
          examName: "$exams.course",
          totalMarks: "$exams.maxMarks",
          examId: "$exams.id",
          marksGot: "$mark",
          result: {
            $cond: {
              if: {
                $gte: ["$mark", "$exams.minPassMark"],
              },
              then: "Pass",
              else: "Re-appear",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              id: { $toString: "$_id" },
              name: "$name",
              studentId: "$studentId",
              examName: "$examName",
              totalMarks: "$totalMarks",
              examId: "$examId",
              marksGot: "$marksGot",
              result: "$result",
            },
          },
        },
      },
      {
        $addFields: {
          currentRecords: {
            $size: "$data",
          },
        },
      },
      {
        $addFields: {
          totalPages: {
            $ceil: {
              $divide: ["$currentRecords", limitNum],
            },
          },
          totalRecords: countQuery,
          currentPage: parseInt(page),
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
      .then((result) => {
        if (result.length == 0) {
          return res.status(200).json({ data: result, status: true });
        }
        return res.status(200).json({ data: result[0], status: true });
      })
      .catch((error) => {
        console.log(error);
        return res.status(404).json({ data: error, status: false });
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: true });
  }
};

module.exports = {
  examResultsViewAdd,
  examsResultsUpdateView,
  examFResultsDeleteView,
  examResultsGetView,
};

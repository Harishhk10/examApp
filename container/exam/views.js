const { ExamModel } = require("./model");
const { ObjectId } = require("mongodb");

const ExamViewAdd = async (req, res) => {
  const {
    name,
    date,
    fromTime,
    toTime,
    totalMarks,
    totalQuestions,
    minPassMark,
  } = req.body;

  if (
    !name ||
    !date ||
    !fromTime ||
    !toTime ||
    !totalMarks ||
    !totalQuestions ||
    !minPassMark
  ) {
    return res.status(400).json({
      status: false,
      message: "date or name  fromTime  or toTime cannot be empty",
    });
  }

  try {
    const add = await new ExamModel({
      name: name,
      date: date,
      fromTime: fromTime,
      toTime: toTime,
      totalMarks: totalMarks,
      totalQuestions: totalQuestions,
      minPassMark: minPassMark,
    });
    await add
      .save()
      .then((doc) => {
        return res
          .status(201)
          .send({ message: "Exam details added successfully", success: true });
      })
      .catch((err) => {
        console.log(err, "errr");

        return res.status(400).send({ message: err.message, success: false });
      });
  } catch (error) {
    console.log(error, "erorrr 500");
    return res.status(500).send({ success: false, message: error });
  }
};

const ExamUpdateView = async (req, res) => {
  try {
    const { id } = req.params; // Extract student ID from the request parameters
    const updates = req.body; // Extract updates from the request body

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "No updates provided", status: false });
    }

    const validUpdates = Object.keys(updates).every((update) => {
      const schemaType = ExamModel.schema.path(update);
      return schemaType && schemaType.instance; // Check if schemaType exists and has an instance property
    });
    if (!validUpdates) {
      return res
        .status(400)
        .json({ error: "Invalid updates provided", status: false });
    }

    updates["updatedAt"] = new Date();
    const result = await ExamModel.updateOne(
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
      .json({ status: true, message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

const ExamDeleteView = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await ExamModel.findOneAndUpdate(
      { _id: id, examCompletedStatus: false }, // Find condition
      { $set: { deleteStatus: true } }, // Update to set deleteStatus to true
      { new: true } // Return the updated document
    );

    // If the exam is not found or already completed
    if (!exam) {
      return res.status(404).json({
        status: false,
        message: "Exam not found or already completed",
      });
    }

    // Exam was successfully marked for deletion
    res.status(200).json({ status: true, message: "Exam marked for deletion" });
  } catch (error) {
    console.log("Error marking the exam for deletion", error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

const examGetAllView = async (req, res) => {
  const { limit, pages } = req.query;
  const page = (pages, 1) || 1;
  const skipPage = parseInt(page, 1) || 1; // Default page to 1 if not provided
  const limitNum = parseInt(limit, 10) || 10; // Default limit to 10 if not provided

  const page_skip = Math.abs(skipPage - 1) * limitNum; // Calculate skip based on page and limit

  try {
    const countQuery = await ExamModel.countDocuments({
      deleteStatus: false,
    });
    ExamModel.aggregate([
      {
        $match: {
          deleteStatus: false,
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
        $group: {
          _id: null,
          data: {
            $push: {
              id: "$_id",
              name: "$name",
              date: "$date",
              fromTime: "$fromTime",
              toTime: "$toTime",
              totalMarks: "$totalMarks",
              totalQuestions: "$totalQuestions",
              examCompletedStatus: "$examCompletedStatus",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
      {
        $addFields: {
          records: {
            $size: "$data",
          },
        },
      },
      {
        $addFields: {
          total_pages: {
            $ceil: {
              $divide: ["$current_records", limitNum],
            },
          },
          totalRecords: countQuery,
          current_page: parseInt(page),
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

const examgetSingleView = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ExamModel.findOne({
      _id: new ObjectId(id),
    })

      .then((records) => {
        return res.status(200).json({ data: records, status: true });
      })
      .catch(() => {
        return res.status(404).json({
          status: false,
          data: [],
        });
      });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error,
    });
  }
};

module.exports = {
  ExamViewAdd,
  ExamUpdateView,
  ExamDeleteView,
  examGetAllView,
  examgetSingleView,
};

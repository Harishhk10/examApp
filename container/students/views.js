const { StudentModel } = require("./model");
const { ObjectId } = require("mongodb");
const { classroomModel } = require("../classroom/model");
const mongoose = require("mongoose");

const StudentViewAdd = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Extracting data from the request body
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      city,
      state,
      country,
      gender,
      phoneNumber,
      activeStatus,
      classroomId,
    } = req.body;

    // Creating a new student document
    const newStudent = new StudentModel({
      firstName,
      lastName,
      dateOfBirth,
      email,
      city,
      state,
      country,
      gender,
      phoneNumber,
      activeStatus,
      classroomId,
    });

    const checkCapacity = await classroomModel.findOne({
      _id: new ObjectId(classroomId),
    });
    if (checkCapacity.capacity === checkCapacity.student.length) {
      return res.send({
        message: "Classroom is full, please choose another one",
        status: false,
      });
    }
    await newStudent.save({ session });
    await classroomModel.updateOne(
      { _id: new Object(classroomId) },
      { $push: { student: newStudent._id } }
    );
    await session.commitTransaction();

    session.endSession();
    return res.status(201).json({
      status: true,
      message: "Student added successfully",
      data: newStudent,
    });

    // Responding with success message
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Internal server error", status: false });
  }
};

const StudentDeleteView = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: false, message: "id is required" });
  }

  try {
    const deleteClassroom = await StudentModel.updateOne(
      { _id: new Object(id) },
      { activeStatus: false }
    )
      .then((doc) => {
        return res.send({
          message: "Requested students data deleted successfully",
          success: true,
        });
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

const StudentUpdateView = async (req, res) => {
  try {
    const { id } = req.params; // Extract student ID from the request parameters
    const updates = req.body; // Extract updates from the request body

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "No updates provided", status: false });
    }

    const validUpdates = Object.keys(updates).every((update) => {
      const schemaType = StudentModel.schema.path(update);
      return schemaType && schemaType.instance; // Check if schemaType exists and has an instance property
    });
    if (!validUpdates) {
      return res
        .status(400)
        .json({ error: "Invalid updates provided", status: false });
    }

    updates["updatedAt"] = new Date();
    const result = await StudentModel.updateOne(
      { _id: id }, // Filter by student ID
      { $set: updates }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "Student not found or no changes applied" });
    }

    res
      .status(200)
      .json({ status: true, message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error", status: false });
  }
};

const studentsGetallView = async (req, res) => {
  const { limit, pages } = req.query;
  const page = (pages, 1) || 1;
  const skipPage = parseInt(page, 1) || 1; // Default page to 1 if not provided
  const limitNum = parseInt(limit, 10) || 10; // Default limit to 10 if not provided

  const page_skip = Math.abs(skipPage - 1) * limitNum; // Calculate skip based on page and limit

  try {
    const countQuery = await StudentModel.countDocuments({});
    const result = await StudentModel.aggregate([
      {
        $match: {
          activeStatus: true,
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
              firstName: "$firstName",
              lastName: "$lastName",
              dateOfBirth: "$dateOfBirth",
              email: "$email",
              city: "$city",
              state: "$state",
              country: "$country",
              gender: "$gender",
              phoneNumber: "$phoneNumber",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              id: "$_id",
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

const studentSingleGetView = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: false, message: "id is required" });
  }

  try {
    // Get the record from DB using its ID
    let record = await StudentModel.findById(id);

    // If no such record found in DB
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    // If record found, send it as response
    res.status(200).json(record);
  } catch (error) {
    // If an error occurs during DB query
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error",status:false });
  }
};

module.exports = {
  StudentViewAdd,
  StudentDeleteView,
  StudentUpdateView,
  studentsGetallView,
  studentSingleGetView,
};

const { StudentModel } = require("./model");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const StudentViewAdd = async (req, res) => {
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
    });

    // Saving the new student to the database
    await newStudent
      .save()
      .then(() => {
        // Responding with success message
        return res.status(201).json({
          status: true,
          message: "Student added successfully",
          data: newStudent,
        });
      })
      .catch((err) => {
        return res.status(400).json({ message: err.message, status: false });
      });
  } catch (error) {
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
    console.log(validUpdates, "validUpdates");
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
module.exports = { StudentViewAdd, StudentDeleteView, StudentUpdateView };

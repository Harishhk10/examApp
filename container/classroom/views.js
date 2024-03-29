const { classroomModel } = require("./model");
const { ObjectId } = require("mongodb");

const classroomView = async (req, res) => {
  const { name, capacity } = req.body;

  if (!name || !capacity) {
    return res
      .status(400)
      .json({ status: false, message: "capacity and name cannot be empty" });
  }

  try {
    const add = await new classroomModel({ name: name, capacity: capacity });
    await add
      .save()
      .then((doc) => {
        return res
          .status(201)
          .send({ message: "added successfully", success: true });
      })
      .catch((err) => {
        console.log(err, "errr");

        return res.status(400).send({ message: err.message, success: false });
      });
  } catch (error) {
    console.log(error, "erorrr 500");
    return res.status(500).se;
    nd({ success: false, message: error });
  }
};

const classroomwDeleteView = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: false, message: "id is required" });
  }

  try {
    const deleteClassroom = await classroomModel
      .deleteOne({ _id: new Object(id) })
      .then((doc) => {
        return res.send({ message: "deleted successfully", success: true });
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
      const schemaType = classroomModel.schema.path(update);
      return schemaType && schemaType.instance; // Check if schemaType exists and has an instance property
    });
    if (!validUpdates) {
      return res
        .status(400)
        .json({ error: "Invalid updates provided", status: false });
    }

    updates["updatedAt"] = new Date();
    const result = await classroomModel.updateOne(
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





const classroomGetView = async (req, res) => {
  try {
    classroomModel
      .aggregate([
        {
          $unwind: {
            path: "$student",
            preserveNullAndEmptyArrays: true,
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
            students_name: {
              $first: "$students_name",
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            students: {
              $push: "$students_name",
            },
            name: {
              $first: "$name",
            },
            capacity: {
              $first: "$capacity",
            },
            createdAt: {
              $first: "$createdAt",
            },
            updatedAt: {
              $first: "$updatedAt",
            },
          },
        },
      ])
      .then((result) => {
        if (result.length == 0) {
          return res.status(200).json({ data: result, status: true });
        }
        return res.status(200).json({ data: result, status: true });
      })
      .catch((error) => {
        console.log(error);
        return res.status(404).json({ data: error, status: false });
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: true });
  }
};

const classroomSingleGetView = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res
        .status(404)
        .send({ status: false, message: "class room  not found" });
    }

    classroomModel
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $unwind: {
            path: "$student",
            preserveNullAndEmptyArrays: true,
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
            students_name: {
              $first: "$students_name",
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            students: {
              $push: "$students_name",
            },
            name: {
              $first: "$name",
            },
            capacity: {
              $first: "$capacity",
            },
            createdAt: {
              $first: "$createdAt",
            },
            updatedAt: {
              $first: "$updatedAt",
            },
          },
        },
      ])
      .then((result) => {
        if (result.length == 0) {
          return res.status(200).json({ data: result, status: true });
        }
        return res.status(200).json({ data: result, status: true });
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
  classroomView,
  classroomwDeleteView,
  classroomGetView,
  classroomSingleGetView,
  examsResultsUpdateView
};

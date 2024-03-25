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
        return res.send({ message: "added successfully", success: true });
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

const classroomwDeleteView = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: false, message: "id is required" });
  }

  try {
    const deleteClassroom = await classroomModel
      .deleteOne({ _id: new Object(id) })
      .then((doc) => {
        return res.send({ message: "deleted  successfully", success: true });
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

module.exports = { classroomView, classroomwDeleteView };

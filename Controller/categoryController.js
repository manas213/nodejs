// exports.showInfo = (req, res) => {
//     res.send("Message from Controller")
// }
// exports.showMessage = (req, res) => {
//     res.send("This is another message from Controller")
// }

const { findOne } = require("../Model/category");
const Category = require("../Model/category");

// to add all category
exports.addCategory = async (req, res) => {
  let category = new Category(req.body);
  Category.findOne(
    { category_name: category.category_name },
    async (error, data) => {
      if (data == null) {
        category = await category.save(); //awaits until the category is saved
        if (!category) {
          return res.sendStatus(400).json({ error: "Something went wrong." });
        } else {
          return res.send(category);
        }
      }
      return res.sendStatus(400).json({ error: "Category already exists." });
    }
  );
};

// to show all category
exports.showCategories = async (req, res) => {
  let categories = await Category.find();
  if (!categories) {
    return res.sendStatus(400).json({ error: "Something went wrong." });
  } else {
    return res.send(categories);
  }
};

// to view a category
exports.findCategory = async (req, res) => {
  let category = await Category.findById(req.params.id); // let category = await Category({_id: req.params.id});
  if (!category) {
    return res.sendStatus(400).json({ error: "Something went wrong." });
  } else {
    return res.send(category);
  }
};

// to update a category
exports.updateCategory = async (req, res) => {
  let category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      category_name: req.body.category_name,
    },
    { new: true }
  );
  if (!category) {
    return res.sendStatus(400).json({ error: "Something went wrong" });
  } else {
    return res.send(category);
  }
};

// to delete a category
exports.deleteCategory = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (!category) {
        return res.status(400).json({ error: "Category not found" });
      } else {
        return res.status(200).json({ msg: "Category deleted successfully" });
      }
    })
    .catch((error) => res.sendStatus(400).json({ error: error }));
};

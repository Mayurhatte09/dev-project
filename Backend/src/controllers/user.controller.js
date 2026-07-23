const User = require("../models/user.model");
const { Op } = require("sequelize");

class UserController {
  // Create User
  static async createUser(req, res) {
    try {
      const { name, email, password, department } = req.body;

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const newUser = await User.create({
        name,
        email,
        password,
        department,
      });

      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  // Get All Users (With Pagination & Search)
  static async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 5, search = '' } = req.query;
      const offset = (page - 1) * limit;

      const queryOptions = {
        order: [["id", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      };

      if (search) {
        queryOptions.where = {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        };
      }

      const { rows, count } = await User.findAndCountAll(queryOptions);

      res.status(200).json({
        data: rows,
        totalItems: count
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  // Get User By ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  // Update User
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, department } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await user.update({
        name,
        email,
        password,
        department,
      });

      res.status(200).json({
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  // Delete User
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await user.destroy();

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = UserController;
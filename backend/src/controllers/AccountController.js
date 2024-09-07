const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const GenerateToken = require("../util/token");
const {
  generateVerificationCode,
  sendVerificationEmail,
  verifyCode,
} = require("../util/verifiEmail");

class AccountController {
  async Login(req, res) {
    try {
      let data = req.body;
      const account = await Account.findOne({
        username: data.username,
        password: data.password,
      });

      if (account) {
        if (account.status === "active") {
          const token = GenerateToken(account._id);
          return res.json({
            status: "success",
            message: "Login successful",
            token,
          });
        }
        if (account.status === "inactive") {
          return res.json({
            status: "inactive",
            message: "Tài khoản chưa được kích hoạt",
          });
        }
      } else {
        return res.status(401).json({
          status: "login",
          message: "Sai tên đăng nhập hoặc mật khẩu",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }

  // Xử lý đăng ký
  async Register(req, res) {
    try {
      let data = req.body;

      const username = await Account.findOne({
        username: data.username,
      });
      const email = await Account.findOne({
        email: data.email,
      });
      const phoneNumber = await Account.findOne({
        phoneNumber: data.phoneNumber,
      });

      if (username) {
        return res.status(401).json({
          status: "error",
          type: "username",
        });
      }

      if (email) {
        return res.status(401).json({
          status: "error",
          type: "email",
        });
      }

      if (phoneNumber) {
        return res.status(401).json({
          status: "error",
          type: "phoneNumber",
        });
      }

      const verificationCode = generateVerificationCode();
      await sendVerificationEmail(data.email, verificationCode); // Thêm await

      const newAccount = new Account(data);
      await newAccount.save();

      const saveVerificationCode = async (userId, verificationCode) => {
        // Lưu mã xác thực vào database
        await Account.updateOne(
          { _id: userId },
          { verificationCode, codeExpires: Date.now() + 15 * 60 * 1000 } // Hết hạn sau 15 phút
        );
      };

      await saveVerificationCode(newAccount._id, verificationCode); // Thêm await

      return res.status(201).json({
        status: "success",
        message: "Code sent successfully",
        accountID: newAccount._id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }

  // Xác thực token
  async Authentication(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Ví dụ: "Bearer <token>"
      if (!token) {
        return res
          .status(401)
          .json({ status: "error", message: "No token provided" });
      }

      const data = jwt.verify(token, "sown");
      const account = await Account.findById(data._id);

      return res.json({ status: "success", account });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }
  async Verify(req, res) {
    const account = await Account.findOne({ _id: req.body.userID });
    const token = GenerateToken(account._id);
    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
      });
    }
    if (
      account.verificationCode === req.body.code &&
      Date.now() < account.codeExpires
    ) {
      account.status = "active";
      account.verificationCode = undefined; // Xóa mã xác thực sau khi thành công
      account.codeExpires = undefined; // Xóa thời gian hết hạn sau khi thành công
      await account.save();

      return res.status(200).json({
        status: "success",
        message: "Account successfully verified",
        token,
      });
    } else {
      // Mã xác thực không hợp lệ hoặc đã hết hạn

      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification code",
      });
    }
  }
}

module.exports = new AccountController();

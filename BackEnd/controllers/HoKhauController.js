    const HoKhau = require("../models/HoKhau");

    // Lấy tất cả hộ khẩu
    exports.getAll = async (req, res) => {
      try {
        const data = await HoKhau.find();
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    // Lấy theo IDHoKhau (KHÔNG phải ObjectId)
    exports.getId = async (req, res) => {
      try {
        const hk = await HoKhau.findOne({ IDHoKhau: req.params.id });

        if (!hk) return res.status(404).json({ message: "Không tìm thấy hộ khẩu!" });

        res.json(hk);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    // Thêm hộ khẩu
    exports.create = async (req, res) => {
      try {
        const data = req.body;

        const exists = await HoKhau.findOne({ IDHoKhau: data.IDHoKhau });
        if (exists) {
          return res.status(400).json({ message: "Mã hộ khẩu đã tồn tại!" });
        }

        const newHK = await HoKhau.create(data);
        res.json({ message: "Thêm thành công!", data: newHK });

      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    // Cập nhật hộ khẩu
    exports.update = async (req, res) => {
      try {
        const updated = await HoKhau.findOneAndUpdate(
          { IDHoKhau: req.params.id },
          req.body,
          { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Không tồn tại!" });

        res.json({ message: "Cập nhật thành công!", data: updated });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

    // Xoá hộ khẩu
    exports.delete = async (req, res) => {
      try {
        const deleted = await HoKhau.findOneAndDelete({ IDHoKhau: req.params.id });

        if (!deleted) return res.status(404).json({ message: "Không tồn tại!" });

        res.json({ message: "Xóa thành công!" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };

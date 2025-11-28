const NhanKhau = require ('../models/NhanKhau.js');

// Lấy tất cả nhân khẩu:
exports.getAll = async (req, res) => {
    try {
        const nhanKhaus = await NhanKhau.find();
        res.json(nhanKhaus);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

// Lấy thông tin dựa trên id:
exports.getId = async (req, res) => {
    try {
        const nhanKhau = await NhanKhau.findById(req.params.id);
        if (!nhanKhau) {
            return res.status(404).json({ message: 'Nhân khẩu không tồn tại' });
        }
        res.json(nhanKhau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm nhân khẩu mới:
exports.create = async (req, res) => {
    try {
        const newNhanKhau = await NhanKhau.create(req.body);
        res.json(newNhanKhau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin nhân khẩu:
exports.update = async (req, res) => {
    try {
        const updatedNhanKhau = await NhanKhau.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedNhanKhau) {
            return res.status(404).json({ message: 'Nhân khẩu không tồn tại' });
        }
        res.json(updatedNhanKhau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa nhân khẩu:
exports.delete = async (req, res) => {
    try {
        const deletedNhanKhau = await NhanKhau.findByIdAndDelete(req.params.id);
        if (!deletedNhanKhau) {
            return res.status(404).json({ message: 'Nhân khẩu không tồn tại' });
        }
        res.json(deletedNhanKhau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
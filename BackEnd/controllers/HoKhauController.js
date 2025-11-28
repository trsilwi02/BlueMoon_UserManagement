const HoKhau = require('../models/HoKhau');

// Lấy tất cả hộ khẩu:
exports.getAll = async (req, res) => {
    try {
        const hoKhaus = await HoKhau.find();
        res.json(hoKhaus);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin hộ khẩu dựa trên id:
exports.getId = async (req, res) => {
    try {
        const hoKhau = await HoKhau.findById(req.params.id);
        if (!hoKhau){
            return res.status(404).json({ message: 'Hộ khẩu không tồn tại' });
        }
        res.json(hoKhau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm hộ khẩu mới:
exports.create = async (req, res) => {
    try {
        const newHoKhau = await HoKhau.create(req.body);
        res.json(newHoKhau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cap nhật thông tin hộ khẩu:
exports.update = async (req, res) => {
    try {
        const updatedHoKhau = await HoKhau.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedHoKhau) {
            return res.status(404).json({ message: 'Hộ khẩu không tồn tại' });
        }
        res.json(updatedHoKhau);
    } catch (err) {
        res.status(500).json({ message: error.message });
    }
};
// Xóa hộ khẩu:
exports.delete = async (req, res) => {
    try {
        const deletedHoKhau = await HoKhau.findByIdAndDelete(req.params.id);
        if (!deletedHoKhau) {
            return res.status(404).json({ message: 'Hộ khẩu không tồn tại' });
        }
        res.json(deletedHoKhau);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }  
};
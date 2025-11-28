const Quy = require('../models/Quy');

// Lấy tất cả quỹ
exports.getAll = async (req, res) => {
    try {
        const quys = await Quy.find();
        res.json(quys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy quỹ theo ID
exports.getId = async (req, res) => {
    try {
        const quy = await Quy.findById(req.params.id);
        if (!quy) {
            return res.status(404).json({ message: 'Quỹ không tồn tại' });
        }
        res.json(quy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo quỹ mới
exports.create = async (req, res) => {
    try {
        const newQuy = new Quy(req.body);
        const savedQuy = await newQuy.save();
        res.json(savedQuy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật quỹ
exports.update = async (req, res) => {
    try {
        const updatedQuy = await Quy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuy) {
            return res.status(404).json({ message: 'Quỹ không tồn tại' });
        }
        res.json(updatedQuy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa quỹ
exports.delete = async (req, res) => {
    try {
        const deletedQuy = await Quy.findByIdAndDelete(req.params.id);
        if (!deletedQuy) {
            return res.status(404).json({ message: 'Quỹ không tồn tại' });
        }
        res.json({ message: 'Quỹ đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

const CongNo = require('../models/CongNo');

// Lấy tất cả công nợ:
exports.getAll = async (req, res) => {
    try {
        const congNos = await CongNo.find();
        res.json(congNos);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    } 
};

// Lấy thông tin công nợ dựa trên id:
exports.getId = async (req, res) => {
    try {
        const congNo = await CongNo.findById(req.params.id);
        if (!congNo){
            return res.status(404).json({ message: 'Công nợ không tồn tại' });
        }
        res.json(congNo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm công nợ mới:
exports.create = async (req, res) => {
    try {
        const newCongNo = await CongNo.create(req.body);
        res.json(newCongNo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin công nợ:
exports.update = async (req, res) => {
    try {
        const updatedCongNo = await CongNo.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedCongNo) {
            return res.status(404).json({ message: 'Công nợ không tồn tại' });
        }
        res.json(updatedCongNo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa công nợ:
exports.delete = async (req, res) => {
    try {
        const deletedCongNo = await CongNo.findByIdAndDelete(req.params.id);
        if (!deletedCongNo) {
            return res.status(404).json({ message: 'Công nợ không tồn tại' });
        }
        res.json(deletedCongNo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


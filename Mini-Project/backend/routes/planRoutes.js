const express = require('express');
const router = express.Router();
const { createPlan, getPlan } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createPlan);
router.get('/', protect, getPlan);

module.exports = router;
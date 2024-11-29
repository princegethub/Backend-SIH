const express = require('express');
const bcrypt = require('bcryptjs');
const Phed = require('../../models/Phed');
const jwt = require('jsonwebtoken');
const router = express.Router();

/// http://localhost:5050/v1/api/phed/register
router.post('/register', async (req, res) => {
    const { name, phone_no, phed_id, password } = req.body;

    try {
        // Check if PHED ID or phone number already exists
        const existingPhed = await Phed.findOne({ $or: [{ phed_id }, { phone_no }] });
        if (existingPhed) {
            return res.status(400).json({ success: false, message: 'PHED ID or phone number already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new PHED user
        const phed = new Phed({
            name,
            phone_no,
            phed_id,
            password: hashedPassword,
        });

        await phed.save();
        res.status(201).json({ success: true, message: 'PHED user registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

/// http://localhost:5050/v1/api/phed/login
router.post('/login', async (req, res) => {
    const { phed_id, password } = req.body;

    try {
        // Check if PHED ID exists
        const phed = await Phed.findOne({ phed_id });
        if (!phed) {
            return res.status(400).json({ success: false, message: 'Invalid PHED ID or password.' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, phed.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid PHED ID or password.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ phed_id: phed.phed_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

/// http://localhost:5050/v1/api/phed/update
router.patch('/update', async (req, res) => {
    const { phed_id, name, phone_no, password } = req.body;

    try {
        // Check if PHED ID exists
        const phed = await Phed.findOne({ phed_id });
        if (!phed) {
            return res.status(404).json({ success: false, message: 'PHED ID not found.' });
        }

        // Update the name if provided
        if (name) {
            phed.name = name;
        }

        // Update the phone number if provided
        if (phone_no) {
            const phoneExists = await Phed.findOne({ phone_no });
            if (phoneExists && phoneExists.phed_id !== phed_id) {
                return res.status(400).json({ success: false, message: 'Phone number already in use.' });
            }
            phed.phone_no = phone_no;
        }

        // Update the password if provided
        if (password) {
            phed.password = await bcrypt.hash(password, 10); // Hash the new password
        }

        // Save the updated document
        await phed.save();

        res.status(200).json({
            success: true,
            message: 'PHED information updated successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;

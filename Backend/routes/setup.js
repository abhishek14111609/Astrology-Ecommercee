const express = require('express');
const db = require('../db');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Initialize Database with Schema
router.post('/init-database', async (req, res) => {
    try {
        // Read schema file
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Remove comments and split by semicolons
        const cleanedSchema = schema
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))  // Remove comment lines
            .join('\n');

        // Split by semicolons and filter out empty statements
        const statements = cleanedSchema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && stmt.toUpperCase().includes('CREATE'));

        const results = [];

        // Execute each statement
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await db.query(statement);
                    const preview = statement.substring(0, 100).replace(/\s+/g, ' ');
                    results.push({ success: true, statement: preview + '...' });
                } catch (err) {
                    const preview = statement.substring(0, 100).replace(/\s+/g, ' ');
                    results.push({ success: false, statement: preview + '...', error: err.message });
                }
            }
        }

        res.json({
            message: 'Database initialization completed',
            results,
            totalStatements: statements.length
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error initializing database',
            error: error.message
        });
    }
});

// Check Database Status
router.get('/database-status', async (req, res) => {
    try {
        const tables = [
            'users', 'categories', 'sub_categories', 'products',
            'quiz_questions', 'quiz_options', 'orders', 'order_items',
            'cart', 'wishlist'
        ];

        const status = {};

        for (const table of tables) {
            try {
                const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
                status[table] = { exists: true, count: rows[0].count };
            } catch (err) {
                status[table] = { exists: false, error: err.message };
            }
        }

        res.json({ status, database: 'auric_krystal' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking database status', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

const connectDB = require('./db');
const Transaction = require('./models/Transaction');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Connect MongoDB
connectDB();

// Health Check
app.get('/health', (req, res) => {
    res.json("This is the health check");
});

// ADD TRANSACTION
app.post('/transaction', async (req, res) => {
    try {
        const t = moment().unix();

        const transaction = await Transaction.create({
            amount: req.body.amount,
            description: req.body.desc
        });

        console.log("{ \"timestamp\" : %d, \"msg\" : \"Adding Expense\", \"amount\" : %d }", t, req.body.amount);

        res.status(200).json({ message: 'added transaction successfully', data: transaction });

    } catch (err) {
        res.status(500).json({ message: 'something went wrong', error: err.message });
    }
});

// GET ALL TRANSACTIONS
app.get('/transaction', async (req, res) => {
    try {
        const transactions = await Transaction.find();

        const t = moment().unix();
        console.log("{ \"timestamp\" : %d, \"msg\" : \"Getting All Expenses\" }", t);

        res.status(200).json({ result: transactions });

    } catch (err) {
        res.status(500).json({ message: "could not get all transactions", error: err.message });
    }
});

// DELETE ALL TRANSACTIONS
app.delete('/transaction', async (req, res) => {
    try {
        await Transaction.deleteMany();

        const t = moment().unix();
        console.log("{ \"timestamp\" : %d, \"msg\" : \"Deleted All Expenses\" }", t);

        res.status(200).json({ message: "All transactions deleted" });

    } catch (err) {
        res.status(500).json({ message: "Deleting failed", error: err.message });
    }
});

// DELETE ONE TRANSACTION
app.delete('/transaction/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: `transaction deleted` });

    } catch (err) {
        res.status(500).json({ message: "error deleting transaction", error: err.message });
    }
});

// GET SINGLE TRANSACTION
app.get('/transaction/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        res.status(200).json(transaction);

    } catch (err) {
        res.status(500).json({ message: "error retrieving transaction", error: err.message });
    }
});

app.listen(port, () => {
    const t = moment().unix();
    console.log("{ \"timestamp\" : %d, \"msg\" : \"App Started on Port %s\" }", t, port);
});

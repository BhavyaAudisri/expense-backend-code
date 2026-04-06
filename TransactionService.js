const Transaction = require('./models/Transaction');

// ADD TRANSACTION
async function addTransaction(amount, desc) {
    try {
        const transaction = await Transaction.create({
            amount: amount,
            description: desc
        });
        return transaction;
    } catch (err) {
        throw err;
    }
}

// GET ALL TRANSACTIONS
async function getAllTransactions() {
    try {
        const transactions = await Transaction.find();
        return transactions;
    } catch (err) {
        throw err;
    }
}

// GET SINGLE TRANSACTION
async function findTransactionById(id) {
    try {
        const transaction = await Transaction.findById(id);
        return transaction;
    } catch (err) {
        throw err;
    }
}

// DELETE ALL TRANSACTIONS
async function deleteAllTransactions() {
    try {
        const result = await Transaction.deleteMany();
        return result;
    } catch (err) {
        throw err;
    }
}

// DELETE ONE TRANSACTION
async function deleteTransactionById(id) {
    try {
        const result = await Transaction.findByIdAndDelete(id);
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    addTransaction,
    getAllTransactions,
    findTransactionById,
    deleteAllTransactions,
    deleteTransactionById
};

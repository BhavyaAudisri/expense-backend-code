#!/bin/bash
#configure backend
#=================
vi backend.sql
CREATE DATABASE IF NOT EXISTS transactions;
USE transactions;

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount INT,
    description VARCHAR(255)
);

CREATE USER IF NOT EXISTS 'expense'@'%' IDENTIFIED BY 'ExpenseApp@1';
GRANT ALL ON transactions.* TO 'expense'@'%';
FLUSH PRIVILEGES;

mysql -h mysql-dev.somisettibhavya.life -u root -pExpenseApp1 < backend.sql
mysql -h mysql-dev.somisettibhavya.life -u expense -pExpenseApp@1
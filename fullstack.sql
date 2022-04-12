-- Create database
CREATE DATABASE fullstack;

-- Create users table
CREATE TABLE `fullstack`.`users`
(
    `id` int NOT NULL auto_increment,
    `name` varchar(50),
    `email` varchar(60),
    `mobile` bigint(10),
    `created_at` timestamp,
    `updated_at` timestamp, PRIMARY KEY (id)
);
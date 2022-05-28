-- Create database
CREATE DATABASE fullstackapp;

-- Create users table
CREATE TABLE `fullstackapp`.`users`
(
    `id` int NOT NULL auto_increment,
    `name` varchar(50),
    `email` varchar(60),
    `mobile` bigint(10),
    `created_at` timestamp,
    `updated_at` timestamp, PRIMARY KEY (id)
);
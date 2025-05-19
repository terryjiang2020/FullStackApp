-- Add password column to users table
ALTER TABLE `fullstackapp`.`users` 
ADD COLUMN `password` VARCHAR(255) NOT NULL AFTER `email`;

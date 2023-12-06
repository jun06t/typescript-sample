/*
  Warnings:

  - You are about to drop the column `Age` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `Age`,
    ADD COLUMN `age` INTEGER NULL;

/*
  Warnings:

  - Made the column `age` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `age` INTEGER NOT NULL;

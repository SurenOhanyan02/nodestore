/*
  Warnings:

  - A unique constraint covering the columns `[resetLink]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetLink` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_resetLink_key` ON `user`(`resetLink`);

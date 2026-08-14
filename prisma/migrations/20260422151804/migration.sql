-- CreateTable
CREATE TABLE "videoLink" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "capture" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videoLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "videoLink" ADD CONSTRAINT "videoLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

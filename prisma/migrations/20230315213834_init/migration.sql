-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "installation" JSONB NOT NULL,
    "apiKey" TEXT,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

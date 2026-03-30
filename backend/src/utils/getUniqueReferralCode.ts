import crypto from "crypto";
import { prisma } from "../lib/prisma";

async function getUniqueReferralCode() {
  let referralCode: string = "";
  let isCodeExists = true;
  let attempts = 0;
  const maxAttempts = 10;

  while (isCodeExists && attempts < maxAttempts) {
    // Contoh format: AZA-XXXX (Bisa pakai prefix nama atau random total)
    referralCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const existingUser = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!existingUser) {
      isCodeExists = false;
    }
    attempts++;
  }

  if (isCodeExists) {
    // Jika 10x percobaan gagal (sangat jarang), tambahkan timestamp agar pasti unik
    referralCode = `REF-${Date.now().toString().slice(-4)}`;
  }

  return referralCode;
}

export default getUniqueReferralCode;

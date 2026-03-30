import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { EventCategory, PrismaClient, Role } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Hapus "Anak" (tabel yang merujuk ke User atau Event)
  /*   await prisma.point.deleteMany();
  await prisma.coupon.deleteMany();

  // 2. Hapus Event (karena Event merujuk ke User/Organizer)
  await prisma.event.deleteMany();

  // 3. Terakhir baru hapus User
  await prisma.user.deleteMany(); */

  console.log("Database cleaned. Starting seed...");

  const organizer = await prisma.user.findFirst({
    where: {
      fullName: "Azafa Organizer",
      email: "organizer@azafa.com",
      password: "Password123",
      role: Role.organizer,
      referralCode: "AZAFA2026",
      isVerified: true,
    },
  });

  if (!organizer) return;

  const images = [
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F928717573%2F92877393397%2F1%2Foriginal.20250106-171926?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=5e-07&fp-y=5e-07&s=26fb9b3e1b8f3416a1e2c2337e6a3e37",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F146651659%2F312123412152%2F1%2Foriginal.20210904-105444?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C1640%2C820&s=51e9942a0561567e2fa234ff86d06438",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1179070868%2F278679028852%2F1%2Foriginal.20260305-010645?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=bdc93949049bd80fde6815094279279d",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1179990088%2F1408362536703%2F1%2Foriginal.20260316-224333?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=a2c5eed202689f455989fd25cc6dbfca",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1143855983%2F5609178309%2F1%2Foriginal.20251003-165446?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&s=e2661d0fe64b99cf678ea2bda96d38c2",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1170566918%2F220572363630%2F1%2Foriginal.20251110-065603?crop=focalpoint&fit=crop&h=150&w=300&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=dfc3967418330a5fcff5474d3d90abce",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1173992540%2F308052947969%2F1%2Foriginal.20260105-112901?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=e34302f11ff3c0643c117ff4b9ce3c1b",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1179513065%2F312980622916%2F1%2Foriginal.20260310-183300?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&s=d0890bd98d28975299849ad0a9d1ae9c",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1173422199%2F626217048%2F1%2Foriginal.20251222-220503?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C3200%2C1600&s=e4318e642f9e5919646b9bb0d86082c2",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1160329743%2F2852248080931%2F1%2Foriginal.20251023-025501?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=917e05a39b6c60db376a91e6f0b4f3fd",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F658561599%2F700916941403%2F1%2Foriginal.20231214-115938?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C221%2C1280%2C640&s=07f6f64f08d6d84fd506f883f93fe8e7",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1175208302%2F2118280488193%2F1%2Foriginal.20260119-023403?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.027&fp-y=0.509&s=a1436837113df457bd1ba95e94ed4f0a",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1180744279%2F1411441932633%2F1%2Foriginal.20260326-120855?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=c47a6ea2860d671097a645a1fe6080b0",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1106852303%2F2790169531791%2F1%2Foriginal.20250827-183829?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.352272727273&fp-y=0.524242424242&s=b7fa8bdc7ea2f6584d00b77b89da05ac",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1179984784%2F1356037980893%2F1%2Foriginal.20260316-215221?h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C86%2C500%2C250&s=f994756678b25435e341b6fd612170c9",
  ];

  const categories = Object.values(EventCategory);
  const locations = ["Jakarta", "Bandung", "Surabaya", "Bali", "Tangerang"];

  for (let i = 0; i < images.length; i++) {
    await prisma.event.create({
      data: {
        title: `Event Spektakuler Ke-${i + 1}`,
        description: `Deskripsi seru untuk event ke-${i + 1}.`,
        price: i % 3 === 0 ? 0 : 50000 * (i + 1),
        date: new Date(2026, 4, i + 1),
        time: "19:00",
        location: locations[i % locations.length],
        availableSeats: 50 * (i + 1),
        category: categories[i % categories.length] as EventCategory,
        image: images[i],
        organizerId: organizer.id,
      },
    });
  }

  console.log("Seed v7 berhasil dijalankan! 🚀");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

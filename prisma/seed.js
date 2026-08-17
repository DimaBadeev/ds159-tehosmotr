const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const prices = [
  {
    code: "L",
    name: "Мотоциклы и мопеды (L1–L7)",
    description: "Двух- и трёхколёсные транспортные средства категорий L.",
    price: 22,
    sortOrder: 10,
    isExtra: false,
  },
  {
    code: "M1",
    name: "Легковые автомобили (M1)",
    description: "Легковые автомобили до 8 пассажирских мест, кроме водителя.",
    price: 38,
    sortOrder: 20,
    isExtra: false,
  },
  {
    code: "M1-4WD",
    name: "Легковые полноприводные (M1 4WD)",
    description: "Легковые автомобили категории M1 с полным приводом.",
    price: 42,
    sortOrder: 25,
    isExtra: false,
  },
  {
    code: "M2",
    name: "Автобусы (M2)",
    description: "Транспортные средства для перевозки пассажиров, более 8 мест, масса до 5 т.",
    price: 48,
    sortOrder: 30,
    isExtra: false,
  },
  {
    code: "M3",
    name: "Автобусы (M3)",
    description: "Автобусы и транспортные средства для перевозки пассажиров массой свыше 5 т.",
    price: 62,
    sortOrder: 40,
    isExtra: false,
  },
  {
    code: "N1",
    name: "Грузовые автомобили (N1)",
    description: "Грузовые автомобили разрешённой массой до 3,5 т.",
    price: 45,
    sortOrder: 50,
    isExtra: false,
  },
  {
    code: "N2",
    name: "Грузовые автомобили (N2)",
    description: "Грузовые автомобили массой от 3,5 до 12 т.",
    price: 58,
    sortOrder: 60,
    isExtra: false,
  },
  {
    code: "N3",
    name: "Грузовые автомобили (N3)",
    description: "Грузовые автомобили массой свыше 12 т.",
    price: 72,
    sortOrder: 70,
    isExtra: false,
  },
  {
    code: "O1",
    name: "Прицепы (O1)",
    description: "Прицепы разрешённой массой до 0,75 т.",
    price: 20,
    sortOrder: 80,
    isExtra: false,
  },
  {
    code: "O2",
    name: "Прицепы (O2)",
    description: "Прицепы массой от 0,75 до 3,5 т.",
    price: 26,
    sortOrder: 90,
    isExtra: false,
  },
  {
    code: "O3",
    name: "Прицепы (O3)",
    description: "Прицепы массой от 3,5 до 10 т.",
    price: 34,
    sortOrder: 100,
    isExtra: false,
  },
  {
    code: "O4",
    name: "Прицепы (O4)",
    description: "Прицепы массой свыше 10 т.",
    price: 42,
    sortOrder: 110,
    isExtra: false,
  },
  {
    code: "RECHECK",
    name: "Повторный осмотр после устранения замечаний",
    description: "Повторная диагностика после устранения выявленных неисправностей.",
    price: 15,
    sortOrder: 200,
    isExtra: true,
  },
  {
    code: "GBO",
    name: "Осмотр ТС с газобаллонным оборудованием",
    description: "Дополнительная проверка при наличии ГБО (нужен акт на баллон).",
    price: 8,
    sortOrder: 210,
    isExtra: true,
  },
];

const workingHours = [
  { weekday: 0, isOpen: false, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30", slotDuration: 20 },
  { weekday: 1, isOpen: true, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30", slotDuration: 20 },
  { weekday: 2, isOpen: true, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30", slotDuration: 20 },
  { weekday: 3, isOpen: true, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30", slotDuration: 20 },
  { weekday: 4, isOpen: true, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30", slotDuration: 20 },
  { weekday: 5, isOpen: true, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30", slotDuration: 20 },
  { weekday: 6, isOpen: false, startTime: "09:00", endTime: "17:00", breakStart: "12:30", breakEnd: "13:30", slotDuration: 20 },
];

function minskYmd(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Minsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(ymd, days) {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  return date.toISOString().slice(0, 10);
}

function nextWeekday(fromYmd, weekday) {
  const [y, m, d] = fromYmd.split("-").map(Number);
  const current = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const currentWeekday = current.getUTCDay();
  const delta = (weekday - currentWeekday + 7) % 7;
  return addDays(fromYmd, delta === 0 ? 0 : delta);
}

async function main() {
  const passwordHash = await bcrypt.hash("Admin159!", 12);

  await prisma.admin.upsert({
    where: { email: "admin@ds159.by" },
    update: { passwordHash, name: "Администратор ДС 159" },
    create: {
      email: "admin@ds159.by",
      passwordHash,
      name: "Администратор ДС 159",
    },
  });

  for (const item of prices) {
    await prisma.priceItem.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        sortOrder: item.sortOrder,
        isExtra: item.isExtra,
        isActive: true,
      },
      create: item,
    });
  }

  for (const hours of workingHours) {
    await prisma.workingHours.upsert({
      where: { weekday: hours.weekday },
      update: hours,
      create: hours,
    });
  }

  const m1 = await prisma.priceItem.findUnique({ where: { code: "M1" } });
  const m14 = await prisma.priceItem.findUnique({ where: { code: "M1-4WD" } });
  const n1 = await prisma.priceItem.findUnique({ where: { code: "N1" } });

  if (!m1 || !m14 || !n1) {
    throw new Error("Не удалось найти категории для тестовых записей");
  }

  const today = minskYmd();
  const monday = nextWeekday(today, 1);
  const tuesday = addDays(monday, 1);
  const wednesday = addDays(monday, 2);

  const samples = [
    {
      date: monday,
      timeSlot: "09:00",
      clientName: "Иванов Сергей Петрович",
      phone: "+375291112233",
      email: "ivanov@example.com",
      carNumber: "1234 AB-7",
      carBrand: "Volkswagen Tiguan",
      categoryId: m14.id,
      status: "confirmed",
      source: "online",
    },
    {
      date: monday,
      timeSlot: "10:20",
      clientName: "Козлова Анна Викторовна",
      phone: "+375297776655",
      email: "kozlova@example.com",
      carNumber: "5678 CD-7",
      carBrand: "Toyota Corolla",
      categoryId: m1.id,
      status: "pending",
      source: "online",
    },
    {
      date: tuesday,
      timeSlot: "11:00",
      clientName: "Петров Дмитрий Олегович",
      phone: "+375333334455",
      email: "petrov@example.com",
      carNumber: "9012 EF-5",
      carBrand: "GAZ Gazelle Next",
      categoryId: n1.id,
      status: "confirmed",
      source: "admin",
      notes: "Запись по телефону",
    },
    {
      date: wednesday,
      timeSlot: "14:00",
      clientName: "Сидорова Мария Ивановна",
      phone: "+375441234567",
      email: "sidorova@example.com",
      carNumber: "3456 GH-7",
      carBrand: "Skoda Octavia",
      categoryId: m1.id,
      status: "completed",
      source: "online",
    },
  ];

  for (const sample of samples) {
    const existing = await prisma.booking.findFirst({
      where: { date: sample.date, timeSlot: sample.timeSlot },
    });
    if (existing) continue;

    const booking = await prisma.booking.create({ data: sample });
    if (sample.status !== "cancelled") {
      await prisma.timeSlotLock.upsert({
        where: {
          date_timeSlot: { date: sample.date, timeSlot: sample.timeSlot },
        },
        update: { bookingId: booking.id },
        create: {
          date: sample.date,
          timeSlot: sample.timeSlot,
          bookingId: booking.id,
        },
      });
    }
  }

  console.log("Seed completed.");
  console.log("Admin login: admin@ds159.by");
  console.log("Admin password: Admin159!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

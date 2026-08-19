const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const prices = [
  {
    code: "L",
    name: "Мотоциклы и мопеды (L1–L7)",
    description: "Временно не принимаем. Можно снова включить в админке: «Показывать на сайте».",
    price: 22,
    sortOrder: 10,
    isExtra: false,
    isActive: false,
  },
  {
    code: "M1",
    name: "Легковой автомобиль (4x2)",
    description: "Легковые автомобили категории M1 с приводом 4x2.",
    price: 35.7,
    sortOrder: 20,
    isExtra: false,
    isActive: true,
  },
  {
    code: "M1-HYBRID",
    name: "Легковой автомобиль (4x2) гибрид",
    description: "Легковые гибридные автомобили с приводом 4x2.",
    price: 28.35,
    sortOrder: 22,
    isExtra: false,
    isActive: true,
  },
  {
    code: "M1-4WD",
    name: "Легковой автомобиль (4x4)",
    description: "Легковые полноприводные автомобили категории M1.",
    price: 37.8,
    sortOrder: 25,
    isExtra: false,
    isActive: true,
  },
  {
    code: "M1-4WD-HYBRID",
    name: "Легковой автомобиль (4x4) гибрид",
    description: "Легковые полноприводные гибридные автомобили.",
    price: 30.45,
    sortOrder: 26,
    isExtra: false,
    isActive: true,
  },
  {
    code: "M2",
    name: "Автобус массой не более 5 т",
    description: "Автобусы с технически допустимой общей массой не более 5 тонн.",
    price: 45.15,
    sortOrder: 30,
    isExtra: false,
    isActive: true,
  },
  {
    code: "M3",
    name: "Автобусы (M3)",
    description: "Автобусы массой свыше 5 т.",
    price: 62,
    sortOrder: 40,
    isExtra: false,
    isActive: true,
  },
  {
    code: "N1",
    name: "Грузовой автомобиль до 3,5 т",
    description: "Грузовые автомобили с технически допустимой общей массой не более 3,5 т.",
    price: 42,
    sortOrder: 50,
    isExtra: false,
    isActive: true,
  },
  {
    code: "N2",
    name: "Грузовой автомобиль / тягач 3,5–12 т",
    description: "Грузовые автомобили и седельные тягачи массой свыше 3,5 и не более 12 т.",
    price: 49.35,
    sortOrder: 60,
    isExtra: false,
    isActive: true,
  },
  {
    code: "N3",
    name: "Грузовой автомобиль / тягач более 12 т",
    description: "Грузовые автомобили и седельные тягачи массой свыше 12 т.",
    price: 56.7,
    sortOrder: 70,
    isExtra: false,
    isActive: true,
  },
  {
    code: "O1",
    name: "Прицеп не более 0,75 т",
    description: "Прицепы с технически допустимой общей массой не более 0,75 т.",
    price: 12.6,
    sortOrder: 80,
    isExtra: false,
    isActive: true,
  },
  {
    code: "O2",
    name: "Прицеп 0,75–3,5 т",
    description: "Прицепы массой свыше 0,75 и не более 3,5 т.",
    price: 16.8,
    sortOrder: 90,
    isExtra: false,
    isActive: true,
  },
  {
    code: "O3",
    name: "Прицепы (O3)",
    description: "Прицепы массой от 3,5 до 10 т.",
    price: 34,
    sortOrder: 100,
    isExtra: false,
    isActive: true,
  },
  {
    code: "O4",
    name: "Прицепы (O4)",
    description: "Прицепы массой свыше 10 т.",
    price: 42,
    sortOrder: 110,
    isExtra: false,
    isActive: true,
  },
  {
    code: "BRAKES",
    name: "Проверка тормозной системы (кроме 4x4)",
    description: "Отдельная проверка тормозной системы, кроме полноприводных ТС.",
    price: 13.65,
    sortOrder: 200,
    isExtra: true,
    isActive: true,
  },
  {
    code: "BRAKES-4WD",
    name: "Проверка тормозной системы (4x4)",
    description: "Отдельная проверка тормозной системы полноприводных ТС.",
    price: 16.8,
    sortOrder: 210,
    isExtra: true,
    isActive: true,
  },
  {
    code: "SMOKE",
    name: "Замер дымности отработавших газов",
    description: "Измерение дымности выхлопа.",
    price: 9.45,
    sortOrder: 220,
    isExtra: true,
    isActive: true,
  },
  {
    code: "TOXIC",
    name: "Замер токсичности отработавших газов",
    description: "Измерение токсичности выхлопа.",
    price: 10.5,
    sortOrder: 230,
    isExtra: true,
    isActive: true,
  },
  {
    code: "STEERING-PLAY",
    name: "Проверка суммарного люфта рулевого управления",
    description: "Контроль люфта рулевого управления.",
    price: 7.35,
    sortOrder: 240,
    isExtra: true,
    isActive: true,
  },
  {
    code: "SUSPENSION",
    name: "Проверка состояния подвески или рулевого привода",
    description: "Диагностика подвески и рулевого привода.",
    price: 7.85,
    sortOrder: 250,
    isExtra: true,
    isActive: true,
  },
  {
    code: "LIGHTS",
    name: "Проверка внешних световых приборов",
    description: "Контроль работы внешних световых приборов.",
    price: 8.4,
    sortOrder: 260,
    isExtra: true,
    isActive: true,
  },
  {
    code: "GLASS",
    name: "Проверка светопропускания стёкол",
    description: "Измерение светопропускания стёкол.",
    price: 7.35,
    sortOrder: 270,
    isExtra: true,
    isActive: true,
  },
  {
    code: "LEAK",
    name: "Проверка герметичности агрегатов и систем",
    description: "Контроль герметичности узлов и систем.",
    price: 7.85,
    sortOrder: 280,
    isExtra: true,
    isActive: true,
  },
  {
    code: "APPEARANCE",
    name: "Проверка внешнего вида и комплектации",
    description: "Осмотр внешнего вида и комплектации транспортного средства.",
    price: 7.35,
    sortOrder: 290,
    isExtra: true,
    isActive: true,
  },
  {
    code: "RECHECK",
    name: "Повторный осмотр после устранения замечаний",
    description: "Повторная диагностика после устранения выявленных неисправностей.",
    price: 15,
    sortOrder: 300,
    isExtra: true,
    isActive: true,
  },
  {
    code: "GBO",
    name: "Осмотр ТС с газобаллонным оборудованием",
    description: "Дополнительная проверка при наличии ГБО (нужен акт на баллон).",
    price: 8,
    sortOrder: 310,
    isExtra: true,
    isActive: true,
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
    update: { name: "Администратор ДС 159" },
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
        isActive: item.isActive,
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

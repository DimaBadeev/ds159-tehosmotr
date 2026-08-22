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

const DEMO_BOOKING_NAMES = [
  "Иванов Сергей Петрович",
  "Козлова Анна Викторовна",
  "Петров Дмитрий Олегович",
  "Сидорова Мария Ивановна",
];

const DEMO_BOOKING_PHONES = [
  "+375291112233",
  "+375297776655",
  "+375333334455",
  "+375441234567",
  "+375 (29) 111-22-33",
  "+375 (29) 777-66-55",
  "+375 (33) 333-44-55",
  "+375 (44) 123-45-67",
];

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

  const removed = await prisma.booking.deleteMany({
    where: {
      OR: [
        { email: { endsWith: "@example.com" } },
        { clientName: { in: DEMO_BOOKING_NAMES } },
        { phone: { in: DEMO_BOOKING_PHONES } },
      ],
    },
  });

  console.log("Seed completed.");
  console.log(`Removed demo bookings: ${removed.count}`);
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

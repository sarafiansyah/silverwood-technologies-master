const bcrypt = require("bcryptjs");

// 👇 copy-paste your users array from lib/users.ts
const users = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "Root",
    email: "admin@test.com",
    password: "admin123",
    roles: ["Admin"],
  },
];

(async () => {
  const hashed = await Promise.all(
    users.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );

  console.log("\n=== HASHED USERS ===\n");
  console.log(JSON.stringify(hashed, null, 2));
})();

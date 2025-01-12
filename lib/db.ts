import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
  const user = await db.user.create({
    data: {
      username: "chan",          // 필수 (유일해야 함)
    },
  });
  console.log(user);
  console.log(user);
}
test()

export default db
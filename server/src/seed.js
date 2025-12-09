const prisma = require("./db");
const bcrypt = require("bcrypt");

async function main() {
  console.log("Seeding...");

  // 1. Create User
  const hash = await bcrypt.hash("123456", 10);
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      username: '@johndoe',
      name: 'John Doe',
      password: hash,
      avatar: 'JD'
    },
  });

  // 2. Create Broad Hobbies
  const artHobby = await prisma.hobby.upsert({
    where: { name: 'Art' }, update: {}, create: { name: 'Art' }
  });
  const techHobby = await prisma.hobby.upsert({
    where: { name: 'Technology' }, update: {}, create: { name: 'Technology' }
  });

  // 3. Connect User to 'Art' Hobby (User is interested in Art)
  await prisma.user.update({
    where: { id: user.id },
    data: { hobbies: { connect: { id: artHobby.id } } }
  });

  // 4. Create Niche Communities inside Hobbies
  // Art Communities
  const comm1 = await prisma.community.create({
    data: {
      name: 'Oil Painters Guild',
      hobbyId: artHobby.id, // Linked to Art
      colorHex: '#e11d48',
      iconName: 'Palette'
    }
  });
  const comm2 = await prisma.community.create({
    data: {
      name: 'Digital Artists',
      hobbyId: artHobby.id, // Linked to Art
      colorHex: '#8b5cf6',
      iconName: 'Laptop' // Changed from generic
    }
  });

  // Tech Communities
  const comm3 = await prisma.community.create({
    data: {
      name: 'React Developers',
      hobbyId: techHobby.id, // Linked to Tech
      colorHex: '#61dafb',
      iconName: 'Code'
    }
  });

  // 5. User joins ONE community, but not the others
  await prisma.community.update({
    where: { id: comm1.id },
    data: { members: { connect: { id: user.id } } }
  });

  // 6. Create a Post
  await prisma.post.create({
    data: {
      title: 'My first canvas',
      content: 'Oil painting is harder than it looks!',
      authorId: user.id,
      communityId: comm1.id
    }
  });

  console.log("Seeding Complete: User likes 'Art' and joined 'Oil Painters Guild'.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
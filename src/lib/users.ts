// lib/users.ts

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
  phoneNumber: string;
}

//  You can add more users here later easily
export const users: UserData[] = [
  {
    id: "1",
    firstName: "Mahesa",
    lastName: "Rafiansyah",
    email: "mahesa@example.com",
    password: "MahesaMita",
    roles: ["Administrator"],
    phoneNumber: "+62 812-3456-7890",
  },
  {
    id: "2",
    firstName: "Sara",
    lastName: "Tan",
    email: "sara@example.com",
    password: "pass123",
    roles: ["Support"],
    phoneNumber: "+62 811-2222-3333",
  },
    {
    id: "3",
    firstName: "Michelle",
    lastName: "Aurelia",
    email: "michelle@example.com",
    password: "michellePass",
    roles: ["Finance"],
    phoneNumber: "+62 813-9988-1122",
  },
  {
    id: "4",
    firstName: "Rara",
    lastName: "Sundari",
    email: "rara@example.com",
    password: "raraCute",
    roles: ["HR"],
    phoneNumber: "+62 815-6677-2211",
  },
  {
    id: "5",
    firstName: "Nina",
    lastName: "Hartati",
    email: "nina@example.com",
    password: "ninaSecure",
    roles: ["Support"],
    phoneNumber: "+62 819-5544-7788",
  },
  {
    id: "6",
    firstName: "Lina",
    lastName: "Wijaya",
    email: "lina@example.com",
    password: "linaStrong",
    roles: ["Marketing"],
    phoneNumber: "+62 817-4400-2233",
  },
  {
    id: "7",
    firstName: "Johan",
    lastName: "Pratama",
    email: "johan@example.com",
    password: "johanPass",
    roles: ["Administrator"],
    phoneNumber: "+62 812-9900-5566",
  },
  {
    id: "8",
    firstName: "Kevin",
    lastName: "Hartono",
    email: "kevin@example.com",
    password: "kevinSecure",
    roles: ["Developer"],
    phoneNumber: "+62 818-2211-9944",
  },
];

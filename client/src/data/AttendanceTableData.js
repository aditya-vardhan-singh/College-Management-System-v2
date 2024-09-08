import React from "react";
// const columns = [
//   { name: "ID", uid: "id", sortable: true },
//   { name: "NAME", uid: "name", sortable: true },
// { name: "AGE", uid: "age", sortable: true },
//   { name: "ROLE", uid: "role", sortable: true },
//   { name: "TEAM", uid: "team" },
//   { name: "EMAIL", uid: "email" },
//   { name: "STATUS", uid: "status", sortable: true },
//   { name: "ACTIONS", uid: "actions" },
// ];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "FIRST NAME", uid: "first_name", sortable: true },
  { name: "LAST NAME", uid: "last_name", sortable: true },
  { name: "AGE", uid: "age", sortable: true },
  { name: "GENDER", uid: "gender", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "ADDRESS", uid: "address" },
  { name: "DEPARTMENT ID", uid: "department_id", sortable: true },
  { name: "HIRE DATE", uid: "hire_date", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Pending", uid: "pending" },
  { name: "Admitted", uid: "admitted" },
  { name: "Left", uid: "left" },
];

// const users = [
//   {
//     id: 1, // student id
//     name: "Tony Reichert", // student full name
//     role: "CEO", // enrollment date
// team: "Management", // address
//     status: "admitted", // phone
// age: "29", // derived from date of birth
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", // blank
//     email: "tony.reichert@example.com", // student email
//   },
//   {
//     id: 2,
//     name: "Zoey Lang",
//     role: "Tech Lead",
//     team: "Development",
//     status: "left",
// age: "25",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
//     email: "zoey.lang@example.com",
//   },
//   {
//     id: 3,
//     name: "Jane Fisher",
//     role: "Sr. Dev",
//     team: "Development",
//     status: "admitted",
// age: "22",
//     avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
//     email: "jane.fisher@example.com",
//   },
//   {
//     id: 4,
//     name: "William Howard",
//     role: "C.M.",
//     team: "Marketing",
//     status: "vacation",
// age: "28",
//     avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
//     email: "william.howard@example.com",
//   },
//   {
//     id: 5,
//     name: "Kristen Copper",
//     role: "S. Manager",
//     team: "Sales",
//     status: "admitted",
// age: "24",
//     avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
//     email: "kristen.cooper@example.com",
//   },
//   {
//     id: 6,
//     name: "Brian Kim",
//     role: "P. Manager",
//     team: "Management",
// age: "29",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
//     email: "brian.kim@example.com",
//     status: "admitted",
//   },
//   {
//     id: 7,
//     name: "Michael Hunt",
//     role: "Designer",
//     team: "Design",
//     status: "left",
// age: "27",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
//     email: "michael.hunt@example.com",
//   },
//   {
//     id: 8,
//     name: "Samantha Brooks",
//     role: "HR Manager",
//     team: "HR",
//     status: "admitted",
// age: "31",
//     avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
//     email: "samantha.brooks@example.com",
//   },
//   {
//     id: 9,
//     name: "Frank Harrison",
//     role: "F. Manager",
//     team: "Finance",
//     status: "vacation",
// age: "33",
//     avatar: "https://i.pravatar.cc/150?img=4",
//     email: "frank.harrison@example.com",
//   },
//   {
//     id: 10,
//     name: "Emma Adams",
//     role: "Ops Manager",
//     team: "Operations",
//     status: "admitted",
// age: "35",
//     avatar: "https://i.pravatar.cc/150?img=5",
//     email: "emma.adams@example.com",
//   },
//   {
//     id: 11,
//     name: "Brandon Stevens",
//     role: "Jr. Dev",
//     team: "Development",
//     status: "admitted",
// age: "22",
//     avatar: "https://i.pravatar.cc/150?img=8",
//     email: "brandon.stevens@example.com",
//   },
//   {
//     id: 12,
//     name: "Megan Richards",
//     role: "P. Manager",
//     team: "Product",
//     status: "left",
// age: "28",
//     avatar: "https://i.pravatar.cc/150?img=10",
//     email: "megan.richards@example.com",
//   },
//   {
//     id: 13,
//     name: "Oliver Scott",
//     role: "S. Manager",
//     team: "Security",
//     status: "admitted",
// age: "37",
//     avatar: "https://i.pravatar.cc/150?img=12",
//     email: "oliver.scott@example.com",
//   },
//   {
//     id: 14,
//     name: "Grace Allen",
//     role: "M. Specialist",
//     team: "Marketing",
//     status: "admitted",
// age: "30",
//     avatar: "https://i.pravatar.cc/150?img=16",
//     email: "grace.allen@example.com",
//   },
//   {
//     id: 15,
//     name: "Noah Carter",
//     role: "IT Specialist",
//     team: "I. Technology",
//     status: "left",
// age: "31",
//     avatar: "https://i.pravatar.cc/150?img=15",
//     email: "noah.carter@example.com",
//   },
//   {
//     id: 16,
//     name: "Ava Perez",
//     role: "Manager",
//     team: "Sales",
//     status: "admitted",
// age: "29",
//     avatar: "https://i.pravatar.cc/150?img=20",
//     email: "ava.perez@example.com",
//   },
//   {
//     id: 17,
//     name: "Liam Johnson",
//     role: "Data Analyst",
//     team: "Analysis",
//     status: "admitted",
// age: "28",
//     avatar: "https://i.pravatar.cc/150?img=33",
//     email: "liam.johnson@example.com",
//   },
//   {
//     id: 18,
//     name: "Sophia Taylor",
//     role: "QA Analyst",
//     team: "Testing",
//     status: "admitted",
// age: "27",
//     avatar: "https://i.pravatar.cc/150?img=29",
//     email: "sophia.taylor@example.com",
//   },
//   {
//     id: 19,
//     name: "Lucas Harris",
//     role: "Administrator",
//     team: "Information Technology",
//     status: "left",
// age: "32",
//     avatar: "https://i.pravatar.cc/150?img=50",
//     email: "lucas.harris@example.com",
//   },
//   {
//     id: 20,
//     name: "Mia Robinson",
//     role: "Coordinator",
//     team: "Operations",
//     status: "admitted",
// age: "26",
//     avatar: "https://i.pravatar.cc/150?img=45",
//     email: "mia.robinson@example.com",
//   },
// ];

const users = [
  {
    id: 1,
    first_name: "Tony",
    last_name: "Reichert",
    // age: "29",
    gender: "Male",
    email: "tony.reichert@example.com",
    phone: "8528736532",
    // address: "Springfield, MO, United States",
    department_id: "9",
    hire_date: "2024-09-01",
    status: "pending",
  },
  {
    id: 2,
    first_name: "Sarah",
    last_name: "Connor",
    // age: "34",
    gender: "Female",
    email: "sarah.connor@example.com",
    phone: "6317283564",
    // address: "Los Angeles, CA, United States",
    department_id: "5",
    hire_date: "2024-08-15",
    status: "admitted",
  },
  {
    id: 3,
    first_name: "Michael",
    last_name: "Johnson",
    // age: "24",
    gender: "Male",
    email: "michael.johnson@example.com",
    phone: "7218456321",
    // address: "New York, NY, United States",
    department_id: "7",
    hire_date: "2024-07-20",
    status: "left",
  },
  {
    id: 4,
    first_name: "Emily",
    last_name: "Smith",
    // age: "27",
    gender: "Female",
    email: "emily.smith@example.com",
    phone: "3217648123",
    // address: "Chicago, IL, United States",
    department_id: "3",
    hire_date: "2024-06-10",
    status: "admitted",
  },
  {
    id: 5,
    first_name: "David",
    last_name: "Lee",
    // age: "31",
    gender: "Male",
    email: "david.lee@example.com",
    phone: "4357894321",
    // address: "Houston, TX, United States",
    department_id: "4",
    hire_date: "2024-09-03",
    status: "pending",
  },
  {
    id: 6,
    first_name: "Jessica",
    last_name: "Brown",
    // age: "26",
    gender: "Female",
    email: "jessica.brown@example.com",
    phone: "9457845632",
    // address: "Phoenix, AZ, United States",
    department_id: "6",
    hire_date: "2024-05-22",
    status: "admitted",
  },
  {
    id: 7,
    first_name: "Robert",
    last_name: "Miller",
    // age: "28",
    gender: "Male",
    email: "robert.miller@example.com",
    phone: "5893216548",
    // address: "San Francisco, CA, United States",
    department_id: "2",
    hire_date: "2024-07-11",
    status: "vacation",
  },
  {
    id: 8,
    first_name: "Laura",
    last_name: "Williams",
    // age: "30",
    gender: "Female",
    email: "laura.williams@example.com",
    phone: "6321549876",
    // address: "Miami, FL, United States",
    department_id: "8",
    hire_date: "2024-08-25",
    status: "admitted",
  },
  {
    id: 9,
    first_name: "Daniel",
    last_name: "Taylor",
    // age: "35",
    gender: "Male",
    email: "daniel.taylor@example.com",
    phone: "7813265432",
    // address: "Seattle, WA, United States",
    department_id: "1",
    hire_date: "2024-07-01",
    status: "left",
  },
  {
    id: 10,
    first_name: "Sophia",
    last_name: "Davis",
    // age: "29",
    gender: "Female",
    email: "sophia.davis@example.com",
    phone: "9658741235",
    // address: "Boston, MA, United States",
    department_id: "10",
    hire_date: "2024-06-18",
    status: "admitted",
  },
];

export { columns, users, statusOptions };
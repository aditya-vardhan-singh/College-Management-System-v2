import { Input, Select, SelectItem } from "@nextui-org/react";

interface Student {
  id: string;
  primary_key: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: string;
  date_of_birth: string;
  gender: string;
  address: string;
  department_id: string;
  department: string;
  enrollment_date: string;
}

export default function StudentForm({ student }: { student: Student }) {
  const genders = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
  ];
  const departments = [
    { key: "1", label: "Computer Science & Engineering" },
    { key: "2", label: "Mechanical Engineering" },
    { key: "3", label: "Civil Engineering" },
    { key: "4", label: "Electrical Engineering" },
    { key: "5", label: "Electronics & Communication Engineering" },
  ];

  return (
    <form>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6">
          {student.id !== "" && (
            <Input
              name="id"
              isReadOnly
              type="none"
              label="Student ID"
              labelPlacement="inside"
              defaultValue={student.id}
              style={{ borderWidth: 0, boxShadow: "none" }}
            />
          )}
        </div>
        <Input
          className="col-span-3"
          isRequired
          type="none"
          maxLength={50}
          autoComplete="first_name"
          label="First Name"
          labelPlacement="inside"
          defaultValue={student.first_name}
          style={{ borderWidth: 0, boxShadow: "none" }}
        />
        <Input
          className="col-span-3"
          isRequired
          type="none"
          maxLength={50}
          autoComplete="last_name"
          label="Last Name"
          labelPlacement="inside"
          defaultValue={student.last_name}
          style={{ borderWidth: 0, boxShadow: "none" }}
        />
        <Select
          isRequired
          label="Gender"
          className="max-w-xs col-span-2"
          defaultSelectedKeys={[student.gender]}
        >
          {genders.map((gender) => (
            <SelectItem key={gender.key}>{gender.label}</SelectItem>
          ))}
        </Select>
        <Input
          className="col-span-2"
          isRequired
          isClearable
          type="email"
          maxLength={100}
          autoComplete="email"
          label="Email"
          labelPlacement="inside"
          // description="We'll never share your email with anyone else."
          defaultValue={student.email}
          style={{ borderWidth: 0, boxShadow: "none" }}
        />
        <Input
          className="col-span-2"
          type="number"
          maxLength={15}
          autoComplete="phone"
          label="Phone"
          defaultValue={student.phone}
          labelPlacement="inside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        />

        {/* <Input
          className="col-span-2"
          isRequired={student.age === ""}
          isReadOnly={student.age !== ""}
          type="number"
          label="Age"
          defaultValue={student.age}
          labelPlacement="inside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        /> */}
        <Input
          className="col-span-2"
          isRequired
          // isRequired={student.date_of_birth === ""}
          // isReadOnly={student.date_of_birth !== ""}
          type="date"
          label="Date of Birth"
          defaultValue={student.date_of_birth}
          labelPlacement="inside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        />
        {/* <Input
          className="col-span-2"
          isRequired
          type="none"
          label="Department"
          defaultValue={student.department_id}
          labelPlacement="inside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        /> */}
        <Select
          isRequired
          label="Department"
          className="max-w-xs col-span-2"
          defaultSelectedKeys={[student.department_id]}
        >
          {departments.map((department) => (
            <SelectItem key={department.key}>{department.label}</SelectItem>
          ))}
        </Select>
        <Input
          className="col-span-2"
          isRequired
          type="date"
          label="Enrollment Date"
          defaultValue={student.enrollment_date}
          labelPlacement="inside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        />
        <Input
          className="col-span-6"
          type="none"
          maxLength={500}
          label="Address"
          defaultValue={student.address}
          labelPlacement="inside"
          style={{ borderWidth: 0, boxShadow: "none" }}
        />
      </div>
    </form>
  );
}

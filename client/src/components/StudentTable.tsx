import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { ChevronDownIcon } from "../assets/ChevronDownIcon";
import { PlusIcon } from "../assets/PlusIcon";
import { SearchIcon } from "../assets/SearchIcon";
import { VerticalDotsIcon } from "../assets/VerticalDotsIcon";
import axios from "axios";
import { baseUrl, capitalize } from "../data/utils";
import StudentForm from "./StudentForm";

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
  { name: "ENROLLMENT DATE", uid: "enrollment_date", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Pending", uid: "pending" },
  { name: "Admitted", uid: "admitted" },
  { name: "Left", uid: "left" },
];

// const statusColorMap = {
//   admitted: "success",
//   left: "danger",
//   pending: "warning",
// };

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "first_name",
  "last_name",
  "age",
  "email",
  "gender",
  "actions",
];

export default function StudentTable() {
  const [users, setUsers] = React.useState([
    {
      id: 1,
      first_name: "Tony",
      last_name: "Reichert",
      age: "29",
      gender: "Male",
      email: "tony.reichert@example.com",
      phone: "8528736532",
      address: "Springfield, MO, United States",
      department_id: "9",
      enrollment_date: "2024-09-01",
      status: "pending",
    },
    {
      id: 2,
      first_name: "Sarah",
      last_name: "Connor",
      age: "34",
      gender: "Female",
      email: "sarah.connor@example.com",
      phone: "6317283564",
      address: "Los Angeles, CA, United States",
      department_id: "5",
      enrollment_date: "2024-08-15",
      status: "admitted",
    },
    {
      id: 3,
      first_name: "Michael",
      last_name: "Johnson",
      age: "24",
      gender: "Male",
      email: "michael.johnson@example.com",
      phone: "7218456321",
      address: "New York, NY, United States",
      department_id: "7",
      enrollment_date: "2024-07-20",
      status: "left",
    },
    {
      id: 4,
      first_name: "Emily",
      last_name: "Smith",
      age: "27",
      gender: "Female",
      email: "emily.smith@example.com",
      phone: "3217648123",
      address: "Chicago, IL, United States",
      department_id: "3",
      enrollment_date: "2024-06-10",
      status: "admitted",
    },
    {
      id: 5,
      first_name: "David",
      last_name: "Lee",
      age: "31",
      gender: "Male",
      email: "david.lee@example.com",
      phone: "4357894321",
      address: "Houston, TX, United States",
      department_id: "4",
      enrollment_date: "2024-09-03",
      status: "pending",
    },
    {
      id: 6,
      first_name: "Jessica",
      last_name: "Brown",
      age: "26",
      gender: "Female",
      email: "jessica.brown@example.com",
      phone: "9457845632",
      address: "Phoenix, AZ, United States",
      department_id: "6",
      enrollment_date: "2024-05-22",
      status: "admitted",
    },
    {
      id: 7,
      first_name: "Robert",
      last_name: "Miller",
      age: "28",
      gender: "Male",
      email: "robert.miller@example.com",
      phone: "5893216548",
      address: "San Francisco, CA, United States",
      department_id: "2",
      enrollment_date: "2024-07-11",
      status: "vacation",
    },
    {
      id: 8,
      first_name: "Laura",
      last_name: "Williams",
      age: "30",
      gender: "Female",
      email: "laura.williams@example.com",
      phone: "6321549876",
      address: "Miami, FL, United States",
      department_id: "8",
      enrollment_date: "2024-08-25",
      status: "admitted",
    },
    {
      id: 9,
      first_name: "Daniel",
      last_name: "Taylor",
      age: "35",
      gender: "Male",
      email: "daniel.taylor@example.com",
      phone: "7813265432",
      address: "Seattle, WA, United States",
      department_id: "1",
      enrollment_date: "2024-07-01",
      status: "left",
    },
    {
      id: 10,
      first_name: "Sophia",
      last_name: "Davis",
      age: "29",
      gender: "Female",
      email: "sophia.davis@example.com",
      phone: "9658741235",
      address: "Boston, MA, United States",
      department_id: "10",
      enrollment_date: "2024-06-18",
      status: "admitted",
    },
  ]);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user.first_name + user.last_name)
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [currentOption, setCurrentOption] = useState<string>("");

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      // case "first_name":
      //   return (
      //     <User
      //       avatarProps={{ radius: "lg", src: user.avatar }}
      //       description={user.email}
      //       name={cellValue}
      //     >
      //       {user.email}
      //     </User>
      //   );
      // case "last_name":
      //   return (
      //     <div className="flex flex-col">
      //       <p className="text-bold text-small capitalize">{cellValue}</p>
      //       <p className="text-bold text-tiny capitalize text-default-400">
      //         {user.team}
      //       </p>
      //     </div>
      //   );
      // case "status":
      //   return (
      //     <Chip
      //       className="capitalize"
      //       color={statusColorMap[user.status]}
      //       size="sm"
      //       variant="flat"
      //     >
      //       {cellValue}
      //     </Chip>
      //   );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => setCurrentUser(user)}
                >
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setCurrentOption("View");
                    onOpen();
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setCurrentOption("Edit");
                    onOpen();
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setCurrentOption("Delete");
                    onOpen();
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            style={{ borderWidth: 0, boxShadow: "none" }}
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} students
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small border-0"
              style={{ boxShadow: "none" }}
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="40">40</option>
              <option value="70">70</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const StudentModal = ({ isOpen, onClose }) => {
    return (
      <>
        {currentOption === "View" && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="2xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {`${currentUser.first_name} ${currentUser.last_name}`}
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      ID: {currentUser.id}
                      <br />
                      AGE: {currentUser.age}
                      <br />
                      GENDER: {currentUser.gender}
                      <br />
                      EMAIL: {currentUser.email}
                      <br />
                      PHONE: {currentUser.phone}
                      <br />
                      ADDRESS: {currentUser.address}
                      <br />
                      DEPARTMENT ID: {currentUser.department_id}
                      <br />
                      ENROLLMENT DATE: {currentUser.enrollment_date}
                      <br />
                      STATUS: {currentUser.status}
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    {/* <Button color="primary" onPress={onClose}>
                      Action
                    </Button> */}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        {currentOption === "Delete" && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="2xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Confirmation
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Are you sure you want to remove{" "}
                      {`${currentUser.first_name} ${currentUser.last_name}`}
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Delete
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
        {currentOption === "Edit" && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="5xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Edit Student
                  </ModalHeader>
                  <ModalBody>
                    <StudentForm />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Update
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </>
    );
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/student/get`)
      .then((response) => {
        if (response?.data?.users) {
          setUsers(response.data.users);
        } else {
          toast.error("Invalid response parameters!");
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Error getting student records!");
      });
  }, []);

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[500px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="none"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <StudentModal
        isOpen={isOpen}
        onClose={onOpenChange}
        user={currentUser}
        option={currentOption}
      />
    </>
  );
}

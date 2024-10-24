import {
  Button,
  Chip,
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
import { AddFacultyForm, UpdateFacultyForm } from "./AllComponents";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "FIRST NAME", uid: "first_name", sortable: true },
  { name: "LAST NAME", uid: "last_name", sortable: true },
  { name: "GENDER", uid: "gender", sortable: true },
  { name: "AGE", uid: "age", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "DEPARTMENT", uid: "department", sortable: true },
  { name: "HIRE DATE", uid: "hire_date", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Pending", uid: "pending" },
  { name: "Admitted", uid: "admitted" },
  { name: "Left", uid: "left" },
];

const statusColorMap = {
  admitted: "success",
  left: "danger",
  pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "first_name",
  "last_name",
  "email",
  "gender",
  "status",
  "actions",
];

export default function FacultyTable() {
  // All students
  const [users, setUsers] = React.useState([
    {
      id: "",
      first_name: "",
      last_name: "",
      age: "",
      date_of_birth: "",
      gender: "",
      email: "",
      phone: "",
      department_id: "",
      department: "",
      hire_date: "",
      status: "",
    },
  ]);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
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
            // style={{ borderWidth: 0, boxShadow: "none" }}
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
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => {
                setCurrentOption("Add");
                onOpen();
              }}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {users.length > 1
              ? `Total ${users.length} faculties`
              : `Total ${users.length} faculty`}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small border-0"
              style={{ boxShadow: "none" }}
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10" selected>
                10
              </option>
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
          {/* {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`} */}
          {filteredItems.length !== users.length &&
            `After search and filter ${filteredItems.length} faculties in total.`}
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
  }, [
    selectedKeys,
    items.length,
    page,
    pages,
    hasSearchFilter,
    // filteredItems.length,
    // onNextPage,
    // onPreviousPage,
    // users.length,
  ]);

  const handleDeleteUser = () => {
    async function deleteUser() {
      await axios
        .delete(`${baseUrl}/faculties/delete`, {
          params: { id: currentUser.id },
        })
        .then((response) => {
          toast.success(
            response?.data?.message || "Faculty deleted successfully",
          );
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message || "Unable to delete faculty",
          );
        });
    }
    deleteUser();
  };

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
                    Faculty Details
                  </ModalHeader>
                  <ModalBody>
                    <p className="font-semibold">Personal Details:</p>
                    <div className="grid grid-cols-6 gap-4">
                      <Input
                        isReadOnly
                        label="Name"
                        defaultValue={`${currentUser.first_name} ${currentUser.last_name}`}
                        className="col-span-6"
                      />
                      <Input
                        isReadOnly
                        label="Date of Birth"
                        defaultValue={currentUser.date_of_birth}
                        className="col-span-3"
                      />
                      <Input
                        isReadOnly
                        label="Gender"
                        defaultValue={currentUser.gender}
                        className="col-span-3"
                      />
                      <Input
                        isReadOnly
                        label="Email"
                        defaultValue={currentUser.email}
                        className="col-span-3"
                      />
                      <Input
                        isReadOnly
                        label="Phone"
                        defaultValue={currentUser.phone}
                        className="col-span-3"
                      />
                    </div>

                    <p className="font-semibold">Official Details:</p>
                    <div className="grid grid-cols-6 gap-4">
                      <Input
                        isReadOnly
                        label="Faculty ID"
                        defaultValue={currentUser.id}
                        className="col-span-2"
                      />
                      <Input
                        isReadOnly
                        label="Department"
                        defaultValue={currentUser.department}
                        className="col-span-4"
                      />
                      <Input
                        isReadOnly
                        label="Hire Date"
                        defaultValue={currentUser.hire_date}
                        className="col-span-3"
                      />
                      <Input
                        isReadOnly
                        label="Status"
                        defaultValue={currentUser.status}
                        className="col-span-3"
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="default" onPress={onClose}>
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
              {(onClose) => {
                return currentUser.status === "left" ? (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Alert
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        {`'${currentUser.first_name} ${currentUser.last_name}' has already been deleted!`}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="default" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                ) : (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Confirmation
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Are you sure you want to remove{" "}
                        {`'${currentUser.first_name} ${currentUser.last_name}'`}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          handleDeleteUser();
                          onClose();
                        }}
                      >
                        Delete
                      </Button>
                    </ModalFooter>
                  </>
                );
              }}
            </ModalContent>
          </Modal>
        )}
        {currentOption === "Edit" && (
          <UpdateFacultyForm
            currentFacultyDetails={currentUser}
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        )}
        {currentOption === "Add" && (
          <AddFacultyForm
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/faculties/all`)
      .then((response) => {
        if (response?.data?.faculty_list) {
          setUsers(response.data.faculty_list);
        } else {
          toast.error("Invalid response parameters!");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err?.response?.data?.message + ": " + err?.response?.data?.error ||
            "Error getting faculties records!",
        );
      });
  }, []);

  return (
    <>
      <Toaster richColors position="bottom-center" />
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

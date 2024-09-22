import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";

export default function NavigationBar({
  currentPage,
}: {
  currentPage: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/" },
    { name: "Class", href: "/class" },
    { name: "Student", href: "/student" },
    { name: "Faculty", href: "/faculty" },
    { name: "Course", href: "/course" },
    { name: "Department", href: "/department" },
    { name: "Exam", href: "/exam" },
    { name: "Result", href: "/result" },
    { name: "Attendance", href: "/attendance" },
  ];

  const navBarItems = menuItems.map((item, index) => {
    return currentPage === item.name ? (
      <NavbarItem key={index} isActive>
        <Link href={item.href} aria-current="page">
          {item.name}
        </Link>
      </NavbarItem>
    ) : (
      <NavbarItem key={index}>
        <Link color="foreground" href={item.href}>
          {item.name}
        </Link>
      </NavbarItem>
    );
  });

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      className="bg-default-50"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">College Management System</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navBarItems}
        {/* <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Student
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Faculty
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Classroom
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Attendance
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Exam
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Result
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 0
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

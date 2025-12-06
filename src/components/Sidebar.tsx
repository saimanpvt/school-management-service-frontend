import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Sidebar.module.css";
import {
  Home,
  BookOpen,
  FileText,
  BarChart2,
  MessageSquare,
  Users,
  ClipboardList,
  DollarSign,
  CalendarDays,
  Settings,
} from "lucide-react";

type Role = "student" | "teacher" | "parent" | "admin";

interface SidebarProps {
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const router = useRouter();
  const { id } = router.query;
  const currentPath = router.asPath || router.pathname || '';

  // Debug logging (remove in production)
  console.log('Sidebar Debug:', { currentPath, id });

  const getMenuItems = () => {
    const basePath = `/portal/${role}/${id || '[id]'}`;

    if (role === "student") {
      return [
        { icon: <Home size={18} />, label: "Dashboard", href: `${basePath}/dashboard` },
        { icon: <BookOpen size={18} />, label: "Courses", href: `${basePath}/courses` },
        { icon: <FileText size={18} />, label: "Assignments", href: `${basePath}/assignments` },
        { icon: <BarChart2 size={18} />, label: "Grades", href: `${basePath}/grades` },
        { icon: <CalendarDays size={18} />, label: "Attendance", href: `${basePath}/attendance` },
        { icon: <FileText size={18} />, label: "Exams", href: `${basePath}/exams` },
        { icon: <DollarSign size={18} />, label: "Fees", href: `${basePath}/fees` },
        { icon: <MessageSquare size={18} />, label: "Messages", href: `${basePath}/messages` },
      ];
    } else if (role === "teacher") {
      return [
        { icon: <Home size={18} />, label: "Dashboard", href: `${basePath}/dashboard` },
        { icon: <Users size={18} />, label: "Class", href: `${basePath}/class` },
        { icon: <BookOpen size={18} />, label: "Students", href: `${basePath}/students` },
        { icon: <ClipboardList size={18} />, label: "Assignments", href: `${basePath}/assignments` },
        { icon: <CalendarDays size={18} />, label: "Attendance", href: `${basePath}/attendance` },
        { icon: <FileText size={18} />, label: "Exams", href: `${basePath}/exams` },
        { icon: <MessageSquare size={18} />, label: "Messages", href: `${basePath}/messages` },
      ];
    } else if (role === "admin") {
      return [
        { icon: <Home size={18} />, label: "Dashboard", href: `${basePath}/dashboard` },
        { icon: <Users size={18} />, label: "User Management", href: `${basePath}/user-management` },
        { icon: <BookOpen size={18} />, label: "Classes", href: `${basePath}/classes` },
        { icon: <FileText size={18} />, label: "Courses", href: `${basePath}/courses` },
        { icon: <ClipboardList size={18} />, label: "Exams", href: `${basePath}/exams` },
        { icon: <DollarSign size={18} />, label: "Fees", href: `${basePath}/fees` },
        { icon: <MessageSquare size={18} />, label: "Messages", href: `${basePath}/messages` },
      ];
    } else {
      return [
        { icon: <Home size={18} />, label: "Dashboard", href: `${basePath}/dashboard` },
        { icon: <CalendarDays size={18} />, label: "Attendance", href: `${basePath}/attendance` },
        { icon: <BarChart2 size={18} />, label: "Progress", href: `${basePath}/progress` },
        { icon: <DollarSign size={18} />, label: "Fees", href: `${basePath}/fees` },
        { icon: <FileText size={18} />, label: "Exams", href: `${basePath}/exams` },
        { icon: <MessageSquare size={18} />, label: "Messages", href: `${basePath}/messages` },
      ];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    const actualHref = href.replace(/\[id\]/g, id as string);
    return currentPath === actualHref;
  };

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => {
          const active = isActive(item.href);
          return (
            <li
              key={index}
              className={`${styles.menuItem} ${active ? styles.active : ""}`}
            >
              <Link href={item.href} className={styles.link}>
                <span className={styles.icon}>{item.icon}  {item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;

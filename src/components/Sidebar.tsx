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
  name: string;
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ name, role }) => {
  const router = useRouter();
  const { id } = router.query;
  const currentPath = (router as any).pathname || window?.location?.pathname || '';

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
        { icon: <Users size={18} />, label: "User Management", href: `${basePath}/users` },
        { icon: <Users size={18} />, label: "Students", href: `${basePath}/students` },
        { icon: <BookOpen size={18} />, label: "Teachers", href: `${basePath}/teachers` },
        { icon: <FileText size={18} />, label: "Courses", href: `${basePath}/courses` },
        { icon: <ClipboardList size={18} />, label: "Exams", href: `${basePath}/exams` },
        { icon: <DollarSign size={18} />, label: "Fees", href: `${basePath}/fees` },
        { icon: <MessageSquare size={18} />, label: "Messages", href: `${basePath}/messages` },
        { icon: <Settings size={18} />, label: "Settings", href: `${basePath}/settings` },
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
    return currentPath === href.replace(/\[id\]/g, id as string) ||
      currentPath.replace(/\/\d+\//g, '/[id]/') === href.replace(/\[id\]/g, '[id]');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.avatar}>{name.charAt(0).toUpperCase()}</div>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.role}>{role}</p>
        </div>
      </div>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => {
          const active = isActive(item.href) || (index === 0 && currentPath.includes('/dashboard'));
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

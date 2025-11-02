import React from "react";
import Link from "next/link";
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
} from "lucide-react";

type Role = "student" | "teacher" | "parent";

interface SidebarProps {
  name: string;
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ name, role }) => {
  const menuItems = {
    student: [
      { icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
      { icon: <BookOpen size={18} />, label: "Courses", href: "/dashboard/student/[id]/courses" },
      { icon: <FileText size={18} />, label: "Assignments", href: "/dashboard/student/[id]/assignments" },
      { icon: <BarChart2 size={18} />, label: "Grades", href: "/dashboard/student/[id]/grades" },
      { icon: <CalendarDays size={18} />, label: "Attendance", href: "/dashboard/student/[id]/attendance" },
      { icon: <FileText size={18} />, label: "Exams", href: "/dashboard/student/[id]/exams" },
      { icon: <DollarSign size={18} />, label: "Fees", href: "/dashboard/student/[id]/fees" },
      { icon: <MessageSquare size={18} />, label: "Messages", href: "/dashboard/student/[id]/messages" },
    ],
    teacher: [
      { icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
      { icon: <Users size={18} />, label: "Class", href: "/dashboard/teacher/[id]/class" },
      { icon: <BookOpen size={18} />, label: "Students", href: "/dashboard/teacher/[id]/students" },
      { icon: <ClipboardList size={18} />, label: "Assignments", href: "/dashboard/teacher/[id]/assignments" },
      { icon: <CalendarDays size={18} />, label: "Attendance", href: "/dashboard/teacher/[id]/attendance" },
      { icon: <FileText size={18} />, label: "Exams", href: "/dashboard/teacher/[id]/exams" },
      { icon: <MessageSquare size={18} />, label: "Messages", href: "/dashboard/teacher/[id]/messages" },
    ],
    parent: [
      { icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
      { icon: <CalendarDays size={18} />, label: "Attendance", href: "/dashboard/parent/[id]/attendance" },
      { icon: <BarChart2 size={18} />, label: "Progress", href: "/dashboard/parent/[id]/progress" },
      { icon: <DollarSign size={18} />, label: "Fees", href: "/dashboard/parent/[id]/fees" },
      { icon: <FileText size={18} />, label: "Exams", href: "/dashboard/parent/[id]/exams" },
      { icon: <MessageSquare size={18} />, label: "Messages", href: "/dashboard/parent/[id]/messages" },
    ],
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
        {menuItems[role].map((item, index) => (
          <li
            key={index}
            className={`${styles.menuItem} ${index === 0 ? styles.active : ""}`}
          >
            <Link href={item.href} className={styles.link}>
              <span className={styles.icon}>{item.icon}  {item.label}</span>

            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import styles from './teacher.module.css';
import PortalLayout from '../../../../components/PortalLayout';
import { useRouter } from 'next/router';

const TeacherAttendance = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <PortalLayout userRole="teacher" userName="Teacher">
            <h1>Take Attendance</h1>
            {/* Add attendance management content here */}
        </PortalLayout>
    );
};

export default TeacherAttendance;
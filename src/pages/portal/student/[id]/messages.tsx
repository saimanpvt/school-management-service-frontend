import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { studentService } from '../../../../services/student.service';
import { MessageSquare, Send, User } from 'lucide-react';
import styles from './student.module.css';

interface Message {
    id: string;
    sender: string;
    senderId: string;
    content: string;
    date: string;
    read: boolean;
}

const StudentMessages = () => {
    const router = useRouter();
    const { id } = router.query;
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            studentService.getMessages(id as string)
                .then(data => {
                    setMessages(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                    // Mock data on error
                    const mockData: Message[] = [
                        {
                            id: '1',
                            sender: 'Mr. Smith',
                            senderId: 't1',
                            content: 'Great work on the recent assignment! Keep it up.',
                            date: '2024-01-20T10:30:00',
                            read: false
                        },
                        {
                            id: '2',
                            sender: 'Ms. Johnson',
                            senderId: 't2',
                            content: 'Please remember to bring your lab materials for tomorrow\'s class.',
                            date: '2024-01-19T14:15:00',
                            read: true
                        },
                        {
                            id: '3',
                            sender: 'Mr. Brown',
                            senderId: 't3',
                            content: 'The exam results have been posted. Check your grades page.',
                            date: '2024-01-18T09:00:00',
                            read: true
                        }
                    ];
                    setMessages(mockData);
                    setLoading(false);
                });
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Student" role="student" />
                <main className={styles.main}>
                    <div className={styles.loading}><LoadingDots /></div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Student" role="student" />
            <main className={styles.main}>
                <header className={styles.pageHeader}>
                    <h1>Messages</h1>
                    <p>Communicate with your teachers and administrators</p>
                </header>

                <div className={styles.messagesContainer}>
                    {messages.length > 0 ? (
                        messages.map(message => (
                            <div key={message.id} className={styles.messageCard} style={{ cursor: 'pointer' }}>
                                <div className={styles.messageAvatar}>
                                    {getInitials(message.sender)}
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.messageHeader}>
                                        <span className={styles.messageSender}>{message.sender}</span>
                                        <span className={styles.messageDate}>{formatDate(message.date)}</span>
                                    </div>
                                    <div className={styles.messageText}>
                                        {message.content}
                                    </div>
                                    {!message.read && (
                                        <span style={{
                                            display: 'inline-block',
                                            marginTop: '0.5rem',
                                            padding: '0.25rem 0.5rem',
                                            background: '#6366f1',
                                            color: 'white',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}>
                                            New
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <MessageSquare size={48} />
                            <h3>No messages</h3>
                            <p>Your messages will appear here.</p>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => {
                            const routerInstance = router as any;
                            routerInstance?.push(`/portal/student/${id}/messages/compose`);
                        }}
                    >
                        <Send size={18} />
                        Compose Message
                    </button>
                </div>
            </main>
        </div>
    );
};

export default StudentMessages;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { MessageSquare, Send, User, Search } from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots';

interface Message {
    id: string;
    sender: string;
    senderId: string;
    senderRole: 'student' | 'parent';
    content: string;
    date: string;
    read: boolean;
    subject?: string;
}

const TeacherMessages = () => {
    const router = useRouter();
    const { id } = router.query;
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (id) {
            // Mock data - replace with actual API call
            setTimeout(() => {
                const mockData: Message[] = [
                    {
                        id: '1',
                        sender: 'John Doe',
                        senderId: 's1',
                        senderRole: 'student',
                        subject: 'Question about assignment',
                        content: 'Hi teacher, I have a question about the recent assignment deadline.',
                        date: '2024-01-20T10:30:00',
                        read: false
                    },
                    {
                        id: '2',
                        sender: 'Jane Smith (Parent)',
                        senderId: 'p1',
                        senderRole: 'parent',
                        subject: 'Meeting request',
                        content: 'I would like to schedule a meeting to discuss my child\'s progress.',
                        date: '2024-01-19T14:15:00',
                        read: true
                    }
                ];
                setMessages(mockData);
                setLoading(false);
            }, 1000);
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
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const filteredMessages = messages.filter(message =>
        message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.subject && message.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Teacher" role="teacher" />
                <main className={styles.main}>
                    <div className={styles.loading}><LoadingDots /></div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Teacher" role="teacher" />
            <main className={styles.main}>
                <header className={styles.header}>
                    <div>
                        <h1>Messages</h1>
                        <p>Communicate with students and parents</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <button
                            className={styles.createBtn}
                            onClick={() => router.push(`/portal/teacher/${id}/messages/compose`)}
                        >
                            <Send size={18} />
                            Compose Message
                        </button>
                    </div>
                </header>

                <div className={styles.messagesContainer}>
                    {filteredMessages.length > 0 ? (
                        filteredMessages.map(message => (
                            <div key={message.id} className={styles.messageCard} style={{ cursor: 'pointer' }}>
                                <div className={styles.messageAvatar}>
                                    {getInitials(message.sender)}
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.messageHeader}>
                                        <div>
                                            <span className={styles.messageSender}>{message.sender}</span>
                                            <span className={styles.senderRole}>{message.senderRole}</span>
                                        </div>
                                        <span className={styles.messageDate}>{formatDate(message.date)}</span>
                                    </div>
                                    {message.subject && (
                                        <div className={styles.messageSubject}>{message.subject}</div>
                                    )}
                                    <div className={styles.messageText}>{message.content}</div>
                                    {!message.read && (
                                        <span className={styles.newBadge}>New</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <MessageSquare size={48} />
                            <h3>No messages</h3>
                            <p>{searchTerm ? 'No messages match your search' : 'Your messages will appear here'}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherMessages;

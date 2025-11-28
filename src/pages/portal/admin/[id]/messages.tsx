import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { withAuth } from '../../../../lib/withAuth';
import { MessageSquare, Send, Search } from 'lucide-react';
import styles from './admin.module.css';

const AdminMessages = () => {
    const router = useRouter();
    const { id } = router.query;
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (id) {
            // Mock data - replace with actual API call
            setTimeout(() => {
                setMessages([
                    {
                        id: '1',
                        sender: 'John Doe',
                        subject: 'Question about fees',
                        content: 'I have a question regarding the fee payment schedule.',
                        date: '2024-01-20T10:30:00',
                        read: false
                    }
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [id]);

    const filteredMessages = messages.filter(message =>
        message.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading messages...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Admin" role="admin" />
            <main className={styles.main}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Messages</h1>
                        <p>Manage system-wide messages and communications</p>
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
                        <button className={styles.createBtn}>
                            <Send size={18} />
                            Compose Message
                        </button>
                    </div>
                </header>

                <div className={styles.messagesContainer}>
                    {filteredMessages.length > 0 ? (
                        filteredMessages.map(message => (
                            <div key={message.id} className={styles.messageCard}>
                                <div className={styles.messageHeader}>
                                    <span className={styles.messageSender}>{message.sender}</span>
                                    <span className={styles.messageDate}>{new Date(message.date).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.messageSubject}>{message.subject}</div>
                                <div className={styles.messageText}>{message.content}</div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <MessageSquare size={48} />
                            <h3>No messages</h3>
                            <p>{searchTerm ? 'No messages match your search' : 'No messages in the system'}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminMessages;


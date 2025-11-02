import Header from './Header'
import Footer from './Footer'

type Props = {
    children?: any
    user?: { name?: string; role?: string }
}

export default function Layout({ children, user }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header user={user} />

            <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>

            <Footer />
        </div>
    )
}

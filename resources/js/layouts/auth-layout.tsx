import AuthSplitLayout from '@/layouts/auth/auth-split-layout';

export default function AuthLayout({
    children,
    title,
    description,
    className,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}) {
    return (
        <AuthSplitLayout title={title} description={description} className={className} {...props}>
            {children}
        </AuthSplitLayout>
    );
}

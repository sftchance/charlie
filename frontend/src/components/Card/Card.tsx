interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

const Card = ({ children, className, ...props }: CardProps) => {
    return <div className={`card ${className}`} {...props}>
        {children}
    </div>
}

export { Card }
const Error = ({ error }: { error: string }) => {
    if (!error) return null

    return <p style={{
        color: "red"
    }}>{error}</p>
}

export { Error }
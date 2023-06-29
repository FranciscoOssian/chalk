export default interface MessageType {
    id: string
    from: string
    to: string
    timestamp: Date
    content: {
        contentType: string
        value: string
    }
}
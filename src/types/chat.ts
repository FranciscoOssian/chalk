import UserType from "./user"
import MessageType from './message'

export default interface ChatType {
    id: string
    owners: [UserType, UserType]
    messages: MessageType[]
    lastMessage?: MessageType
}
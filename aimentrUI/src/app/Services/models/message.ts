import { ChatActions } from './chat-actions';

export interface Message {
    from?: any,
    content?: string,
    session?: string,
    action?: ChatActions
}
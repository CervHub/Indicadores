import { useEffect } from 'react';
import { toast } from 'sonner';

type MessageType = 'success' | 'error' | 'warning' | 'info';

export default function useFlashMessages(type: MessageType, message: string) {
    useEffect(() => {
        switch (type) {
            case 'success':
                console.log('Flash success:', message);
                toast.success(message);
                break;
            case 'error':
                console.log('Flash error:', message);
                toast.error(message);
                break;
            case 'warning':
                console.log('Flash warning:', message);
                toast.warning(message);
                break;
            case 'info':
                console.log('Flash info:', message);
                toast.info(message);
                break;
            default:
                console.log('Unknown message type:', message);
                break;
        }
    }, [type, message]); // Include dependencies
}

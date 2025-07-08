import { ReactNode } from "react";

export interface SettingItemProps {
    icon?: ReactNode;
    title: string;
    onPress: () => void;
    isLast?: boolean;
    children?: ReactNode;
}
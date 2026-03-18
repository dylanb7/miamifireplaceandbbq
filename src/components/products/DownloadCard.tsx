import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadCardProps {
    name: string;
    type: string;
    url?: string;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({ name, type, url }) => {
    return (
        <Button 
            variant="outline" 
            className="group justify-start h-auto py-6 px-8 gap-4 bg-card hover:bg-accent/10 hover:shadow-lg transition-all border-border/50 text-card-foreground overflow-hidden w-full"
            asChild
        >
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center w-full min-w-0">
                <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                    <Download className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left min-w-0 flex-1">
                    <div className="font-bold text-lg leading-tight mb-1 truncate" title={name}>
                        {name}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold truncate">
                        {type} Document
                    </div>
                </div>
            </a>
        </Button>
    );
};

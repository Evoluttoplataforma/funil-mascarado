import { User } from "lucide-react";

interface CallerHeaderProps {
  name: string;
  label: string;
  avatar?: string;
}

export const CallerHeader = ({ name, label, avatar }: CallerHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 pt-4 sm:pt-8">
      <div className="w-20 h-20 sm:w-[120px] sm:h-[120px] rounded-full bg-secondary flex items-center justify-center overflow-hidden">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
        )}
      </div>
      <h1 className="text-xl sm:text-[32px] font-semibold text-foreground mt-2 sm:mt-3">{name}</h1>
      <p className="text-sm sm:text-[16px] font-normal text-muted-foreground">{label}</p>
    </div>
  );
};

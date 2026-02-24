import { Mic, Grid3X3, Volume2, UserPlus, Video, Users } from "lucide-react";

interface ActionGridProps {
  onMute?: () => void;
  onKeypad?: () => void;
  onSpeaker?: () => void;
  onAdd?: () => void;
  onVideo?: () => void;
  onContacts?: () => void;
}

export const ActionGrid = ({
  onMute,
  onKeypad,
  onSpeaker,
  onAdd,
  onVideo,
  onContacts,
}: ActionGridProps) => {
  const actions = [
    { icon: Mic, label: "mudo", onClick: onMute },
    { icon: Grid3X3, label: "teclado", onClick: onKeypad },
    { icon: Volume2, label: "alto-falante", onClick: onSpeaker },
    { icon: UserPlus, label: "adicionar", onClick: onAdd },
    { icon: Video, label: "FaceTime", onClick: onVideo },
    { icon: Users, label: "contatos", onClick: onContacts },
  ];

  return (
    <div className="grid grid-cols-3 gap-x-12 gap-y-6 justify-items-center">
      {actions.map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label}
          className="ios-action-button focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          <Icon className="w-7 h-7 text-foreground" />
        </button>
      ))}
    </div>
  );
};

interface QuickReplyButtonsProps {
  choices: { id: string; text: string }[];
  onSelect: (choice: { id: string; text: string }) => void;
  visible: boolean;
}

export const QuickReplyButtons = ({
  choices,
  onSelect,
  visible,
}: QuickReplyButtonsProps) => {
  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center py-4 animate-slide-up">
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => onSelect(choice)}
          className="px-4 py-3 min-h-[44px] rounded-full border-2 border-whatsapp-green text-whatsapp-green font-medium text-[14px] transition-all duration-200 hover:bg-whatsapp-green hover:text-white active:scale-[0.98]"
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};

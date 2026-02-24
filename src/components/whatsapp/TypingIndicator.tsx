export const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="whatsapp-bubble-left flex items-center gap-1 py-3">
        <span className="w-2 h-2 rounded-full bg-whatsapp-gray typing-dot" />
        <span className="w-2 h-2 rounded-full bg-whatsapp-gray typing-dot" />
        <span className="w-2 h-2 rounded-full bg-whatsapp-gray typing-dot" />
      </div>
    </div>
  );
};

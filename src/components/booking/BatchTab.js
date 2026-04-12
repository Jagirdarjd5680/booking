export default function BatchTab({ batch, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 min-w-[100px]
        ${isActive 
          ? 'bg-secondary text-primary shadow-gold scale-105 font-bold z-10' 
          : 'bg-white text-gray-400 border border-gray-100 hover:border-secondary/30'
        }
      `}
    >
      <span className="text-sm">{batch.name}</span>
      <span className="text-[10px] mt-1 opacity-70 whitespace-nowrap">{batch.timing}</span>
    </button>
  );
}

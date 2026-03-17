const SummaryCard = ({ title, value, unit, icon: Icon, colorClass }) => (
  <div className="card flex items-center gap-5 hover:scale-[1.03] transition-all duration-300 group cursor-default shadow-lg hover:shadow-xl dark:shadow-none border-slate-200 dark:border-slate-800">
    <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-500`}>
      <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div className="flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{value}</span>
        <span className="text-sm font-semibold text-slate-400 lowercase">{unit}</span>
      </div>
    </div>
  </div>
);
export default SummaryCard;
